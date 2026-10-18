// Chat page (login required)
const msgs = document.getElementById('msgs'), input = document.getElementById('in'), quick = document.getElementById('quick');
let pending = null;

function add(text, who) {
  const d = document.createElement('div'); d.className = 'm ' + who; d.textContent = text;
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
}
function chips(list) {
  const w = document.createElement('div'); w.className = 'chips';
  list.forEach(o => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = o;
    b.onclick = () => send(o); w.appendChild(b);
  });
  msgs.appendChild(w); msgs.scrollTop = msgs.scrollHeight;
}
async function send(text) {
  const v = text.trim(); if (!v) return;
  add(v, 'me'); input.value = '';
  const typing = add('…', 'bot');
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ message: v, lang, pending })
    });
    if (r.status === 401) { typing.remove(); logoutUser(); return; }
    const d = await r.json();
    typing.remove(); pending = d.pending || null;
    add(d.reply, 'bot'); if (d.chips && d.chips.length) chips(d.chips);
  } catch { typing.remove(); add(t('err'), 'bot'); }
}
function locked() {
  msgs.innerHTML = ''; quick.innerHTML = '';
  add(t('needLogin'), 'bot');
  const a = document.createElement('a'); a.className = 'btn'; a.href = 'login.html';
  a.style.alignSelf = 'flex-start'; a.textContent = t('navLogin'); msgs.appendChild(a);
  input.disabled = true; document.querySelector('#f button').disabled = true;
}
function start() {
  if (!getToken()) return locked();
  msgs.innerHTML = ''; quick.innerHTML = ''; pending = null;
  add(t('welcome'), 'bot');
  ['q1', 'q2', 'q3'].forEach(k => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t(k);
    b.onclick = () => send(t(k)); quick.appendChild(b);
  });
}
document.getElementById('f').addEventListener('submit', e => { e.preventDefault(); send(input.value); });
window.onLang = start;
renderNav('home'); applyI18n(); start();
