// Admin panel (English only)
renderNav('admin', true); applyI18n();
const $ = id => document.getElementById(id);
let token = sessionStorage.getItem('tok'), tab = 'areas', editing = null;

const CFG = {
  areas: { label: 'Garbage areas', fields: [['name', 'Area name'], ['wet', 'Wet waste'], ['dry', 'Dry waste'], ['hazardous', 'Hazardous waste']] },
  buses: { label: 'Bus routes', fields: [['route', 'Route no.'], ['from', 'From'], ['to', 'To'], ['first', 'First bus (HH:MM)'], ['last', 'Last bus (HH:MM)'], ['every', 'Every (min)']] },
  helplines: { label: 'Helplines', fields: [['name', 'Name (English)'], ['name_hi', 'Name (Hindi)'], ['name_mr', 'Name (Marathi)'], ['number', 'Number'], ['keywords', 'Keywords (comma separated)']] },
  terms: { label: 'Translations', fields: [['en', 'English text'], ['hi', 'Hindi'], ['mr', 'Marathi']] },
  users: { label: 'Users' },
  logs: { label: 'Chat logs' }
};

async function api(path, opts = {}) {
  const r = await fetch('/api/admin/' + path, {
    ...opts, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
  });
  if (r.status === 401) { logout(); throw new Error('Please log in again'); }
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d;
}
function logout() { token = null; sessionStorage.removeItem('tok'); show(); }
function show() { $('login').hidden = !!token; $('dash').hidden = !token; if (token) load(); }

$('login').onsubmit = async e => {
  e.preventDefault(); $('lerr').textContent = '';
  const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: $('pw').value }) });
  const d = await r.json();
  if (d.token) { token = d.token; sessionStorage.setItem('tok', token); $('pw').value = ''; show(); }
  else $('lerr').textContent = d.error || 'Login failed';
};
$('out').onclick = logout;

const cell = (tr, text) => { tr.insertCell().textContent = text ?? ''; };

async function load() {
  try {
    const s = await api('stats');
    const top = s.byIntent[0] ? s.byIntent[0]._id : '–';
    const langs = s.byLang.map(l => `${l._id}: ${l.n}`).join(', ') || '–';
    $('stats').innerHTML = '';
    [['Total chats', s.total], ['Registered users', s.users], ['Top topic', top], ['By language', langs]].forEach(([k, v]) => {
      const d = document.createElement('div'); d.className = 'stat';
      const b = document.createElement('b'); b.textContent = v;
      d.append(b, document.createTextNode(k)); $('stats').appendChild(d);
    });
  } catch {}
  tabs(); panel();
}
function tabs() {
  $('tabs').innerHTML = '';
  Object.keys(CFG).forEach(k => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (k === tab ? ' on' : '');
    b.textContent = CFG[k].label; b.onclick = () => { tab = k; editing = null; tabs(); panel(); }; $('tabs').appendChild(b);
  });
}
async function panel() {
  const box = $('panel'); box.innerHTML = '';
  try { tab === 'logs' ? await logsView(box) : tab === 'users' ? await usersView(box) : await crudView(box); }
  catch (e) { box.textContent = e.message; }
}
async function logsView(box) {
  const rows = await api('logs');
  const tb = document.createElement('table'), hr = tb.createTHead().insertRow();
  ['Time', 'User', 'Lang', 'Topic', 'Question', 'Answer'].forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
  const body = tb.createTBody();
  rows.forEach(r => {
    const tr = body.insertRow();
    cell(tr, new Date(r.createdAt).toLocaleString()); cell(tr, r.userName); cell(tr, r.lang); cell(tr, r.intent);
    cell(tr, r.message); cell(tr, (r.reply || '').replace(/\n/g, ' ').slice(0, 90));
  });
  const w = document.createElement('div'); w.className = 'scroll'; w.appendChild(tb); box.appendChild(w);
}
async function usersView(box) {
  const rows = await api('users');
  const tb = document.createElement('table'), hr = tb.createTHead().insertRow();
  ['Name', 'Email', 'Registered', ''].forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
  const body = tb.createTBody();
  rows.forEach(r => {
    const tr = body.insertRow();
    cell(tr, r.name); cell(tr, r.email); cell(tr, new Date(r.createdAt).toLocaleDateString());
    const db = document.createElement('button'); db.className = 'link danger'; db.textContent = 'Delete';
    db.onclick = async () => { if (confirm('Delete this user?')) { await api('users/' + r._id, { method: 'DELETE' }); panel(); } };
    tr.insertCell().appendChild(db);
  });
  const w = document.createElement('div'); w.className = 'scroll'; w.appendChild(tb); box.appendChild(w);
}
async function crudView(box) {
  const { fields } = CFG[tab];
  const rows = await (await fetch('/api/' + tab)).json();
  const cur = editing ? rows.find(r => r._id === editing) : null;

  const form = document.createElement('form'); form.className = 'crud';
  fields.forEach(([k, label]) => {
    const l = document.createElement('label'); l.textContent = label;
    const i = document.createElement('input'); i.name = k;
    let v = cur ? cur[k] : ''; if (Array.isArray(v)) v = v.join(', ');
    i.value = v ?? ''; l.appendChild(i); form.appendChild(l);
  });
  const save = document.createElement('button'); save.className = 'btn'; save.type = 'submit';
  save.textContent = cur ? 'Save changes' : 'Add new'; form.appendChild(save);
  if (cur) { const c = document.createElement('button'); c.type = 'button'; c.className = 'link'; c.textContent = 'Cancel'; c.onclick = () => { editing = null; panel(); }; form.appendChild(c); }
  form.onsubmit = async e => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(form));
    try { await api(tab + (cur ? '/' + cur._id : ''), { method: cur ? 'PUT' : 'POST', body: JSON.stringify(body) }); editing = null; panel(); }
    catch (err) { alert(err.message); }
  };
  box.appendChild(form);

  const tb = document.createElement('table'), hr = tb.createTHead().insertRow();
  [...fields.map(f => f[1]), ''].forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
  const body = tb.createTBody();
  rows.forEach(r => {
    const tr = body.insertRow();
    fields.forEach(([k]) => cell(tr, Array.isArray(r[k]) ? r[k].join(', ') : r[k]));
    const td = tr.insertCell();
    const eb = document.createElement('button'); eb.className = 'link'; eb.textContent = 'Edit'; eb.onclick = () => { editing = r._id; panel(); scrollTo(0, 0); };
    const db = document.createElement('button'); db.className = 'link danger'; db.textContent = 'Delete';
    db.onclick = async () => { if (confirm('Delete this entry?')) { await api(tab + '/' + r._id, { method: 'DELETE' }); panel(); } };
    td.append(eb, db);
  });
  const w = document.createElement('div'); w.className = 'scroll'; w.appendChild(tb); box.appendChild(w);
}
show();