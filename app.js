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
    live: false,
  },
  {
    id: 'travel',
    name: "Chet elga sayohat sug'urtasi",
    desc: "Chet elda tibbiy xizmat va baxtsiz hodisalardan himoya",
    price: '55 000',
    cat: 'travel',
    icon: '✈️',
    bg: '#E0E7FF',
    live: false,
  },
  {
    id: 'accident',
    name: "Baxtsiz hodisa sug'urtasi",
    desc: "Shaxsiy baxtsiz hodisalardan himoya",
    price: '50 000',
    cat: 'health',
    icon: '🏥',
    bg: '#FCE7F3',
    live: false,
  },
  {
    id: 'property',
    name: "Mol-mulk sug'urtasi",
    desc: "Uy va mol-mulkingizni himoya qiling",
    price: '120 000',
    cat: 'other',
    icon: '🏠',
    bg: '#FEF3C7',
    live: false,
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
async function apiPost(path, data) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await r.json();
  return json;
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
  S.period = 12; S.territory = 1;
  S.form = { govNumber: '', techSeria: '', techNumber: '', phone: '', pinfl: '', pSeria: '', pNumber: '' };
  S.stack = ['home'];

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
  } catch {
    showToast("Server bilan bog'lanib bo'lmadi", 'error');
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
  } catch {
    showToast("Server bilan bog'lanib bo'lmadi", 'error');
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
  } catch {
    showToast("Server bilan bog'lanib bo'lmadi", 'error');
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

function doPayment(amount) {
  setBtnLoading('btn4', true);
  // Paynet API kelgach shu yerga integratsiya qilinadi
  setTimeout(() => go('success', { amount }), 2000);
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
    <div class="success-badge">
      <span>Polis raqami</span>
      <strong>${policyNum}</strong>
    </div>
    <button class="btn btn-green" style="width:220px" onclick="goHome()">
      Bosh sahifaga
    </button>
  </div>
  `;
};

function goHome() {
  activeCat = 'all';
  S.stack = [];
  go('home', {}, true);
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
