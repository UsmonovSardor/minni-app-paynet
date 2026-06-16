/* ═══════════════════════════════════════════
   KAFIL SUG'URTA × PAYNET  —  Mini App v2
   ═══════════════════════════════════════════ */
'use strict';

const API = 'https://kafil.uz/api';

/* ── STATE ──────────────────────────────────── */
const S = {
  product: null,
  vehicle: null,   // vehicle API response
  owner: null,     // driver-summary API response
  calc: null,      // calculate API response
  period: 12,
  territory: 1,
  form: {
    govNumber: '',
    techSeria: '',
    techNumber: '',
    phone: '',
    pinfl: '',
    pSeria: '',
    pNumber: '',
  },
  stack: [],
  kasko: { brand: null, model: null, trim: null, year: null, price: null },
  simple: { pid: null, phone: '' },
  travel: {
    country: '', countryLabel: '', program: 'BASIC', repeat: 1,
    startDate: '', endDate: '', days: '', purpose: 'TOURISM',
    person: { pinfl: '', pSeria: '', pNumber: '', firstName: '', lastName: '', surName: '',
      gender: 'm', birthDate: '', address: '', phone: '' },
    premium: null, insuredAmount: null, agreement: null,
  },
};

/* ── PRODUCTS ───────────────────────────────── */
const PRODUCTS = [
  {
    id: 'osago',
    name: "Majburiy avtosug'urta",
    desc: "Sug'urta narxini darhol hisoblang va oddiy tarzda rasmiylаshtiring",
    price: '168 000',
    cat: 'auto',
    icon: '🚗',
    bg: '#DBEAFE',
    live: true,
  },
  {
    id: 'kasko',
    name: 'KASKO',
    desc: "Avtomobilingizni to'liq himoya qiling",
    price: '450 000',
    cat: 'auto',
    icon: '🛡️',
    bg: '#D1FAE5',
    live: true,
  },
  {
    id: 'travel',
    name: "Chet elga sayohat sug'urtasi",
    desc: "Chet elda tibbiy xizmat va baxtsiz hodisalardan himoya",
    price: '55 000',
    cat: 'travel',
    icon: '✈️',
    bg: '#E0E7FF',
    live: true,
  },
  {
    id: 'accident',
    name: "Baxtsiz hodisa sug'urtasi",
    desc: "Shaxsiy baxtsiz hodisalardan himoya",
    price: '50 000',
    cat: 'health',
    icon: '🏥',
    bg: '#FCE7F3',
    live: true,
  },
  {
    id: 'property',
    name: "Mol-mulk sug'urtasi",
    desc: "Uy va mol-mulkingizni himoya qiling",
    price: '120 000',
    cat: 'other',
    icon: '🏠',
    bg: '#FEF3C7',
    live: true,
  },
];

const CATS = [
  { id: 'all',    name: 'Barcha dasturlar' },
  { id: 'auto',   name: "Avtosug'urta" },
  { id: 'travel', name: 'Sayohat' },
  { id: 'health', name: "Sog'liq" },
];

const PERIODS = [
  { val: 1,  label: '1 oy' },
  { val: 3,  label: '3 oy' },
  { val: 6,  label: '6 oy' },
  { val: 12, label: '1 yil' },
];

let activeCat = 'all';

/* ── ROUTER ─────────────────────────────────── */
let curId = null;

function go(id, params = {}, replace = false) {
  const app = document.getElementById('app');

  // Remove any existing instance of this screen
  const old = document.getElementById(`sc-${id}`);
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'screen';
  div.id = `sc-${id}`;
  app.appendChild(div);
  div.innerHTML = SCREENS[id] ? SCREENS[id](params) : '';
  afterRender(id, params);

  if (curId) {
    const prev = document.getElementById(`sc-${curId}`);
    if (prev) prev.classList.add('prev');
    if (!replace) S.stack.push(curId);
  }

  requestAnimationFrame(() => div.classList.add('active'));
  curId = id;
}

function back() {
  if (!S.stack.length) return;
  const prev = S.stack.pop();
  const cur = document.getElementById(`sc-${curId}`);
  if (cur) {
    cur.classList.remove('active');
    setTimeout(() => cur.remove(), 300);
  }
  const target = document.getElementById(`sc-${prev}`);
  if (target) { target.classList.remove('prev'); target.classList.add('active'); }
  curId = prev;
}

/* ── API CALLS ──────────────────────────────── */
async function apiPost(path, data, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(API + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl.signal,
    });
    return await r.json();
  } catch (e) {
    if (e.name === 'AbortError') {
      const timeoutErr = new Error('TIMEOUT');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/* ── HELPERS ────────────────────────────────── */
function fmt(n) {
  const num = typeof n === 'string' ? parseFloat(n.replace(/\s/g, '')) : Number(n);
  if (isNaN(num)) return String(n);
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function haptic(ms = 8) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
}

function netErrorMsg(e) {
  if (e && e.isTimeout) return "Internet sekin — qaytadan urinib ko'ring";
  return "Server bilan bog'lanib bo'lmadi";
}

/* ── DRAFT PERSISTENCE (resume after accidental close) ───── */
const DRAFT_KEY = 'kf_draft_v1';
const DRAFT_TTL = 30 * 60 * 1000; // 30 min

function saveDraft() {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      t: Date.now(),
      pid: S.product?.id,
      form: S.form,
      period: S.period,
      territory: S.territory,
    }));
  } catch {}
}

function loadDraft(pid) {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (d.pid !== pid || Date.now() - d.t > DRAFT_TTL) return null;
    return d;
  } catch { return null; }
}

function clearDraft() {
  try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
}

function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('error');
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' },
  ], { duration: 300, easing: 'ease' });
  setTimeout(() => el.classList.remove('error'), 1500);
  el.focus();
}

function showToast(msg, type = '') {
  let el = document.getElementById('kf-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'kf-toast';
    el.className = 'toast';
    document.getElementById('app').appendChild(el);
  }
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

function showLoader(screenId) {
  const sc = document.getElementById(`sc-${screenId}`);
  if (!sc) return;
  let ov = sc.querySelector('.loading-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.className = 'loading-overlay';
    ov.innerHTML = `<div class="spinner"></div><div class="loading-text">Iltimos kuting...</div>`;
    sc.appendChild(ov);
  }
  ov.style.display = 'flex';
}

function hideLoader(screenId) {
  const ov = document.querySelector(`#sc-${screenId} .loading-overlay`);
  if (ov) ov.style.display = 'none';
}

function setBtnLoading(btnId, on) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (on) {
    btn.disabled = true;
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-sm"></span>';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
  }
}

