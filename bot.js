const { Area, Bus, Helpline, Term } = require('./models');

// ---------- Bot replies in three languages ----------
const T = {
  en: {
    loc: 'en-IN',
    busWord: 'Bus',
    hello: 'Hello! I can help with garbage pickup, bus timings and helpline numbers. What would you like to know?',
    thanks: "You're welcome! Ask me anything else about the neighbourhood.",
    askArea: 'Which area are you in?',
    askRoute: 'Which bus route do you need?',
    pickRoute: 'These routes match your places:',
    unknown: "Sorry, I don't have an answer for that yet. I can help with:",
    main: ['Garbage pickup', 'Bus timings', 'Helpline numbers'],
    garb: (a, d) => `Garbage pickup for ${a.name}:\n• Wet waste: ${a.wet}\n• Dry waste: ${a.dry}\n• Hazardous waste: ${a.hazardous}\n\nToday is ${d}. Keep waste in separate bins before the truck arrives.`,
    bus: (b, f, l, line) => `Bus ${b.route}: ${b.from} to ${b.to}\n• First bus: ${f}\n• Last bus: ${l}\n• Every ${b.every} minutes\n\n${line}`,
    next: (t, m) => `Next bus: ${t} (in ${m} min).`,
    gone: t => `The last bus for today has left. Tomorrow the first bus is at ${t}.`,
    helpTitle: 'Helpline numbers:',
    helpNote: 'For any life-threatening situation, call 112 right away.'
  },
  hi: {
    loc: 'hi-IN',
    busWord: 'बस',
    hello: 'नमस्ते! मैं कचरा संग्रह, बस समय और हेल्पलाइन नंबरों में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?',
    thanks: 'आपका स्वागत है! पड़ोस के बारे में कुछ और पूछना हो तो बताइए।',
    askArea: 'आप किस इलाके में रहते हैं?',
    askRoute: 'आपको कौन सा बस रूट चाहिए?',
    pickRoute: 'आपके बताए स्थानों से ये रूट मिलते हैं:',
    unknown: 'माफ़ कीजिए, इसका जवाब मेरे पास अभी नहीं है। मैं इनमें मदद कर सकता हूँ:',
    main: ['कचरा संग्रह', 'बस समय', 'हेल्पलाइन नंबर'],
    garb: (a, d) => `${a.name} में कचरा संग्रह:\n• गीला कचरा: ${a.wet}\n• सूखा कचरा: ${a.dry}\n• खतरनाक कचरा: ${a.hazardous}\n\nआज ${d} है। गाड़ी आने से पहले कचरा अलग-अलग डिब्बों में रखें।`,
    bus: (b, f, l, line) => `बस ${b.route}: ${b.from} से ${b.to}\n• पहली बस: ${f}\n• आखिरी बस: ${l}\n• हर ${b.every} मिनट में\n\n${line}`,
    next: (t, m) => `अगली बस: ${t} (${m} मिनट में)।`,
    gone: t => `आज की आखिरी बस जा चुकी है। कल पहली बस ${t} पर है।`,
    helpTitle: 'हेल्पलाइन नंबर:',
    helpNote: 'जान को खतरा हो तो तुरंत 112 पर कॉल करें।'
  },
  mr: {
    loc: 'mr-IN',
    busWord: 'बस',
    hello: 'नमस्कार! मी कचरा संकलन, बस वेळापत्रक आणि हेल्पलाइन क्रमांकांबद्दल मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?',
    thanks: 'आपले स्वागत आहे! परिसराबद्दल आणखी काही विचारायचे असल्यास सांगा.',
    askArea: 'तुम्ही कोणत्या परिसरात राहता?',
    askRoute: 'तुम्हाला कोणता बस मार्ग हवा आहे?',
    pickRoute: 'तुम्ही सांगितलेल्या ठिकाणांसाठी हे मार्ग आहेत:',
    unknown: 'क्षमस्व, याचे उत्तर माझ्याकडे अजून नाही. मी यात मदत करू शकतो:',
    main: ['कचरा संकलन', 'बस वेळापत्रक', 'हेल्पलाइन क्रमांक'],
    garb: (a, d) => `${a.name} मधील कचरा संकलन:\n• ओला कचरा: ${a.wet}\n• सुका कचरा: ${a.dry}\n• घातक कचरा: ${a.hazardous}\n\nआज ${d} आहे. गाडी येण्यापूर्वी कचरा वेगवेगळ्या डब्यांत ठेवा.`,
    bus: (b, f, l, line) => `बस ${b.route}: ${b.from} ते ${b.to}\n• पहिली बस: ${f}\n• शेवटची बस: ${l}\n• दर ${b.every} मिनिटांनी\n\n${line}`,
    next: (t, m) => `पुढची बस: ${t} (${m} मिनिटांत).`,
    gone: t => `आजची शेवटची बस निघून गेली आहे. उद्या पहिली बस ${t} ला आहे.`,
    helpTitle: 'हेल्पलाइन क्रमांक:',
    helpNote: 'जीवाला धोका असल्यास लगेच 112 वर कॉल करा.'
  }
};

