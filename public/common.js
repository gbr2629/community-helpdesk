// Shared by all pages: translations, language toggle and top navigation
const UI = {
  en: {
    brand: 'Neighbourhood Help Desk', navHome: 'Home', navServices: 'Services', navAdmin: 'Admin',
    sign: 'Community Help Desk',
    heroTitle: 'Ask about garbage pickup, buses and helplines.',
    heroLead: 'Type a question or tap a suggestion and get an answer straight away.',
    cGarb: 'Garbage pickup', cGarbT: 'Collection days for wet, dry and hazardous waste in your area.',
    cBus: 'Bus timings', cBusT: 'Ask for a route number or destination and see the next bus.',
    cHelp: 'Helpline numbers', cHelpT: 'Police, ambulance, fire, women and child helplines in one place.',
    browse: 'Browse all information', chatTitle: 'Help Desk Assistant', ph: 'Type your question…', send: 'Send',
    welcome: "Hi! I'm the Community Help Desk assistant. Ask me about garbage pickup, bus timings or helpline numbers.",
    q1: 'When is garbage pickup?', q2: 'Next bus to Market Road', q3: 'Police and ambulance numbers',
    err: 'Could not reach the server. Check that it is running.',
    svcTitle: 'Local information', tGarb: 'Garbage pickup', tBus: 'Bus timings', tHelp: 'Helplines',
    cArea: 'Area', cWet: 'Wet waste', cDry: 'Dry waste', cHaz: 'Hazardous waste',
    cRoute: 'Route', cFrom: 'From', cTo: 'To', cFirst: 'First bus', cLast: 'Last bus', cEvery: 'Every (min)',
    cName: 'Service', cNum: 'Number', empty: 'No data yet.',
    navLogin: 'Login', navLogout: 'Logout', hiUser: 'Hi,', authTitle: 'Login or create an account', tLogin: 'Login', tReg: 'Register', fName: 'Full name', fEmail: 'Email', fPass: 'Password (min 6 characters)', btnLogin: 'Log in', btnReg: 'Create account', needLogin: 'Please log in to use the chatbot.'
  },
  hi: {
    brand: 'पड़ोस सहायता केंद्र', navHome: 'होम', navServices: 'सेवाएँ', navAdmin: 'एडमिन',
    sign: 'सामुदायिक सहायता केंद्र',
    heroTitle: 'कचरा संग्रह, बस और हेल्पलाइन के बारे में पूछें।',
    heroLead: 'सवाल लिखें या सुझाव पर टैप करें और तुरंत जवाब पाएँ।',
    cGarb: 'कचरा संग्रह', cGarbT: 'आपके इलाके में गीले, सूखे और खतरनाक कचरे के संग्रह के दिन।',
    cBus: 'बस समय', cBusT: 'रूट नंबर या गंतव्य पूछें और अगली बस देखें।',
    cHelp: 'हेल्पलाइन नंबर', cHelpT: 'पुलिस, एम्बुलेंस, दमकल, महिला और बाल हेल्पलाइन एक जगह।',
    browse: 'सारी जानकारी देखें', chatTitle: 'सहायता केंद्र असिस्टेंट', ph: 'अपना सवाल लिखें…', send: 'भेजें',
    welcome: 'नमस्ते! मैं सामुदायिक सहायता केंद्र का असिस्टेंट हूँ। कचरा संग्रह, बस समय या हेल्पलाइन नंबर के बारे में पूछें।',
    q1: 'कचरा संग्रह कब होता है?', q2: 'Market Road की अगली बस', q3: 'पुलिस और एम्बुलेंस नंबर',
    err: 'सर्वर से संपर्क नहीं हो सका। जाँचें कि वह चल रहा है।',
    svcTitle: 'स्थानीय जानकारी', tGarb: 'कचरा संग्रह', tBus: 'बस समय', tHelp: 'हेल्पलाइन',
    cArea: 'इलाका', cWet: 'गीला कचरा', cDry: 'सूखा कचरा', cHaz: 'खतरनाक कचरा',
    cRoute: 'रूट', cFrom: 'से', cTo: 'तक', cFirst: 'पहली बस', cLast: 'आखिरी बस', cEvery: 'हर (मिनट)',
    cName: 'सेवा', cNum: 'नंबर', empty: 'अभी कोई डेटा नहीं।',
    navLogin: 'लॉगिन', navLogout: 'लॉगआउट', hiUser: 'नमस्ते,', authTitle: 'लॉगिन करें या खाता बनाएँ', tLogin: 'लॉगिन', tReg: 'रजिस्टर', fName: 'पूरा नाम', fEmail: 'ईमेल', fPass: 'पासवर्ड (कम से कम 6 अक्षर)', btnLogin: 'लॉग इन करें', btnReg: 'खाता बनाएँ', needLogin: 'चैटबॉट इस्तेमाल करने के लिए कृपया लॉगिन करें।'
  },
  mr: {
    brand: 'शेजार मदत केंद्र', navHome: 'मुख्यपृष्ठ', navServices: 'सेवा', navAdmin: 'अ‍ॅडमिन',
    sign: 'सामुदायिक मदत केंद्र',
    heroTitle: 'कचरा संकलन, बस आणि हेल्पलाइनबद्दल विचारा.',
    heroLead: 'प्रश्न लिहा किंवा सूचनेवर टॅप करा आणि लगेच उत्तर मिळवा.',
    cGarb: 'कचरा संकलन', cGarbT: 'तुमच्या परिसरात ओला, सुका आणि घातक कचरा संकलनाचे दिवस.',
    cBus: 'बस वेळापत्रक', cBusT: 'मार्ग क्रमांक किंवा ठिकाण विचारा आणि पुढची बस पहा.',
    cHelp: 'हेल्पलाइन क्रमांक', cHelpT: 'पोलीस, रुग्णवाहिका, अग्निशमन, महिला आणि बाल हेल्पलाइन एकाच ठिकाणी.',
    browse: 'सर्व माहिती पहा', chatTitle: 'मदत केंद्र असिस्टंट', ph: 'तुमचा प्रश्न लिहा…', send: 'पाठवा',
    welcome: 'नमस्कार! मी सामुदायिक मदत केंद्राचा असिस्टंट आहे. कचरा संकलन, बस वेळापत्रक किंवा हेल्पलाइन क्रमांकाबद्दल विचारा.',
    q1: 'कचरा संकलन कधी होते?', q2: 'Market Road ची पुढची बस', q3: 'पोलीस आणि रुग्णवाहिका क्रमांक',
    err: 'सर्व्हरशी संपर्क होऊ शकला नाही. तो सुरू आहे का ते तपासा.',
    svcTitle: 'स्थानिक माहिती', tGarb: 'कचरा संकलन', tBus: 'बस वेळापत्रक', tHelp: 'हेल्पलाइन',
    cArea: 'परिसर', cWet: 'ओला कचरा', cDry: 'सुका कचरा', cHaz: 'घातक कचरा',
    cRoute: 'मार्ग', cFrom: 'पासून', cTo: 'पर्यंत', cFirst: 'पहिली बस', cLast: 'शेवटची बस', cEvery: 'दर (मिनिटे)',
    cName: 'सेवा', cNum: 'क्रमांक', empty: 'अजून डेटा नाही.',
    navLogin: 'लॉगिन', navLogout: 'लॉगआउट', hiUser: 'नमस्कार,', authTitle: 'लॉगिन करा किंवा खाते उघडा', tLogin: 'लॉगिन', tReg: 'नोंदणी', fName: 'पूर्ण नाव', fEmail: 'ईमेल', fPass: 'पासवर्ड (किमान 6 अक्षरे)', btnLogin: 'लॉग इन करा', btnReg: 'खाते उघडा', needLogin: 'चॅटबॉट वापरण्यासाठी कृपया लॉगिन करा.'
  }
};

let lang = localStorage.getItem('lang') || 'en';
const t = k => (UI[lang] && UI[lang][k]) || UI.en[k] || k;

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(e => e.textContent = t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e => e.placeholder = t(e.dataset.i18nPh));
}

// ---- Login helpers (token is kept in the browser) ----
const getToken = () => localStorage.getItem('utoken');
function saveAuth(token, name) { localStorage.setItem('utoken', token); localStorage.setItem('uname', name); }
function logoutUser() { localStorage.removeItem('utoken'); localStorage.removeItem('uname'); location.href = 'login.html'; }

function renderNav(active, hideLang) {
  const links = [['home', 'index.html', 'navHome'], ['services', 'services.html', 'navServices'], ['admin', 'admin.html', 'navAdmin']];
  const name = getToken() ? localStorage.getItem('uname') : null;
  const authHtml = name
    ? '<span class="who"><span data-i18n="hiUser"></span> <b id="uname"></b></span><button type="button" class="link" id="logout" data-i18n="navLogout"></button>'
    : `<a class="loginlink ${active === 'login' ? 'on' : ''}" href="login.html" data-i18n="navLogin"></a>`;
  document.getElementById('nav').innerHTML =
    `<header class="nav"><a class="brand" href="index.html">🚌 <span data-i18n="brand"></span></a>
     <nav>${links.map(([k, h, i]) => `<a href="${h}" class="${k === active ? 'on' : ''}" data-i18n="${i}"></a>`).join('')}</nav>
     ${authHtml}
     ${hideLang ? '' : '<select id="lang" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select>'}</header>`;
  if (name) document.getElementById('uname').textContent = name;
  const lo = document.getElementById('logout'); if (lo) lo.onclick = logoutUser;
  const sel = document.getElementById('lang');
  if (sel) {
    sel.value = lang;
    sel.onchange = () => { lang = sel.value; localStorage.setItem('lang', lang); applyI18n(); if (window.onLang) window.onLang(); };
  }
}

// Replace known English phrases with the admin-defined Hindi / Marathi version
function translateText(text, language, terms) {
  if (!text || language === 'en' || !Array.isArray(terms)) return text;
  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let out = String(text);
  terms.filter(x => x[language]).sort((a, b) => b.en.length - a.en.length).forEach(x => {
    out = out.replace(new RegExp('\\b' + esc(x.en) + '\\b', 'gi'), x[language]);
  });
  return out;
}