/* ── HEADER BUILDERS ────────────────────────── */
function hdrBrand(title = '') {
  return `
  <header class="hdr">
    <div class="hdr-brand">
      <span class="hdr-kafil">KAFIL</span>
      <span class="hdr-sep">×</span>
      <span class="hdr-pay">●paynet</span>
    </div>
    ${title ? `<span class="hdr-title">${title}</span>` : ''}
    <button class="hdr-close" onclick="closeApp()">✕</button>
  </header>`;
}

function hdrBack(title) {
  return `
  <header class="hdr">
    <button class="hdr-back" onclick="back()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <span class="hdr-title">${title}</span>
    <button class="hdr-close" onclick="closeApp()">✕</button>
  </header>`;
}

function closeApp() {
  if (window.history.length > 1) window.history.back();
}

/* ── STEP BAR ───────────────────────────────── */
function stepBar(cur, total) {
  let html = '<div class="steps">';
  for (let i = 1; i <= total; i++) {
    const cls = i < cur ? 'done' : i === cur ? 'active' : '';
    html += `<div class="step-dot ${cls}"></div>`;
    if (i < total) html += `<div class="step-line ${i < cur ? 'done' : ''}"></div>`;
  }
  return html + '</div>';
}

/* ══════════════════════════════════════════════
   SCREENS
   ══════════════════════════════════════════════ */
const SCREENS = {};

/* ── SPLASH ─────────────────────────────────── */
SCREENS.splash = () => `
  <div class="splash">
    <div class="splash-logo">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
        <path d="M40 8L10 20V42C10 58 24 70 40 74C56 70 70 58 70 42V20L40 8Z" fill="#C0282C"/>
        <path d="M33 41L38 46L49 34" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="splash-brand">KAFIL SUG'URTA</div>
    <div class="splash-x">×</div>
    <div class="splash-paynet">●paynet</div>
    <div class="splash-dots">
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
    </div>
  </div>
`;

/* ── HOME (Products list) ────────────────────── */
SCREENS.home = () => `
  ${hdrBrand()}
  <div class="page">
    <h1 class="page-title">Sug'urta turlari</h1>
    <div class="cats">
      ${CATS.map(c => `
        <button class="cat ${activeCat === c.id ? 'active' : ''}"
          onclick="filterCat('${c.id}',this)">${c.name}</button>
      `).join('')}
    </div>
    <div id="prod-list" class="fade-up">
      ${renderProdList()}
    </div>
  </div>
`;

function renderProdList() {
  const list = activeCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
  if (!list.length) return `
    <div class="empty">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">Mahsulotlar topilmadi</div>
    </div>`;

  return list.map(p => `
    <div class="prod-card ${p.live ? '' : 'prod-card--soon'}">
      <div class="prod-top">
        <div class="prod-icon" style="background:${p.bg}">${p.icon}</div>
        <div class="prod-info">
          <div class="prod-name">${p.name}</div>
          <div class="prod-desc">${p.desc}</div>
          <div class="prod-price">${fmt(p.price)} UZS <span>dan</span></div>
        </div>
        ${!p.live ? '<span class="soon-badge">Tez orada</span>' : ''}
      </div>
      ${p.live
        ? `<button class="btn btn-green" onclick="buyProduct('${p.id}')">Sotib olish</button>`
        : `<button class="btn btn-soon" disabled>Tez orada qo'shiladi</button>`
      }
    </div>
  `).join('');
}

function filterCat(id, el) {
  activeCat = id;
  document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  const list = document.getElementById('prod-list');
  if (list) {
    list.style.opacity = '0';
    list.style.transform = 'translateY(6px)';
    list.innerHTML = renderProdList();
    requestAnimationFrame(() => {
      list.style.transition = 'opacity .2s ease, transform .25s cubic-bezier(0.34,1.56,0.64,1)';
      list.style.opacity = '1';
      list.style.transform = 'translateY(0)';
    });
  }
}

function buyProduct(id) {
  haptic(10);
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  S.product = p;
  S.vehicle = null; S.owner = null; S.calc = null;

  const draft = loadDraft(id);
  if (draft) {
    S.form = { govNumber: '', techSeria: '', techNumber: '', phone: '', pinfl: '', pSeria: '', pNumber: '', ...draft.form };
    S.period = draft.period ?? 12;
    S.territory = draft.territory ?? 1;
    showToast("Avvalgi ma'lumotlar tiklandi");
  } else {
    S.period = 12; S.territory = 1;
    S.form = { govNumber: '', techSeria: '', techNumber: '', phone: '', pinfl: '', pSeria: '', pNumber: '' };
  }
  S.stack = ['home'];

  if (id === 'kasko') {
    S.kasko = { brand: null, model: null, trim: null, year: null, price: null };
    go('kaskoBrand');
    return;
  }

  if (id === 'travel') {
    S.travel = {
      country: '', countryLabel: '', program: 'BASIC', repeat: 1,
      startDate: '', endDate: '', days: '', purpose: 'TOURISM',
      person: { pinfl: '', pSeria: '', pNumber: '', firstName: '', lastName: '', surName: '',
        gender: 'm', birthDate: '', address: '', phone: '' },
      premium: null, insuredAmount: null, agreement: null,
    };
    go('travelTrip');
    return;
  }

  if (id === 'accident' || id === 'property') {
    S.simple = { pid: id, phone: '' };
    go('simpleForm', { pid: id });
    return;
  }

  if (p.live) go('step1');
}

/* ── OSAGO STEP 1: Avto ma'lumotlari ────────── */
SCREENS.step1 = () => `
  ${hdrBack("Majburiy avtosug'urta")}
  <div class="page">
    ${stepBar(1, 4)}
    <h2 class="section-title">Avto ma'lumotlari</h2>

    <div class="form-group">
      <label class="form-label">Davlat raqami</label>
      <input id="govNum" type="text" class="form-input"
        placeholder="01A000AA"
        value="${S.form.govNumber}"
        maxlength="10"
        autocomplete="off"
        oninput="this.value=this.value.toUpperCase().replace(/\\s/g,'')">
    </div>

    <div class="form-group">
      <label class="form-label">Texnik pasport raqami</label>
      <div class="input-row">
        <input id="techS" type="text" class="form-input"
          placeholder="AAF" maxlength="3"
          value="${S.form.techSeria}"
          style="width:90px;flex-shrink:0"
          autocomplete="off"
          oninput="this.value=this.value.toUpperCase()">
        <input id="techN" type="text" class="form-input"
          placeholder="0000000" maxlength="7"
          value="${S.form.techNumber}"
          inputmode="numeric"
          autocomplete="off">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Telefon raqamingiz</label>
      <div class="input-row">
        <span class="phone-prefix">+998</span>
        <input id="phone" type="tel" class="form-input"
          placeholder="90 123 45 67"
          value="${S.form.phone}"
          inputmode="numeric"
          maxlength="12"
          oninput="fmtPhone(this)">
      </div>
    </div>

    <a href="#" class="link-green" onclick="return false">Sug'urta qoidalari</a>

    <div class="contact-block">
      <p>Yagona aloqa markazi</p>
      <a href="tel:+998712000414">📞 +998 71 200 04 14</a>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btn1" class="btn btn-green" onclick="submitStep1()">
      Davom etish &rsaquo;
    </button>
  </div>
`;

function fmtPhone(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 9);
  let f = v.slice(0, 2);
  if (v.length > 2) f += ' ' + v.slice(2, 5);
  if (v.length > 5) f += ' ' + v.slice(5, 7);
  if (v.length > 7) f += ' ' + v.slice(7, 9);
  el.value = f;
}

async function submitStep1() {
  const gov  = (document.getElementById('govNum')?.value || '').toUpperCase().replace(/\s/g, '');
  const ts   = (document.getElementById('techS')?.value || '').toUpperCase();
  const tn   = (document.getElementById('techN')?.value || '');
  const ph   = (document.getElementById('phone')?.value || '').replace(/\D/g, '');

  if (!gov)            { haptic(20); shakeInput('govNum'); showToast('Davlat raqamini kiriting', 'error'); return; }
  if (ts.length < 2)   { haptic(20); shakeInput('techS'); showToast('Texnik pasport seriasini kiriting', 'error'); return; }
  if (tn.length < 7)   { haptic(20); shakeInput('techN'); showToast('Texnik pasport raqamini kiriting', 'error'); return; }
  if (ph.length < 9)   { haptic(20); shakeInput('phone'); showToast('Telefon raqamini kiriting', 'error'); return; }

  S.form.govNumber = gov;
  S.form.techSeria = ts;
  S.form.techNumber = tn;
  S.form.phone = ph;
  saveDraft();

  setBtnLoading('btn1', true);
  try {
    const res = await apiPost('/kafil-online/vehicle', {
      govNumber:          gov,
      techPassportSeria:  ts,
      techPassportNumber: tn,
    });

    if (res.error !== 0 && res.error !== undefined && res.error !== null) {
      showToast(res.error_message || "Avtomobil ma'lumotlari topilmadi", 'error');
      setBtnLoading('btn1', false);
      return;
    }

    S.vehicle = res;
    go('step2');
  } catch (e) {
    showToast(netErrorMsg(e), 'error');
    setBtnLoading('btn1', false);
  }
}

/* ── OSAGO STEP 2: Egasining ma'lumotlari ───── */
SCREENS.step2 = () => {
  const v = S.vehicle || {};
  const vd = v.vehicle || v.data || v;
  const model = vd.model || vd.vehicle_model || vd.name || '';
  const year  = vd.year  || vd.release_year  || vd.manufacture_year || '';

  return `
  ${hdrBack("Majburiy avtosug'urta")}
  <div class="page">
    ${stepBar(2, 4)}

    ${model ? `
    <div class="info-card">
      <div class="info-card-icon">🚗</div>
      <div>
        <div class="info-card-title">${model}${year ? ' · ' + year : ''}</div>
        <div class="info-card-sub">${S.form.govNumber}</div>
      </div>
    </div>` : ''}

    <h2 class="section-title">Egasining ma'lumotlari</h2>

    <div class="form-group">
      <label class="form-label">PINFL (14 ta raqam)</label>
      <input id="pinfl" type="text" class="form-input"
        placeholder="00000000000000"
        maxlength="14"
        inputmode="numeric"
        value="${S.form.pinfl}"
        autocomplete="off">
    </div>

    <div class="form-group">
      <label class="form-label">Pasport seriya va raqami</label>
      <div class="input-row">
        <input id="pSeria" type="text" class="form-input"
          placeholder="AA" maxlength="2"
          value="${S.form.pSeria}"
          style="width:72px;flex-shrink:0"
          autocomplete="off"
          oninput="this.value=this.value.toUpperCase()">
        <input id="pNum" type="text" class="form-input"
          placeholder="1234567" maxlength="7"
          value="${S.form.pNumber}"
          inputmode="numeric"
          autocomplete="off">
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btn2" class="btn btn-green" onclick="submitStep2()">
      Davom etish &rsaquo;
    </button>
  </div>
  `;
};

async function submitStep2() {
  const pinfl = (document.getElementById('pinfl')?.value || '').trim();
  const ps    = (document.getElementById('pSeria')?.value || '').toUpperCase().trim();
  const pn    = (document.getElementById('pNum')?.value || '').trim();

  if (pinfl.length !== 14) { haptic(20); shakeInput('pinfl'); showToast("PINFL 14 ta raqamdan iborat", 'error'); return; }
  if (ps.length < 2)       { haptic(20); shakeInput('pSeria'); showToast("Pasport seriasini kiriting", 'error'); return; }
  if (pn.length < 7)       { haptic(20); shakeInput('pNum'); showToast("Pasport raqamini kiriting", 'error'); return; }

  S.form.pinfl   = pinfl;
  S.form.pSeria  = ps;
  S.form.pNumber = pn;
  saveDraft();

  setBtnLoading('btn2', true);
  try {
    const res = await apiPost('/kafil-online/driver-summary', {
      pinfl,
      passportSeries: ps,
      passportNumber: pn,
    });

    if (res.error !== 0 && res.error !== undefined) {
      showToast(res.error_message || "Shaxs ma'lumotlari topilmadi", 'error');
      setBtnLoading('btn2', false);
      return;
    }

    S.owner = res.driver || res;
    go('step3');
  } catch (e) {
    showToast(netErrorMsg(e), 'error');
    setBtnLoading('btn2', false);
  }
}

/* ── OSAGO STEP 3: Muddat va hisoblash ──────── */
SCREENS.step3 = () => {
  const o = S.owner || {};
  const name = [o.surname, o.name, o.patronym].filter(Boolean).join(' ') || '';

  return `
  ${hdrBack("Majburiy avtosug'urta")}
  <div class="page">
    ${stepBar(3, 4)}

    ${name ? `
    <div class="info-card">
      <div class="info-card-icon">👤</div>
      <div>
        <div class="info-card-title">${name}</div>
        <div class="info-card-sub">${S.form.pSeria} ${S.form.pNumber}</div>
      </div>
    </div>` : ''}

    <h2 class="section-title">Sug'urta muddati</h2>
    <div class="period-grid">
      ${PERIODS.map(p => `
        <button class="period-btn ${S.period === p.val ? 'active' : ''}"
          onclick="setPeriod(${p.val}, this)">${p.label}</button>
      `).join('')}
    </div>

    <h2 class="section-title" style="margin-top:20px">Foydalanish hududi</h2>
    <div class="radio-list">
      <div class="radio-item ${S.territory === 1 ? 'active' : ''}" onclick="setTerritory(1, this)">
        <div class="radio-circle"></div>
        Respublika ichida
      </div>
      <div class="radio-item ${S.territory === 2 ? 'active' : ''}" onclick="setTerritory(2, this)">
        <div class="radio-circle"></div>
        Xalqaro (MDH)
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btn3" class="btn btn-green" onclick="submitStep3()">
      Hisoblash &rsaquo;
    </button>
  </div>
  `;
};

function setPeriod(val, el) {
  S.period = val;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function setTerritory(val, el) {
  S.territory = val;
  document.querySelectorAll('.radio-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

async function submitStep3() {
  setBtnLoading('btn3', true);

  const vd = S.vehicle?.vehicle || S.vehicle?.data || S.vehicle || {};
  const vehicleType = vd.vehicle || vd.vehicle_type || vd.type_id || vd.typeId || 1;

  const payload = {
    vehicle: {
      vehicle:        Number(vehicleType),
      govNumber:      S.form.govNumber,
      foreignVehicle: false,
    },
    period:       S.period,
    use_territory: S.territory,
    driver_limit:  0,
    discount:      0,
    owner: {
      owner_pinfl: S.form.pinfl,
    },
    drivers: [{
      pinfl:       S.form.pinfl,
      coefficient: Number(S.owner?.coefficient ?? S.owner?.coeff ?? 1),
    }],
  };

  try {
    const res = await apiPost('/kafil-online/calculate', payload);

    // accept result=0 or error=0
    const ok = (res.result === 0) || (res.error === 0) ||
               (res.premium !== undefined) || (res.amount !== undefined);

    if (!ok) {
      showToast(res.result_message || res.error_message || "Hisoblashda xatolik", 'error');
      setBtnLoading('btn3', false);
      return;
    }

    S.calc = res;
    go('step4');
  } catch (e) {
    showToast(netErrorMsg(e), 'error');
    setBtnLoading('btn3', false);
  }
}

/* ── OSAGO STEP 4: To'lov ───────────────────── */
SCREENS.step4 = () => {
  const c = S.calc || {};
  const premium = c.premium ?? c.total ?? c.amount ?? c.result ?? c.data?.premium ?? 0;
  const o = S.owner || {};
  const fullName = [o.surname, o.name].filter(Boolean).join(' ') || "—";
  const periodLabel = PERIODS.find(p => p.val === S.period)?.label || '';
  const vd = S.vehicle?.vehicle || S.vehicle?.data || S.vehicle || {};
  const model = vd.model || vd.vehicle_model || '';

  return `
  ${hdrBack("Majburiy avtosug'urta")}
  <div class="page">
    ${stepBar(4, 4)}

    <div class="price-card">
      <div class="price-label">Sug'urta mukofoti</div>
      <div class="price-amount">${fmt(premium)} <small>UZS</small></div>
      <div class="price-period">${periodLabel} uchun</div>
    </div>

    <div class="summary-card">
      ${model ? `
      <div class="summary-row">
        <span class="s-label">Avtomobil</span>
        <span class="s-val">${model}</span>
      </div>` : ''}
      <div class="summary-row">
        <span class="s-label">Davlat raqami</span>
        <span class="s-val">${S.form.govNumber}</span>
      </div>
      <div class="summary-row">
        <span class="s-label">Sug'urtalanuvchi</span>
        <span class="s-val">${fullName}</span>
      </div>
      <div class="summary-row">
        <span class="s-label">Muddat</span>
        <span class="s-val">${periodLabel}</span>
      </div>
      <div class="summary-row">
        <span class="s-label">Qoplash summasi</span>
        <span class="s-val">20 000 000 UZS</span>
      </div>
    </div>

    <div class="note">
      <span>ℹ️</span>
      <span>To'lovdan so'ng polis SMS va ilovaga yuboriladi</span>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btn4" class="btn btn-green" onclick="doPayment(${premium})">
      To'lash ${fmt(premium)} UZS 🔒
    </button>
  </div>
  `;
};

// Paynet API kelgach shu yerga integratsiya qilinadi.
// Hozircha (Paynet ulanmagunicha) barcha mahsulotlar shu umumiy
// "hisoblandi → muvaffaqiyat" oqimidan o'tadi.
function fakeCheckout(amount, btnId) {
  setBtnLoading(btnId, true);
  setTimeout(() => { clearDraft(); go('success', { amount }); }, 1500);
}

function doPayment(amount) {
  fakeCheckout(amount, 'btn4');
}

/* ── SUCCESS ────────────────────────────────── */
SCREENS.success = (p) => {
  const policyNum = 'KF-' + Date.now().toString().slice(-8);
  return `
  <div class="success-wrap">
    <svg class="check-anim" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="#C0282C" stroke-width="2.5" fill="none"/>
      <path d="M24 40l10 10 22-20" stroke="#C0282C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h2 class="success-title">Polis rasmiylashtirildi!</h2>
    <p class="success-sub">
      Sug'urta polisi muvaffaqiyatli rasmiylashtirildi.<br>
      SMS orqali telefoningizga yuboriladi.
    </p>
    <div class="success-badge success-badge--copy" onclick="copyPolicyNum('${policyNum}', this)">
      <span>Polis raqami · nusxalash uchun bosing</span>
      <strong>${policyNum}</strong>
    </div>
    <button class="btn btn-green" style="width:220px" onclick="goHome()">
      Bosh sahifaga
    </button>
  </div>
  `;
};

function copyPolicyNum(num, el) {
  haptic(10);
  const done = () => {
    const span = el.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Nusxalandi ✓';
    el.classList.add('copied');
    setTimeout(() => { span.textContent = orig; el.classList.remove('copied'); }, 1500);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(num).then(done).catch(done);
  } else {
    done();
  }
}

function goHome() {
  activeCat = 'all';
  S.stack = [];
  go('home', {}, true);
}

/* ── KASKO: helpers ─────────────────────────── */
function kaskoListHtml(items, onClick, labelFn) {
  if (!items || !items.length) return '<div class="empty-title">Topilmadi</div>';
  return items.map(it => {
    const label = labelFn(it).replace(/'/g, "\\'");
    return `<button class="period-btn" style="width:100%;margin-bottom:8px;text-align:left"
      onclick="${onClick}(${it.id}, '${label}')">${labelFn(it) || ('#' + it.id)}</button>`;
  }).join('');
}

/* ── KASKO: Brand ───────────────────────────── */
SCREENS.kaskoBrand = () => `
  ${hdrBack('KASKO')}
  <div class="page">
    ${stepBar(1, 4)}
    <h2 class="section-title">Avtomobil markasi</h2>
    <div id="kasko-list" class="form-group">
      <div class="loading-text">Yuklanmoqda...</div>
    </div>
  </div>
`;

async function loadKaskoBrands() {
  const el = document.getElementById('kasko-list');
  try {
    const r = await fetch(API + '/kasko/brands');
    const data = await r.json();
    const brands = data.brands || [];
    if (el) el.innerHTML = kaskoListHtml(brands, 'pickKaskoBrand', b => b.name || b.title || '');
  } catch (e) {
    if (el) el.innerHTML = '<div class="empty-title">Yuklab bo\'lmadi</div>';
    showToast(netErrorMsg(e), 'error');
  }
}

function pickKaskoBrand(id, name) {
  haptic(8);
  S.kasko.brand = { id, name };
  go('kaskoModel');
}

/* ── KASKO: Model ───────────────────────────── */
SCREENS.kaskoModel = () => `
  ${hdrBack('KASKO')}
  <div class="page">
    ${stepBar(2, 4)}
    <h2 class="section-title">${S.kasko.brand?.name || ''} — model</h2>
    <div id="kasko-list" class="form-group">
      <div class="loading-text">Yuklanmoqda...</div>
    </div>
  </div>
`;

async function loadKaskoModels() {
  const el = document.getElementById('kasko-list');
  try {
    const res = await apiPost('/kasko/cars/find/model', { brand_id: S.kasko.brand.id });
    const models = res.models || [];
    if (el) el.innerHTML = kaskoListHtml(models, 'pickKaskoModel', m => m.name || m.title || '');
  } catch (e) {
    if (el) el.innerHTML = '<div class="empty-title">Yuklab bo\'lmadi</div>';
    showToast(netErrorMsg(e), 'error');
  }
}

function pickKaskoModel(id, name) {
  haptic(8);
  S.kasko.model = { id, name };
  go('kaskoTrim');
}

/* ── KASKO: Trim ────────────────────────────── */
SCREENS.kaskoTrim = () => `
  ${hdrBack('KASKO')}
  <div class="page">
    ${stepBar(3, 4)}
    <h2 class="section-title">${S.kasko.model?.name || ''} — modifikatsiya</h2>
    <div id="kasko-list" class="form-group">
      <div class="loading-text">Yuklanmoqda...</div>
    </div>
  </div>
`;

async function loadKaskoTrims() {
  const el = document.getElementById('kasko-list');
  try {
    const res = await apiPost('/kasko/cars/find/trim', { model_id: S.kasko.model.id });
    const trims = res.carsTrim || [];
    if (el) el.innerHTML = kaskoListHtml(trims, 'pickKaskoTrim', t => t.trim || '');
  } catch (e) {
    if (el) el.innerHTML = '<div class="empty-title">Yuklab bo\'lmadi</div>';
    showToast(netErrorMsg(e), 'error');
  }
}

function pickKaskoTrim(id, trim) {
  haptic(8);
  S.kasko.trim = { id, name: trim };
  go('kaskoYear');
}

/* ── KASKO: Year ────────────────────────────── */
SCREENS.kaskoYear = () => `
  ${hdrBack('KASKO')}
  <div class="page">
    ${stepBar(4, 4)}
    <h2 class="section-title">Ishlab chiqarilgan yili</h2>
    <div id="kasko-list" class="form-group">
      <div class="loading-text">Yuklanmoqda...</div>
    </div>
  </div>
`;

async function loadKaskoYears() {
  const el = document.getElementById('kasko-list');
  try {
    const res = await apiPost('/kasko/cars/find/years', {
      trim_id: S.kasko.trim.id,
      model_id: S.kasko.model.id,
      brand_id: S.kasko.brand.id,
    });
    // Backend turlicha javob qaytarishi mumkin: massiv sonlar yoki {year:..} obyektlar
    let years = Array.isArray(res) ? res : (res.years || []);
    years = years.map(y => (typeof y === 'object' ? y : { id: y, year: y }));
    if (el) el.innerHTML = kaskoListHtml(years, 'pickKaskoYear', y => String(y.year ?? y.id));
  } catch (e) {
    if (el) el.innerHTML = '<div class="empty-title">Yuklab bo\'lmadi</div>';
    showToast(netErrorMsg(e), 'error');
  }
}

function pickKaskoYear(id, year) {
  haptic(8);
  S.kasko.year = year;
  go('kaskoPrice');
}

/* ── KASKO: Price + redirect to full site ───── */
SCREENS.kaskoPrice = () => `
  ${hdrBack('KASKO')}
  <div class="page">
    <div class="price-card">
      <div class="price-label">Taxminiy sug'urta narxi</div>
      <div class="price-amount" id="kasko-price-amount">···</div>
    </div>
    <div class="summary-card">
      <div class="summary-row"><span class="s-label">Marka</span><span class="s-val">${S.kasko.brand?.name || ''}</span></div>
      <div class="summary-row"><span class="s-label">Model</span><span class="s-val">${S.kasko.model?.name || ''}</span></div>
      <div class="summary-row"><span class="s-label">Modifikatsiya</span><span class="s-val">${S.kasko.trim?.name || ''}</span></div>
      <div class="summary-row"><span class="s-label">Yil</span><span class="s-val">${S.kasko.year || ''}</span></div>
    </div>
    <div class="note">
      <span>ℹ️</span>
      <span>To'lovdan so'ng polis SMS va ilovaga yuboriladi</span>
    </div>
  </div>
  <div class="bottom-bar">
    <button id="btnKaskoPay" class="btn btn-green" disabled onclick="payKaskoNow()">Hisoblanmoqda...</button>
  </div>
`;

async function loadKaskoPrice() {
  const el = document.getElementById('kasko-price-amount');
  const btn = document.getElementById('btnKaskoPay');
  try {
    const res = await apiPost('/kasko/cars/find/price/by/year', {
      model_id: S.kasko.model.id,
      trim: S.kasko.trim.name,
      year: S.kasko.year,
    });
    const price = res.price ?? 0;
    S.kasko.price = price;
    if (el) el.innerHTML = `${fmt(price)} <small>UZS</small>`;
    if (btn) { btn.disabled = false; btn.textContent = `To'lash ${fmt(price)} UZS 🔒`; }
  } catch (e) {
    if (el) el.textContent = "Hisoblab bo'lmadi";
    if (btn) btn.textContent = "Qayta urinib ko'ring";
    showToast(netErrorMsg(e), 'error');
  }
}

function payKaskoNow() {
  haptic(10);
  fakeCheckout(Number(S.kasko.price) || 0, 'btnKaskoPay');
}

/* ── SIMPLE FLOW: Travel / Accident / Property ──
   (Backendda hali to'liq calculate API tayyor emas,
   shu uchun PRODUCTS'dagi tayyor narx ko'rsatiladi,
   OSAGO'dagi kabi to'lov→muvaffaqiyat oqimi ishlaydi) */
SCREENS.simpleForm = (params) => {
  const p = PRODUCTS.find(x => x.id === params.pid) || {};
  return `
  ${hdrBack(p.name || '')}
  <div class="page">
    ${stepBar(1, 2)}
    <h2 class="section-title">Aloqa ma'lumotlari</h2>

    <div class="form-group">
      <label class="form-label">Telefon raqamingiz</label>
      <div class="input-row">
        <span class="phone-prefix">+998</span>
        <input id="simplePhone" type="tel" class="form-input"
          placeholder="90 123 45 67"
          value="${S.simple.phone}"
          inputmode="numeric"
          maxlength="12"
          oninput="fmtPhone(this)">
      </div>
    </div>

    <div class="contact-block">
      <p>Yagona aloqa markazi</p>
      <a href="tel:+998712000414">📞 +998 71 200 04 14</a>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btnSimple1" class="btn btn-green" onclick="submitSimpleForm('${params.pid}')">
      Davom etish &rsaquo;
    </button>
  </div>
  `;
};

function submitSimpleForm(pid) {
  const ph = (document.getElementById('simplePhone')?.value || '').replace(/\D/g, '');
  if (ph.length < 9) { haptic(20); shakeInput('simplePhone'); showToast('Telefon raqamini kiriting', 'error'); return; }
  S.simple = { pid, phone: ph };
  go('simplePrice', { pid });
}

SCREENS.simplePrice = (params) => {
  const p = PRODUCTS.find(x => x.id === params.pid) || {};
  return `
  ${hdrBack(p.name || '')}
  <div class="page">
    ${stepBar(2, 2)}

    <div class="price-card">
      <div class="price-label">Sug'urta narxi</div>
      <div class="price-amount">${fmt(p.price)} <small>UZS</small></div>
    </div>

    <div class="summary-card">
      <div class="summary-row">
        <span class="s-label">Mahsulot</span>
        <span class="s-val">${p.name || ''}</span>
      </div>
      <div class="summary-row">
        <span class="s-label">Telefon</span>
        <span class="s-val">+998 ${S.simple.phone}</span>
      </div>
    </div>

    <div class="note">
      <span>ℹ️</span>
      <span>To'lovdan so'ng polis SMS va ilovaga yuboriladi</span>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btnSimplePay" class="btn btn-green" onclick="paySimpleNow('${params.pid}')">
      To'lash ${fmt(p.price)} UZS 🔒
    </button>
  </div>
  `;
};

function paySimpleNow(pid) {
  haptic(10);
  const p = PRODUCTS.find(x => x.id === pid) || {};
  const amount = typeof p.price === 'string' ? parseFloat(p.price.replace(/\s/g, '')) : Number(p.price) || 0;
  fakeCheckout(amount, 'btnSimplePay');
}

/* ── TRAVEL: real backend (kafil.uz asosiy saytidagi
   /travel/calculate, /travel/create bilan bir xil mantiq,
   mini-app uchun CSRF'siz /api/travel/* orqali) ───────── */
const TRAVEL_PROGRAMS = ['BASIC', 'OPTIMAL', 'LUXURY'];
const TRAVEL_PURPOSES = [
  { val: 'TOURISM', label: 'Turizm' },
  { val: 'STUDY',   label: "O'qish" },
  { val: 'WORK',    label: 'Ish' },
  { val: 'SPORT',   label: 'Sport' },
];

let travelCountries = null; // lazy-loaded, cached

SCREENS.travelTrip = () => `
  ${hdrBack("Sayohat sug'urtasi")}
  <div class="page">
    ${stepBar(1, 3)}
    <h2 class="section-title">Sayohat ma'lumotlari</h2>

    <div class="form-group">
      <label class="form-label">Mamlakat</label>
      <select id="trCountry" class="form-input">
        <option value="">Yuklanmoqda...</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Dastur</label>
      <select id="trProgram" class="form-input">
        ${TRAVEL_PROGRAMS.map(p => `<option value="${p}" ${p === S.travel.program ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Sayohat takroriyligi</label>
      <select id="trRepeat" class="form-input">
        <option value="1" ${S.travel.repeat === 1 ? 'selected' : ''}>Bir martalik</option>
        <option value="2" ${S.travel.repeat === 2 ? 'selected' : ''}>Ko'p martalik</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Sayohat sanasi (dan)</label>
      <input id="trStart" type="date" class="form-input" value="${S.travel.startDate}">
    </div>

    <div class="form-group">
      <label class="form-label">Sayohat sanasi (gacha)</label>
      <input id="trEnd" type="date" class="form-input" value="${S.travel.endDate}">
    </div>

    <div class="form-group">
      <label class="form-label">Sayohat maqsadi</label>
      <select id="trPurpose" class="form-input">
        ${TRAVEL_PURPOSES.map(p => `<option value="${p.val}" ${p.val === S.travel.purpose ? 'selected' : ''}>${p.label}</option>`).join('')}
      </select>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btnTravel1" class="btn btn-green" onclick="submitTravelTrip()">
      Davom etish &rsaquo;
    </button>
  </div>
`;

async function loadTravelCountries() {
  const sel = document.getElementById('trCountry');
  if (!sel) return;
  try {
    if (!travelCountries) {
      const res = await fetch(API + '/references/countriec');
      const data = await res.json();
      travelCountries = Array.isArray(data) ? data : (data.countries || data.data || []);
    }
    if (!travelCountries.length) throw new Error('empty');
    sel.innerHTML = '<option value="">Tanlang...</option>' + travelCountries.map(c => {
      const label = c.name_uz || c.name_en || c.name_ru || c.name || ('#' + (c.id ?? ''));
      const value = c.name_en || c.name_uz || c.name || label;
      const sameLabel = label.replace(/"/g, '&quot;');
      return `<option value="${value.replace(/"/g, '&quot;')}" ${value === S.travel.country ? 'selected' : ''}>${sameLabel}</option>`;
    }).join('');
  } catch (e) {
    // Backend ro'yxati olinmasa — qo'lda kiritish imkonini beramiz
    sel.outerHTML = `<input id="trCountry" type="text" class="form-input" placeholder="Mamlakat nomi (masalan: Turkey)" value="${S.travel.country}">`;
  }
}

function submitTravelTrip() {
  const countryEl = document.getElementById('trCountry');
  const country = (countryEl?.value || '').trim();
  const program = document.getElementById('trProgram')?.value || 'BASIC';
  const repeat = Number(document.getElementById('trRepeat')?.value || 1);
  const start = document.getElementById('trStart')?.value || '';
  const end = document.getElementById('trEnd')?.value || '';
  const purpose = document.getElementById('trPurpose')?.value || 'TOURISM';

  if (!country) { haptic(20); showToast('Mamlakatni tanlang', 'error'); return; }
  if (!start || !end) { haptic(20); showToast('Sayohat sanalarini kiriting', 'error'); return; }

  const days = Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  if (days < 1 || isNaN(days)) { haptic(20); showToast("Sanalar noto'g'ri", 'error'); return; }

  S.travel.country = country;
  S.travel.program = program;
  S.travel.repeat = repeat;
  S.travel.startDate = start;
  S.travel.endDate = end;
  S.travel.days = days;
  S.travel.purpose = purpose;

  go('travelPerson');
}

/* ── TRAVEL: Sayohatchi ma'lumotlari ─────────── */
SCREENS.travelPerson = () => {
  const p = S.travel.person;
  return `
  ${hdrBack("Sayohat sug'urtasi")}
  <div class="page">
    ${stepBar(2, 3)}
    <h2 class="section-title">Sayohatchi ma'lumotlari</h2>

    <div class="form-group">
      <label class="form-label">Ism</label>
      <input id="trFirst" type="text" class="form-input" value="${p.firstName}" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label">Familiya</label>
      <input id="trLast" type="text" class="form-input" value="${p.lastName}" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label">Tug'ilgan sana</label>
      <input id="trBirth" type="date" class="form-input" value="${p.birthDate}">
    </div>
    <div class="form-group">
      <label class="form-label">PINFL (14 ta raqam)</label>
      <input id="trPinfl" type="text" class="form-input" maxlength="14" inputmode="numeric" value="${p.pinfl}" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label">Pasport seriya va raqami</label>
      <div class="input-row">
        <input id="trPSeria" type="text" class="form-input" placeholder="AA" maxlength="2" style="width:72px;flex-shrink:0"
          value="${p.pSeria}" oninput="this.value=this.value.toUpperCase()" autocomplete="off">
        <input id="trPNumber" type="text" class="form-input" placeholder="1234567" maxlength="7" value="${p.pNumber}" autocomplete="off">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Telefon raqamingiz</label>
      <div class="input-row">
        <span class="phone-prefix">+998</span>
        <input id="trPhone" type="tel" class="form-input" placeholder="90 123 45 67" inputmode="numeric" maxlength="12"
          value="${p.phone}" oninput="fmtPhone(this)">
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <button id="btnTravel2" class="btn btn-green" onclick="submitTravelPerson()">
      Hisoblash &rsaquo;
    </button>
  </div>
  `;
};

async function submitTravelPerson() {
  const firstName = (document.getElementById('trFirst')?.value || '').trim();
  const lastName  = (document.getElementById('trLast')?.value || '').trim();
  const birthDate = document.getElementById('trBirth')?.value || '';
  const pinfl     = (document.getElementById('trPinfl')?.value || '').trim();
  const pSeria    = (document.getElementById('trPSeria')?.value || '').toUpperCase().trim();
  const pNumber   = (document.getElementById('trPNumber')?.value || '').trim();
  const phone     = (document.getElementById('trPhone')?.value || '').replace(/\D/g, '');

  if (!firstName || !lastName) { haptic(20); showToast("Ism-familiyani kiriting", 'error'); return; }
  if (!birthDate)               { haptic(20); showToast("Tug'ilgan sanani kiriting", 'error'); return; }
  if (pinfl.length !== 14)      { haptic(20); shakeInput('trPinfl'); showToast('PINFL 14 ta raqamdan iborat', 'error'); return; }
  if (pSeria.length < 2)        { haptic(20); shakeInput('trPSeria'); showToast('Pasport seriasini kiriting', 'error'); return; }
  if (pNumber.length < 7)       { haptic(20); shakeInput('trPNumber'); showToast('Pasport raqamini kiriting', 'error'); return; }
  if (phone.length < 9)         { haptic(20); shakeInput('trPhone'); showToast('Telefon raqamini kiriting', 'error'); return; }

  S.travel.person = {
    firstName, lastName, surName: '', gender: 'm',
    birthDate, pinfl, pSeria, pNumber, phone,
    address: '', regionId: 10,
  };

  setBtnLoading('btnTravel2', true);
  try {
    const agreement = {
      agreementDate: new Date().toISOString().split('T')[0],
      periodStartDate: S.travel.startDate,
      periodEndDate: S.travel.endDate,
      daysCount: String(S.travel.days),
      isBaggageInsured: 0,
      isShengen: 'false',
      daysCountForSchengen: '0',
      destinationCountries: S.travel.country,
      travelMultipleTypeId: String(S.travel.repeat),
      periodEndDateTypeId: null,
      periodEndDateTypeName: '',
      travelProgramId: null,
      travelProgramName: S.travel.program,
      travelTargetTariffId: null,
      travelTargetTariffName: S.travel.purpose,
      travelFamilyTariffId: '',
      travelFamilyTariffName: '',
      travelGroupTariffId: '',
      travelGroupTariffName: '',
      travelHealthProtectionTariffId: null,
      travelHealthProtectionTariffName: '',
    };

    const insuredPersons = [{
      pinfl,
      applicant_passportSeries: pSeria,
      applicant_passportNumber: pNumber,
      firstName, lastName, surName: '',
      gender: 'm',
      birthDate,
      regionId: 10,
      regionIdForEosgoUz: 10,
      residentTypeId: 1,
      countryId: 210,
      address: '',
      phone,
    }];

    const res = await apiPost('/travel/calculate', { agreement, insuredPersons });
    const body = typeof res === 'string' ? JSON.parse(res) : res;
    const result = body?.operationResult;

    if (!result || result.result) {
      showToast(result?.errorMessage || "Hisoblashda xatolik (backend hali tayyor bo'lmasligi mumkin)", 'error');
      setBtnLoading('btnTravel2', false);
      return;
    }

    S.travel.agreement = { ...agreement, ...result.data };
    S.travel.premium = result.data?.premiumAmount ?? 0;
    S.travel.insuredAmount = result.data?.insuredAmount ?? 0;
    go('travelPrice');
  } catch (e) {
    showToast(netErrorMsg(e), 'error');
    setBtnLoading('btnTravel2', false);
  }
}