// ---------- Keywords that trigger each topic (English, Hindi, Marathi) ----------
const KW = {
  hello:   ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'नमस्कार', 'हाय'],
  thanks:  ['thank', 'धन्यवाद', 'आभार', 'शुक्रिया'],
  garbage: ['garbage', 'trash', 'waste', 'pickup', 'pick up', 'collection', 'dustbin', 'kachra', 'कचरा', 'कूड़ा'],
  bus:     ['bus', 'route', 'timing', 'transport', 'बस'],
  help:    ['helpline', 'emergency', 'number', 'call', '112', 'हेल्पलाइन', 'नंबर', 'क्रमांक', 'आपात', 'आणीबाणी']
};

const has = (t, list) => list.some(k => t.includes(k));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = m => { const h = Math.floor(m / 60) % 24, mi = m % 60; return `${(h + 11) % 12 + 1}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

// Replace known English phrases with the admin-defined Hindi / Marathi version
function translateText(text, lang, terms) {
  if (!text || lang === 'en') return text;
  const esc2 = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let out = String(text);
  terms.filter(x => x[lang]).sort((a, b) => b.en.length - a.en.length).forEach(x => {
    out = out.replace(new RegExp('\\b' + esc2(x.en) + '\\b', 'gi'), x[lang]);
  });
  return out;
}

async function handle({ message, lang, pending }) {
  const L = T[lang] || T.en;
  const lg = T[lang] ? lang : 'en';
  const t = message.toLowerCase().trim();
  const [areas, buses, helplines, terms] = await Promise.all([Area.find(), Bus.find(), Helpline.find(), Term.find()]);

  const tx = s => translateText(s, lg, terms);
  // a place can be typed in English, Hindi or Marathi
  const variants = w => {
    const m = terms.find(x => x.en.toLowerCase() === String(w).toLowerCase());
    return [w, m && m.hi, m && m.mr].filter(Boolean).map(v => String(v).toLowerCase());
  };
  const mentions = (s, w) => variants(w).some(v => s.includes(v));
  const areaIn = s => areas.find(a => mentions(s, a.name));
  const routeIn = s => buses.find(b => new RegExp('(^|\\D)' + esc(b.route.toLowerCase()) + '(\\D|$)').test(s));

  const reply = (intent, text, chips = [], pend = null) => ({ intent, reply: text, chips, pending: pend });

  const garbage = a => reply('garbage', L.garb(
    { name: tx(a.name), wet: tx(a.wet), dry: tx(a.dry), hazardous: tx(a.hazardous) },
    new Date().toLocaleDateString(L.loc, { weekday: 'long' })));
  const busChip = b => `${L.busWord} ${b.route} – ${tx(b.to)}`;
  const bus = b => {
    const now = new Date(), cur = now.getHours() * 60 + now.getMinutes();
    const f = toMin(b.first), l = toMin(b.last);
    const nx = cur <= f ? f : cur > l ? null : f + Math.ceil((cur - f) / b.every) * b.every;
    const line = nx === null || nx > l ? L.gone(fmt(f)) : L.next(fmt(nx), nx - cur);
    return reply('bus', L.bus({ route: b.route, from: tx(b.from), to: tx(b.to), every: b.every }, fmt(f), fmt(l), line));
  };
  const helpline = list => {
    const lines = list.map(h => `• ${h['name_' + lg] || h.name}: ${h.number}`).join('\n');
    return reply('helpline', (list.length === helplines.length ? L.helpTitle + '\n' : '') + lines + '\n\n' + L.helpNote);
  };

  // Answers to a question the bot just asked
  if (pending === 'area')  { const a = areaIn(t);  if (a) return garbage(a); }
  if (pending === 'route') { const b = routeIn(t); if (b) return bus(b); }

  if (t.split(/[\s,.!?]+/).some(w => KW.hello.includes(w))) return reply('greeting', L.hello, L.main);
  if (has(t, KW.thanks)) return reply('thanks', L.thanks);

  if (has(t, KW.garbage)) {
    const a = areaIn(t);
    return a ? garbage(a) : reply('garbage', L.askArea, areas.map(x => tx(x.name)), 'area');
  }

  const hits = helplines.filter(h => h.keywords.some(k => t.includes(k.toLowerCase())));
  if (hits.length) return helpline(hits);

  const route = routeIn(t);
  const places = buses.filter(b => mentions(t, b.to) || mentions(t, b.from));
  if (has(t, KW.bus) || route) {
    if (route) return bus(route);
    if (places.length === 1) return bus(places[0]);
    if (places.length > 1) return reply('bus', L.pickRoute, places.map(busChip), 'route');
    return reply('bus', L.askRoute, buses.map(busChip), 'route');
  }

  if (has(t, KW.help)) return helpline(helplines);
  return reply('unknown', L.unknown, L.main);
}

module.exports = { handle };