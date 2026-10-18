// Login / Register page
const $ = id => document.getElementById(id);
let mode = 'login';

function setMode(m) {
  if (m) mode = m;
  $('tLogin').classList.toggle('on', mode === 'login');
  $('tReg').classList.toggle('on', mode === 'register');
  $('nameRow').hidden = mode !== 'register';
  $('name').required = mode === 'register';
  $('pass').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  $('go').textContent = t(mode === 'login' ? 'btnLogin' : 'btnReg');
  $('aerr').textContent = '';
}
$('tLogin').onclick = () => setMode('login');
$('tReg').onclick = () => setMode('register');

$('af').onsubmit = async e => {
  e.preventDefault(); $('aerr').textContent = '';
  const body = { email: $('email').value, password: $('pass').value };
  if (mode === 'register') body.name = $('name').value;
  try {
    const r = await fetch('/api/auth/' + mode, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const d = await r.json();
    if (d.token) { saveAuth(d.token, d.user.name); location.href = 'index.html'; }
    else $('aerr').textContent = d.error || 'Something went wrong';
  } catch { $('aerr').textContent = t('err'); }
};

window.onLang = () => setMode();
if (getToken()) { location.replace('index.html'); }
renderNav('login'); applyI18n(); setMode('login');