/* ── TRAVEL: Narx va order yaratish ──────────── */
SCREENS.travelPrice = () => `
  ${hdrBack("Sayohat sug'urtasi")}
  <div class="page">
    ${stepBar(3, 3)}
    <div class="price-card">
      <div class="price-label">Sug'urta mukofoti</div>
      <div class="price-amount">${fmt(S.travel.premium)} <small>UZS</small></div>
    </div>
    <div class="summary-card">
      <div class="summary-row"><span class="s-label">Mamlakat</span><span class="s-val">${S.travel.country}</span></div>
      <div class="summary-row"><span class="s-label">Dastur</span><span class="s-val">${S.travel.program}</span></div>
      <div class="summary-row"><span class="s-label">Muddat</span><span class="s-val">${S.travel.days} kun</span></div>
      <div class="summary-row"><span class="s-label">Sayohatchi</span><span class="s-val">${S.travel.person.firstName} ${S.travel.person.lastName}</span></div>
    </div>
    <div class="note">
      <span>ℹ️</span>
      <span>Buyurtma tizimda saqlanadi, to'lov ulanganidan keyin polis chiqariladi</span>
    </div>
  </div>
  <div class="bottom-bar">
    <button id="btnTravel3" class="btn btn-green" onclick="submitTravelOrder()">
      To'lash ${fmt(S.travel.premium)} UZS 🔒
    </button>
  </div>
`;

async function submitTravelOrder() {
  setBtnLoading('btnTravel3', true);
  const p = S.travel.person;
  try {
    const res = await apiPost('/travel/create', {
      agreement: S.travel.agreement,
      client: {
        firstName: p.firstName, lastName: p.lastName, surName: '',
        pinfl: p.pinfl,
        applicant_passportSeries: p.pSeria,
        applicant_passportNumber: p.pNumber,
        regionIdForEosgoUz: 10,
        gender: true,
        birthday: p.birthDate,
        address: '',
        phone: p.phone,
      },
      insuredPersons: [{
        pinfl: p.pinfl,
        applicant_passportSeries: p.pSeria,
        applicant_passportNumber: p.pNumber,
        firstName: p.firstName, lastName: p.lastName, surName: '',
        gender: 'm',
        birthDate: p.birthDate,
        regionId: 10, regionIdForEosgoUz: 10,
        residentTypeId: 1, countryId: 210,
        address: '', phone: p.phone,
      }],
    });

    if (res?.id === undefined || res?.id === null) {
      showToast("Buyurtma yaratilmadi (backend hali tayyor bo'lmasligi mumkin)", 'error');
      setBtnLoading('btnTravel3', false);
      return;
    }

    clearDraft();
    go('success', { amount: S.travel.premium });
  } catch (e) {
    showToast(netErrorMsg(e), 'error');
    setBtnLoading('btnTravel3', false);
  }
}

/* ── SWIPE BACK ─────────────────────────────── */
function setupSwipeBack(el) {
  let sx, sy;
  el.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = Math.abs(e.changedTouches[0].clientY - sy);
    if (sx < 40 && dx > 55 && dy < 70 && S.stack.length) {
      haptic(12);
      back();
    }
  }, { passive: true });
}

/* ── SCROLL BLUR HEADER ─────────────────────── */
function setupScrollBlur(screenEl) {
  const page = screenEl.querySelector('.page');
  const hdr  = screenEl.querySelector('.hdr');
  if (!page || !hdr) return;
  page.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', page.scrollTop > 4);
  }, { passive: true });
}

/* ── AUTO-ADVANCE INPUTS ────────────────────── */
function autoAdvance(fromId, toId, maxLen) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  if (!from || !to) return;
  from.addEventListener('input', () => {
    if (from.value.length >= maxLen) { haptic(6); to.focus(); to.select(); }
  });
}

/* ── AFTER RENDER HOOKS ─────────────────────── */
function afterRender(id, params) {
  const sc = document.getElementById(`sc-${id}`);
  if (!sc) return;

  setupSwipeBack(sc);
  setupScrollBlur(sc);

  // Auto-focus first input
  requestAnimationFrame(() => {
    const inp = sc.querySelector('input:not([disabled])');
    if (inp && !inp.readOnly) inp.focus();
  });

  if (id === 'step1') {
    autoAdvance('techS', 'techN', 3);
    autoAdvance('techN', 'phone', 7);
  }
  if (id === 'step2') {
    autoAdvance('pinfl', 'pSeria', 14);
    autoAdvance('pSeria', 'pNum', 2);
  }

  if (id === 'kaskoBrand') loadKaskoBrands();
  if (id === 'kaskoModel') loadKaskoModels();
  if (id === 'kaskoTrim')  loadKaskoTrims();
  if (id === 'kaskoYear')  loadKaskoYears();
  if (id === 'kaskoPrice') loadKaskoPrice();
  if (id === 'travelTrip') loadTravelCountries();

  // Success screen checkmark animation
  if (id === 'success') {
    haptic(30);
  }
}

/* ── INIT ───────────────────────────────────── */
function init() {
  go('splash', {}, true);
  setTimeout(() => go('home', {}, true), 1100);
}

document.addEventListener('DOMContentLoaded', init);
