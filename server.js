require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const { Area, Bus, Helpline, User, Term, ChatLog } = require('./models');
const { handle } = require('./bot');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const models = { areas: Area, buses: Bus, helplines: Helpline, terms: Term };
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(400).json({ error: e.message }));

// ---------- Password hashing (built-in crypto, no extra package) ----------
const hashPw = (pw, salt) => new Promise((ok, no) =>
  crypto.scrypt(pw, salt, 64, (e, key) => e ? no(e) : ok(key.toString('hex'))));
const bearer = req => (req.headers.authorization || '').replace('Bearer ', '');

// A normal logged-in user (or the admin) may chat
const userAuth = (req, res, next) => {
  try { req.user = jwt.verify(bearer(req), SECRET); next(); }
  catch { res.status(401).json({ error: 'Please log in' }); }
};
// Only the admin token is accepted here
const auth = (req, res, next) => {
  try { if (!jwt.verify(bearer(req), SECRET).admin) throw new Error('not admin'); next(); }
  catch { res.status(401).json({ error: 'Please log in again' }); }
};
const userToken = u => jwt.sign({ uid: String(u._id), name: u.name, email: u.email, role: 'user' }, SECRET, { expiresIn: '7d' });

// ---------- User register / login ----------
app.post('/api/auth/register', wrap(async (req, res) => {
  const name = String(req.body.name || '').trim().slice(0, 60);
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!name) return res.status(400).json({ error: 'Please enter your name' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (await User.findOne({ email })) return res.status(409).json({ error: 'This email is already registered. Please log in.' });
  const salt = crypto.randomBytes(16).toString('hex');
  const u = await User.create({ name, email, salt, hash: await hashPw(password, salt) });
  res.json({ token: userToken(u), user: { name: u.name, email: u.email } });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const bad = () => res.status(401).json({ error: 'Wrong email or password' });
  const u = await User.findOne({ email });
  if (!u) return bad();
  const h = Buffer.from(await hashPw(password, u.salt), 'hex');
  const stored = Buffer.from(u.hash, 'hex');
  if (h.length !== stored.length || !crypto.timingSafeEqual(h, stored)) return bad();
  res.json({ token: userToken(u), user: { name: u.name, email: u.email } });
}));

// ---------- Chat (login required) ----------
app.post('/api/chat', userAuth, wrap(async (req, res) => {
  const { message = '', lang = 'en', pending = null } = req.body;
  const msg = String(message).slice(0, 300);
  const out = await handle({ message: msg, lang, pending });
  ChatLog.create({
    message: msg, reply: out.reply, intent: out.intent, lang,
    userName: req.user.name || 'Admin', userEmail: req.user.email || ''
  }).catch(() => {});
  res.json(out);
}));

// ---------- Admin auth ----------
app.post('/api/admin/login', (req, res) => {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw && req.body.password === pw) {
    return res.json({ token: jwt.sign({ admin: true }, SECRET, { expiresIn: '8h' }) });
  }
  res.status(401).json({ error: 'Wrong password' });
});

// ---------- Admin: logs, stats, users ----------
app.get('/api/admin/logs', auth, wrap(async (req, res) =>
  res.json(await ChatLog.find().sort({ createdAt: -1 }).limit(200))));

app.get('/api/admin/stats', auth, wrap(async (req, res) => {
  const [total, users, byIntent, byLang] = await Promise.all([
    ChatLog.countDocuments(),
    User.countDocuments(),
    ChatLog.aggregate([{ $group: { _id: '$intent', n: { $sum: 1 } } }, { $sort: { n: -1 } }]),
    ChatLog.aggregate([{ $group: { _id: '$lang', n: { $sum: 1 } } }, { $sort: { n: -1 } }])
  ]);
  res.json({ total, users, byIntent, byLang });
}));

app.get('/api/admin/users', auth, wrap(async (req, res) =>
  res.json(await User.find().select('name email createdAt').sort({ createdAt: -1 }))));
app.delete('/api/admin/users/:id', auth, wrap(async (req, res) => {
  await User.findByIdAndDelete(req.params.id); res.json({ ok: true });
}));

// ---------- Admin: add / edit / delete data ----------
const pick = (req, res, next) => {
  req.M = models[req.params.col];
  req.M ? next() : res.status(404).json({ error: 'Unknown collection' });
};
const clean = b => {
  if (typeof b.keywords === 'string') b.keywords = b.keywords.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return b;
};
app.post('/api/admin/:col', auth, pick, wrap(async (req, res) => res.json(await req.M.create(clean(req.body)))));
app.put('/api/admin/:col/:id', auth, pick, wrap(async (req, res) =>
  res.json(await req.M.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true }))));
app.delete('/api/admin/:col/:id', auth, pick, wrap(async (req, res) => {
  await req.M.findByIdAndDelete(req.params.id); res.json({ ok: true });
}));

// ---------- Public data (used by the Services page) ----------
app.get('/api/:col', pick, wrap(async (req, res) => res.json(await req.M.find().sort({ _id: 1 }))));

// ---------- Start ----------
const PORT = process.env.PORT || 5000;
if (!process.env.ADMIN_PASSWORD) console.warn('⚠  ADMIN_PASSWORD is not set in .env – admin login is disabled.');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_helpdesk')
  .then(() => app.listen(PORT, () => console.log(`Help desk running at http://localhost:${PORT}`)))
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });