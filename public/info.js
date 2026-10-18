// Services page: shows data from the database in tables
const data = {}; let tab = 'garb';
const TABS = {
  garb: { src: 'areas', cols: [['name', 'cArea'], ['wet', 'cWet'], ['dry', 'cDry'], ['hazardous', 'cHaz']] },
  bus:  { src: 'buses', cols: [['route', 'cRoute'], ['from', 'cFrom'], ['to', 'cTo'], ['first', 'cFirst'], ['last', 'cLast'], ['every', 'cEvery']] },
  help: { src: 'helplines', cols: [['name', 'cName'], ['number', 'cNum']] }
};
const val = (r, k) => {
  const raw = (k === 'name' && r['name_' + lang]) ? r['name_' + lang] : (r[k] ?? '');
  return typeof raw === 'string' ? translateText(raw, lang, data.terms || []) : raw;
};

function render() {
  const tabs = document.getElementById('tabs'); tabs.innerHTML = '';
  Object.keys(TABS).forEach(k => {
    const b = document.createElement('button'); b.type = 'button';
    b.className = 'tab' + (k === tab ? ' on' : ''); b.textContent = t('t' + k[0].toUpperCase() + k.slice(1));
    b.onclick = () => { tab = k; render(); }; tabs.appendChild(b);
  });
  const { src, cols } = TABS[tab], rows = data[src] || [];
  const box = document.getElementById('table'); box.innerHTML = '';
  if (!rows.length) { box.textContent = t('empty'); return; }
  const tb = document.createElement('table');
  const hr = tb.createTHead().insertRow();
  cols.forEach(([, h]) => { const th = document.createElement('th'); th.textContent = t(h); hr.appendChild(th); });
  const body = tb.createTBody();
  rows.forEach(r => { const tr = body.insertRow(); cols.forEach(([k]) => tr.insertCell().textContent = val(r, k)); });
  box.appendChild(tb);
}
async function load() {
  for (const k of ['areas', 'buses', 'helplines', 'terms']) {
    try { const j = await (await fetch('/api/' + k)).json(); data[k] = Array.isArray(j) ? j : []; } catch { data[k] = []; }
  }
  render();
}
window.onLang = render;
renderNav('services'); applyI18n(); load();