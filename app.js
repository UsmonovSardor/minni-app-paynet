/* ===== KAFIL SUG'URTA MINI APP ===== */

// ─── STATE ───────────────────────────────────────────
const State = {
  lang: localStorage.getItem('kfLang') || 'uz',
  user: JSON.parse(localStorage.getItem('kfUser') || 'null'),
  policies: JSON.parse(localStorage.getItem('kfPolicies') || '[]'),
  claims: JSON.parse(localStorage.getItem('kfClaims') || '[]'),
  bonusPoints: parseInt(localStorage.getItem('kfBonus') || '0'),
  notifications: JSON.parse(localStorage.getItem('kfNotifs') || 'null'),
  currentScreen: 'splash',
  screenStack: [],
  selectedProduct: null,
  calcResult: null,
  selectedPayment: 'click',

  save() {
    localStorage.setItem('kfLang', this.lang);
    if (this.user) localStorage.setItem('kfUser', JSON.stringify(this.user));
    localStorage.setItem('kfPolicies', JSON.stringify(this.policies));
    localStorage.setItem('kfClaims', JSON.stringify(this.claims));
    localStorage.setItem('kfBonus', this.bonusPoints);
    localStorage.setItem('kfNotifs', JSON.stringify(this.notifications));
  }
};

// ─── TRANSLATIONS ─────────────────────────────────────
const T = {
  uz: {
    welcome: "Xush kelibsiz",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    phone: "Telefon raqam",
    phone_hint: "Telefon raqamingizni kiriting",
    send_code: "Kod yuborish",
    verify: "Tasdiqlash",
    otp_sent: "SMS kod yuborildi",
    enter_otp: "SMS kodni kiriting",
    resend: "Qayta yuborish",
    resend_in: "Qayta yuborish ({}s)",
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    my_policies: "Polislarim",
    bonuses: "Bonuslar",
    profile: "Profil",
    buy_policy: "Polis sotib olish",
    calculator: "Kalkulyator",
    calculate: "Hisoblash",
    buy_now: "Hozir sotib olish",
    pay: "To'lash",
    price: "Narxi",
    period: "Muddat",
    payment_method: "To'lov usuli",
    online_payment: "Onlayn to'lov",
    installment: "Bo'lib to'lash",
    policy_created: "Polis yaratildi!",
    download_pdf: "PDF yuklab olish",
    send_sms: "SMS yuborish",
    share: "Ulashish",
    claims: "Da'volar",
    new_claim: "Yangi da'vo",
    notifications: "Bildirishnomalar",
    settings: "Sozlamalar",
    logout: "Chiqish",
    full_name: "To'liq ism",
    dob: "Tug'ilgan sana",
    passport: "Passport seriya",
    vehicle_number: "Avtomobil raqami",
    vehicle_year: "Ishlab chiqarilgan yil",
    region: "Viloyat",
    coverage_type: "Qoplash turi",
    points: "ball",
    active: "Faol",
    expired: "Muddati tugagan",
    pending: "Kutilmoqda",
    claim_type: "Da'vo turi",
    description: "Tavsif",
    attach_photo: "Foto/video biriktirish",
    submit: "Yuborish",
    cancel: "Bekor qilish",
    continue: "Davom etish",
    osago: "OSAGO",
    kasko_mini: "KASKO MINI",
    kasko_std: "KASKO STANDART",
    kasko_comfort: "KASKO COMFORT",
    kasko_vip: "KASKO VIP",
    travel: "Sayohat sug\u2019urtasi",
    property: "Mol-mulk sug\u2019urtasi",
    accident_person: "Baxtsiz hodisa",
    accident_sport: "Sportchilar sug\u2019urtasi",
    accident_student: "O\u2019quvchilar sug\u2019urtasi",
    years: "yil",
    months: "oy",
    per_year: "yil uchun",
    your_bonuses: "Sizning bonuslaringiz",
    bonus_earned: "Ball yig'ildi",
    bonus_used: "Ball ishlatildi",
    call_center: "Call-center",
    policy_number: "Polis raqami",
    start_date: "Boshlanish sanasi",
    end_date: "Tugash sanasi",
    insured_amount: "Sug'urta summasi",
    premium: "Sug'urta mukofoti",
    insured_person: "Sug'urtalangan shaxs",
    all_products: "Barcha mahsulotlar",
    my_policies_empty: "Hali polislaringiz yo'q",
    my_policies_empty_sub: "Sug'urta mahsulotlaridan birini xarid qiling",
    claim_empty: "Hali da'volaringiz yo'q",
    claim_empty_sub: "Sug'urta hodisasi bo'lsa, bu yerdan murojaat qiling",
    notif_empty: "Bildirishnomalar yo'q",
    tashkent: "Toshkent",
    andijan: "Andijon",
    namangan: "Namangan",
    samarkand: "Samarqand",
    bukhara: "Buxoro",
    kashkadarya: "Qashqadaryo",
    surkhandarya: "Surxondaryo",
    jizzakh: "Jizzax",
    syrdarya: "Sirdaryo",
    navoi: "Navoiy",
    fergana: "Farg'ona",
    khorezm: "Xorazm",
    karakalpakstan: "Qoraqalpog'iston",
    accident: "Avariya",
    theft: "O'g'irlik",
    natural: "Tabiiy ofat",
    fire: "Yong'in",
    other: "Boshqa",
    min: "minimum",
    max: "maksimum",
    bonus_info: "Har bir polisdan 2% bonus",
    policy_expiring: "Polislaringizdan biri muddati yaqinlashmoqda",
    new_offer: "Yangi taklif",
    our_products: "Bizning mahsulotlar",
    latest_news: "So'nggi yangiliklar",
    greeting_morning: "Xayrli tong",
    greeting_day: "Xayrli kun",
    greeting_evening: "Xayrli oqshom",
    step_info: "Ma'lumot",
    step_calc: "Hisob",
    step_pay: "To'lov",
    amount_50: "50 000 000 so'm",
    amount_100: "100 000 000 so'm",
    amount_200: "200 000 000 so'm",
    amount_500: "500 000 000 so'm",
  },
  ru: {
    welcome: "Добро пожаловать",
    login: "Войти",
    register: "Регистрация",
    phone: "Номер телефона",
    phone_hint: "Введите ваш номер телефона",
    send_code: "Отправить код",
    verify: "Подтвердить",
    otp_sent: "SMS код отправлен",
    enter_otp: "Введите SMS код",
    resend: "Отправить снова",
    resend_in: "Повторить ({} с)",
    home: "Главная",
    products: "Продукты",
    my_policies: "Мои полисы",
    bonuses: "Бонусы",
    profile: "Профиль",
    buy_policy: "Купить полис",
    calculator: "Калькулятор",
    calculate: "Рассчитать",
    buy_now: "Купить сейчас",
    pay: "Оплатить",
    price: "Стоимость",
    period: "Срок",
    payment_method: "Способ оплаты",
    online_payment: "Онлайн оплата",
    installment: "Рассрочка",
    policy_created: "Полис создан!",
    download_pdf: "Скачать PDF",
    send_sms: "Отправить SMS",
    share: "Поделиться",
    claims: "Претензии",
    new_claim: "Новая претензия",
    notifications: "Уведомления",
    settings: "Настройки",
    logout: "Выйти",
    full_name: "Полное имя",
    dob: "Дата рождения",
    passport: "Серия паспорта",
    vehicle_number: "Номер автомобиля",
    vehicle_year: "Год выпуска",
    region: "Область",
    coverage_type: "Тип покрытия",
    points: "баллов",
    active: "Активный",
    expired: "Истёк",
    pending: "Ожидание",
    claim_type: "Тип претензии",
    description: "Описание",
    attach_photo: "Прикрепить фото/видео",
    submit: "Отправить",
    cancel: "Отмена",
    continue: "Продолжить",
    osago: "ОСАГО",
    kasko_mini: "КАСКО МИНИ",
    kasko_std: "КАСКО СТАНДАРТ",
    kasko_comfort: "КАСКО КОМФОРТ",
    kasko_vip: "КАСКО VIP",
    travel: "Страхование путешествий",
    property: "Страхование имущества",
    accident_person: "Несчастный случай",
    accident_sport: "Страхование спортсменов",
    accident_student: "Страхование студентов",
    years: "лет",
    months: "мес",
    per_year: "в год",
    your_bonuses: "Ваши бонусы",
    bonus_earned: "Баллы начислены",
    bonus_used: "Баллы использованы",
    call_center: "Колл-центр",
    policy_number: "Номер полиса",
    start_date: "Дата начала",
    end_date: "Дата окончания",
    insured_amount: "Страховая сумма",
    premium: "Страховая премия",
    insured_person: "Застрахованное лицо",
    all_products: "Все продукты",
    my_policies_empty: "У вас ещё нет полисов",
    my_policies_empty_sub: "Купите один из наших продуктов",
    claim_empty: "У вас нет претензий",
    claim_empty_sub: "При страховом случае обратитесь сюда",
    notif_empty: "Нет уведомлений",
    tashkent: "Ташкент",
    andijan: "Андижан",
    namangan: "Наманган",
    samarkand: "Самарканд",
    bukhara: "Бухара",
    kashkadarya: "Кашкадарья",
    surkhandarya: "Сурхандарья",
    jizzakh: "Джизак",
    syrdarya: "Сырдарья",
    navoi: "Навои",
    fergana: "Фергана",
    khorezm: "Хорезм",
    karakalpakstan: "Каракалпакстан",
    accident: "Авария",
    theft: "Кража",
    natural: "Стихийное бедствие",
    fire: "Пожар",
    other: "Другое",
    min: "минимум",
    max: "максимум",
    bonus_info: "2% бонус с каждого полиса",
    policy_expiring: "Один из ваших полисов скоро истекает",
    new_offer: "Новое предложение",
    our_products: "Наши продукты",
    latest_news: "Последние новости",
    greeting_morning: "Доброе утро",
    greeting_day: "Добрый день",
    greeting_evening: "Добрый вечер",
    step_info: "Данные",
    step_calc: "Расчёт",
    step_pay: "Оплата",
    amount_50: "50 000 000 сум",
    amount_100: "100 000 000 сум",
    amount_200: "200 000 000 сум",
    amount_500: "500 000 000 сум",
  },
  en: {
    welcome: "Welcome",
    login: "Login",
    register: "Register",
    phone: "Phone number",
    phone_hint: "Enter your phone number",
    send_code: "Send code",
    verify: "Verify",
    otp_sent: "SMS code sent",
    enter_otp: "Enter SMS code",
    resend: "Resend",
    resend_in: "Resend in {}s",
    home: "Home",
    products: "Products",
    my_policies: "My Policies",
    bonuses: "Bonuses",
    profile: "Profile",
    buy_policy: "Buy Policy",
    calculator: "Calculator",
    calculate: "Calculate",
    buy_now: "Buy Now",
    pay: "Pay",
    price: "Price",
    period: "Period",
    payment_method: "Payment Method",
    online_payment: "Online Payment",
    installment: "Installment",
    policy_created: "Policy Created!",
    download_pdf: "Download PDF",
    send_sms: "Send SMS",
    share: "Share",
    claims: "Claims",
    new_claim: "New Claim",
    notifications: "Notifications",
    settings: "Settings",
    logout: "Logout",
    full_name: "Full name",
    dob: "Date of birth",
    passport: "Passport series",
    vehicle_number: "Vehicle number",
    vehicle_year: "Year of manufacture",
    region: "Region",
    coverage_type: "Coverage type",
    points: "points",
    active: "Active",
    expired: "Expired",
    pending: "Pending",
    claim_type: "Claim type",
    description: "Description",
    attach_photo: "Attach photo/video",
    submit: "Submit",
    cancel: "Cancel",
    continue: "Continue",
    osago: "MTPL",
    kasko_mini: "CASCO MINI",
    kasko_std: "CASCO STANDARD",
    kasko_comfort: "CASCO COMFORT",
    kasko_vip: "CASCO VIP",
    travel: "Travel Insurance",
    property: "Property Insurance",
    accident_person: "Accident Insurance",
    accident_sport: "Athletes Insurance",
    accident_student: "Students Insurance",
    years: "years",
    months: "months",
    per_year: "per year",
    your_bonuses: "Your Bonuses",
    bonus_earned: "Points Earned",
    bonus_used: "Points Used",
    call_center: "Call Center",
    policy_number: "Policy Number",
    start_date: "Start Date",
    end_date: "End Date",
    insured_amount: "Insured Amount",
    premium: "Insurance Premium",
    insured_person: "Insured Person",
    all_products: "All Products",
    my_policies_empty: "You have no policies yet",
    my_policies_empty_sub: "Buy one of our insurance products",
    claim_empty: "You have no claims",
    claim_empty_sub: "In case of an insured event, apply here",
    notif_empty: "No notifications",
    tashkent: "Tashkent",
    andijan: "Andijan",
    namangan: "Namangan",
    samarkand: "Samarkand",
    bukhara: "Bukhara",
    kashkadarya: "Kashkadarya",
    surkhandarya: "Surkhandarya",
    jizzakh: "Jizzakh",
    syrdarya: "Syrdarya",
    navoi: "Navoi",
    fergana: "Fergana",
    khorezm: "Khorezm",
    karakalpakstan: "Karakalpakstan",
    accident: "Accident",
    theft: "Theft",
    natural: "Natural disaster",
    fire: "Fire",
    other: "Other",
    min: "minimum",
    max: "maximum",
    bonus_info: "2% bonus from each policy",
    policy_expiring: "One of your policies is expiring soon",
    new_offer: "New Offer",
    our_products: "Our Products",
    latest_news: "Latest News",
    greeting_morning: "Good morning",
    greeting_day: "Good afternoon",
    greeting_evening: "Good evening",
    step_info: "Info",
    step_calc: "Calculate",
    step_pay: "Payment",
    amount_50: "50,000,000 UZS",
    amount_100: "100,000,000 UZS",
    amount_200: "200,000,000 UZS",
    amount_500: "500,000,000 UZS",
  }
};

function t(key) { return (T[State.lang] || T.uz)[key] || key; }

// ─── PRODUCTS DATA ─────────────────────────────────────
const PRODUCTS = [
  {
    id: 'osago',
    icon: '🚗',
    color: '#2980B9',
    gradient: 'linear-gradient(135deg, #2980B9 0%, #1A5276 100%)',
    key: 'osago',
    desc: 'Majburiy fuqarolik javobgarligi sug\u2019urtasi',
    descRu: 'Обязательное страхование гражданской ответственности',
    descEn: 'Compulsory civil liability insurance',
    minPrice: 180000,
    fields: ['full_name', 'vehicle_number', 'vehicle_year', 'region'],
    periods: [1, 3, 6, 12],
    popular: true,
    coverage: '20 000 000',
  },
  {
    id: 'kasko_mini',
    icon: '🛡️',
    color: '#27AE60',
    gradient: 'linear-gradient(135deg, #27AE60 0%, #1A6B3C 100%)',
    key: 'kasko_mini',
    desc: 'Avtomobil uchun asosiy himoya',
    descRu: 'Базовая защита автомобиля',
    descEn: 'Basic car protection',
    minPrice: 450000,
    fields: ['full_name', 'vehicle_number', 'vehicle_year', 'region', 'coverage_type'],
    periods: [6, 12],
    coverage: '50 000 000',
  },
  {
    id: 'kasko_std',
    icon: '🛡️',
    color: '#8E44AD',
    gradient: 'linear-gradient(135deg, #8E44AD 0%, #5B2C6F 100%)',
    key: 'kasko_std',
    desc: 'Keng qamrovli avtomobil himoyasi',
    descRu: 'Широкое покрытие для автомобиля',
    descEn: 'Comprehensive car coverage',
    minPrice: 780000,
    fields: ['full_name', 'vehicle_number', 'vehicle_year', 'region', 'coverage_type'],
    periods: [6, 12],
    coverage: '100 000 000',
    popular: false,
  },
  {
    id: 'kasko_comfort',
    icon: '✨',
    color: '#E67E22',
    gradient: 'linear-gradient(135deg, #E67E22 0%, #A04000 100%)',
    key: 'kasko_comfort',
    desc: 'Yuk mashinalari uchun KASKO',
    descRu: 'Комфортная страховка КАСКО',
    descEn: 'Comfort CASCO insurance',
    minPrice: 1200000,
    fields: ['full_name', 'vehicle_number', 'vehicle_year', 'region', 'coverage_type'],
    periods: [12],
    coverage: '200 000 000',
  },
  {
    id: 'kasko_vip',
    icon: '👑',
    color: '#C0282C',
    gradient: 'linear-gradient(135deg, #C0282C 0%, #7B241C 100%)',
    key: 'kasko_vip',
    desc: 'Maksimal himoya va VIP xizmat',
    descRu: 'Максимальная защита и VIP обслуживание',
    descEn: 'Maximum protection and VIP service',
    minPrice: 2100000,
    fields: ['full_name', 'vehicle_number', 'vehicle_year', 'region', 'coverage_type'],
    periods: [12],
    coverage: '500 000 000',
    popular: true,
  },
  {
    id: 'travel',
    icon: '✈️',
    color: '#16A085',
    gradient: 'linear-gradient(135deg, #16A085 0%, #0E6655 100%)',
    key: 'travel',
    desc: 'Xavfsiz sayohat qiling',
    descRu: 'Путешествуйте безопасно',
    descEn: 'Travel safely',
    minPrice: 95000,
    fields: ['full_name', 'dob', 'passport', 'region'],
    periods: [7, 14, 30, 90],
    coverage: '10 000',
  },
  {
    id: 'property',
    icon: '🏠',
    color: '#F39C12',
    gradient: 'linear-gradient(135deg, #F39C12 0%, #B7770D 100%)',
    key: 'property',
    desc: 'Mol-mulkingizni himoya qiling',
    descRu: 'Защитите своё имущество',
    descEn: 'Protect your property',
    minPrice: 350000,
    fields: ['full_name', 'dob', 'region'],
    periods: [12],
    coverage: '50 000 000',
  },
  {
    id: 'accident_person',
    icon: '🏥',
    color: '#E74C3C',
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #922B21 100%)',
    key: 'accident_person',
    desc: 'Baxtsiz hodisadan himoya',
    descRu: 'Защита от несчастных случаев',
    descEn: 'Personal accident insurance',
    minPrice: 120000,
    fields: ['full_name', 'dob', 'passport', 'region'],
    periods: [6, 12],
    coverage: '20 000 000',
  },
  {
    id: 'accident_sport',
    icon: '⚽',
    color: '#2ECC71',
    gradient: 'linear-gradient(135deg, #2ECC71 0%, #1A7A43 100%)',
    key: 'accident_sport',
    desc: 'Sportchilar uchun maxsus sug\u2019urta',
    descRu: 'Специальная страховка для спортсменов',
    descEn: 'Special insurance for athletes',
    minPrice: 80000,
    fields: ['full_name', 'dob', 'passport', 'region'],
    periods: [3, 6, 12],
    coverage: '15 000 000',
  },
  {
    id: 'accident_student',
    icon: '📚',
    color: '#3498DB',
    gradient: 'linear-gradient(135deg, #3498DB 0%, #1A5276 100%)',
    key: 'accident_student',
    desc: 'O\u2019quvchilar uchun sug\u2019urta',
    descRu: 'Страховка для учащихся',
    descEn: 'Student insurance',
    minPrice: 50000,
    fields: ['full_name', 'dob', 'passport', 'region'],
    periods: [9, 12],
    coverage: '10 000 000',
  },
];

// ─── DEMO DATA ─────────────────────────────────────────
function initDemoData() {
  if (!State.notifications) {
    State.notifications = [
      { id: 1, title: t('policy_expiring'), text: 'OSAGO polisining muddati 15 kunda tugaydi. Yangilash uchun bosing.', time: '2 soat oldin', icon: '⚠️', bg: '#FFF3CD', unread: true },
      { id: 2, title: t('new_offer'), text: 'KASKO COMFORT: 20% chegirma! Faqat shu hafta.', time: 'Kecha', icon: '🎁', bg: '#D4EDDA', unread: true },
      { id: 3, title: t('bonus_earned'), text: '500 ball qo\'shildi. Umumiy balans: 1 250 ball.', time: '3 kun oldin', icon: '⭐', bg: '#D1ECF1', unread: false },
    ];
    State.save();
  }
  if (!State.policies.length && State.user) {
    State.policies = [
      {
        id: 'P-2024-0012',
        productId: 'osago',
        productName: t('osago'),
        icon: '🚗',
        iconColor: '#2980B9',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        amount: '20 000 000 so\'m',
        premium: '180 000 so\'m',
        status: 'active',
        vehicle: '01 A 123 AA',
        person: State.user.name,
      },
      {
        id: 'P-2024-0007',
        productId: 'travel',
        productName: t('travel'),
        icon: '✈️',
        iconColor: '#16A085',
        startDate: '2024-01-15',
        endDate: '2024-01-29',
        amount: '10 000 USD',
        premium: '95 000 so\'m',
        status: 'expired',
        person: State.user.name,
      }
    ];
    State.bonusPoints = 1250;
    State.save();
  }
}

// ─── ROUTER ───────────────────────────────────────────
const screens = {};
let activeScreen = null;

function registerScreen(id, renderFn) {
  screens[id] = renderFn;
}

function navigate(screenId, params = {}, replace = false) {
  const el = document.getElementById(`screen-${screenId}`);
  if (!el) {
    // Render screen
    const container = document.getElementById('app');
    const div = document.createElement('div');
    div.className = 'screen';
    div.id = `screen-${screenId}`;
    container.appendChild(div);
    if (screens[screenId]) {
      div.innerHTML = screens[screenId](params);
      bindScreen(screenId, div, params);
    }
  }

  if (activeScreen) {
    document.getElementById(`screen-${activeScreen}`)?.classList.add('prev');
    if (!replace) State.screenStack.push(activeScreen);
  }

  const target = document.getElementById(`screen-${screenId}`);
  target.classList.remove('prev');
  setTimeout(() => target.classList.add('active'), 10);
  activeScreen = screenId;
  State.currentScreen = screenId;
}

function goBack() {
  if (!State.screenStack.length) return;
  const prev = State.screenStack.pop();
  const cur = document.getElementById(`screen-${activeScreen}`);
  cur?.classList.remove('active');
  cur?.classList.remove('prev');

  const target = document.getElementById(`screen-${prev}`);
  target?.classList.remove('prev');
  target?.classList.add('active');
  activeScreen = prev;
  State.currentScreen = prev;
}

// ─── HELPERS ──────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return t('greeting_morning');
  if (h < 18) return t('greeting_day');
  return t('greeting_evening');
}

function formatPrice(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function policyId() {
  return 'P-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
}

function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function showToast(msg, type = '') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.getElementById('app').appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast ' + type;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function svgIcon(name) {
  const icons = {
    back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    download: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    sms: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    share: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    bell: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    star: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    user: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    check: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    upload: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
    phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.65 4.4 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    car: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  };
  return icons[name] || '';
}

// ─── BOTTOM NAV ────────────────────────────────────────
function bottomNav(active) {
  const tabs = [
    { id: 'home', icon: 'home', label: t('home') },
    { id: 'products-list', icon: 'shield', label: t('products') },
    { id: 'policies', icon: 'car', label: t('my_policies') },
    { id: 'bonuses', icon: 'star', label: t('bonuses') },
    { id: 'profile-screen', icon: 'user', label: t('profile') },
  ];
  return `<nav class="bottom-nav">
    ${tabs.map(tab => `
      <button class="nav-item ${active === tab.id ? 'active' : ''}" onclick="switchTab('${tab.id}')">
        <span class="nav-icon">${svgIcon(tab.icon)}</span>
        <span class="nav-label">${tab.label}</span>
        ${tab.id === 'home' && State.notifications?.filter(n => n.unread).length ? '<span class="nav-badge"></span>' : ''}
      </button>
    `).join('')}
  </nav>`;
}

function switchTab(tabId) {
  State.screenStack = [];
  // Remove all screens and re-render current
  const existing = document.getElementById(`screen-${tabId}`);
  if (existing) existing.remove();
  navigate(tabId, {}, true);
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}

// ─── HEADER ────────────────────────────────────────────
function header(title, showBack = true, actionHtml = '') {
  return `<header class="header">
    ${showBack ? `<button class="header-back" onclick="goBack()">${svgIcon('back')}</button>` : ''}
    <span class="header-title">${title}</span>
    ${actionHtml}
  </header>`;
}

// ──────────────────────────────────────────────────────
// SCREEN: SPLASH
// ──────────────────────────────────────────────────────
registerScreen('splash', () => `
  <div style="background:linear-gradient(145deg,#1A2B4A 0%,#2C4A7C 100%);flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;">
    <div class="splash-logo">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8L10 20V42C10 58 24 70 40 74C56 70 70 58 70 42V20L40 8Z" fill="#C0282C"/>
        <path d="M40 18L20 27V43C20 54 29 63 40 66C51 63 60 54 60 43V27L40 18Z" fill="white" opacity="0.2"/>
        <path d="M33 41L38 46L49 34" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div>
      <div class="splash-title">KAFIL SUG'URTA</div>
      <div class="splash-sub">Ishonchli sug\u2019urta xizmati</div>
    </div>
    <div class="splash-loader">
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
    </div>
  </div>
`);

// ──────────────────────────────────────────────────────
// SCREEN: LANG SELECT
// ──────────────────────────────────────────────────────
registerScreen('lang-select', () => `
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;background:var(--bg);">
    <div style="width:80px;height:80px;background:var(--red-light);border-radius:24px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
        <path d="M40 8L10 20V42C10 58 24 70 40 74C56 70 70 58 70 42V20L40 8Z" fill="#C0282C"/>
        <path d="M33 41L38 46L49 34" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h2 style="font-size:24px;font-weight:800;color:var(--dark);margin-bottom:8px;text-align:center;">Tilni tanlang</h2>
    <p style="font-size:14px;color:var(--gray);text-align:center;margin-bottom:36px;">Выберите язык / Select language</p>
    <div style="width:100%;display:flex;flex-direction:column;gap:12px;">
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:16px;padding:0 20px;height:60px;" onclick="setLang('uz')">
        <span style="font-size:28px;">🇺🇿</span>
        <span style="font-size:16px;font-weight:600;">O'zbek tili</span>
      </button>
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:16px;padding:0 20px;height:60px;" onclick="setLang('ru')">
        <span style="font-size:28px;">🇷🇺</span>
        <span style="font-size:16px;font-weight:600;">Русский язык</span>
      </button>
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:16px;padding:0 20px;height:60px;" onclick="setLang('en')">
        <span style="font-size:28px;">🇬🇧</span>
        <span style="font-size:16px;font-weight:600;">English</span>
      </button>
    </div>
  </div>
`);

function setLang(lang) {
  State.lang = lang;
  State.save();
  navigate('auth-phone', {}, true);
}

// ──────────────────────────────────────────────────────
// SCREEN: AUTH - PHONE
// ──────────────────────────────────────────────────────
registerScreen('auth-phone', () => `
  <div class="auth-wrap" style="background:var(--white);">
    <div class="auth-logo">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
        <path d="M40 8L10 20V42C10 58 24 70 40 74C56 70 70 58 70 42V20L40 8Z" fill="#C0282C"/>
        <path d="M33 41L38 46L49 34" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h2 class="auth-title">${t('login')}</h2>
    <p class="auth-sub">${t('phone_hint')}</p>
    <div class="form-group">
      <label class="form-label">${t('phone')}</label>
      <div class="input-wrap">
        <span class="phone-prefix">+998</span>
        <input type="tel" class="form-input phone-input" id="phoneInput" placeholder="__ ___ __ __" maxlength="12"
          oninput="formatPhone(this)" inputmode="numeric">
      </div>
    </div>
    <div class="auth-footer">
      <button class="btn btn-primary" id="sendBtn" onclick="sendOtp()" disabled>
        ${t('send_code')}
      </button>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--gray);">
        ${State.lang === 'uz' ? 'Kirish orqali siz' : State.lang === 'ru' ? 'Входя, вы принимаете' : 'By logging in, you agree to our'}
        <a href="#" style="color:var(--red);">
          ${State.lang === 'uz' ? 'foydalanish shartlarini' : State.lang === 'ru' ? 'условия использования' : 'Terms of Service'}
        </a>
        ${State.lang === 'uz' ? 'qabul qilasiz.' : State.lang === 'ru' ? '.' : '.'}
      </p>
    </div>
  </div>
`);

function formatPhone(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 9);
  let formatted = '';
  if (val.length > 0) formatted = val.slice(0, 2);
  if (val.length > 2) formatted += ' ' + val.slice(2, 5);
  if (val.length > 5) formatted += ' ' + val.slice(5, 7);
  if (val.length > 7) formatted += ' ' + val.slice(7, 9);
  input.value = formatted;
  document.getElementById('sendBtn').disabled = val.length < 9;
}

let phoneVal = '';
function sendOtp() {
  const input = document.getElementById('phoneInput');
  phoneVal = '+998' + input.value.replace(/\D/g, '');
  navigate('auth-otp', { phone: phoneVal });
}

// ──────────────────────────────────────────────────────
// SCREEN: AUTH - OTP
// ──────────────────────────────────────────────────────
registerScreen('auth-otp', (p) => `
  ${header(t('verify'))}
  <div class="auth-wrap" style="background:var(--white);">
    <p class="auth-title" style="font-size:20px;">${t('enter_otp')}</p>
    <p class="auth-sub">${t('otp_sent')}: <strong>${p.phone || phoneVal}</strong></p>
    <div class="otp-row" id="otpRow">
      <input class="otp-box" maxlength="1" inputmode="numeric" oninput="otpInput(this,0)">
      <input class="otp-box" maxlength="1" inputmode="numeric" oninput="otpInput(this,1)">
      <input class="otp-box" maxlength="1" inputmode="numeric" oninput="otpInput(this,2)">
      <input class="otp-box" maxlength="1" inputmode="numeric" oninput="otpInput(this,3)">
    </div>
    <div class="otp-resend">
      <span id="resendText">${t('resend_in').replace('{}', '60')}</span>
    </div>
    <button class="btn btn-primary" id="verifyBtn" onclick="verifyOtp()" disabled>${t('verify')}</button>
  </div>
`);

function otpInput(el, idx) {
  el.classList.toggle('filled', el.value.length > 0);
  const boxes = document.querySelectorAll('.otp-box');
  if (el.value.length === 1 && idx < 3) boxes[idx + 1].focus();
  const code = Array.from(boxes).map(b => b.value).join('');
  document.getElementById('verifyBtn').disabled = code.length < 4;
}

function verifyOtp() {
  // Demo: any 4-digit code works
  const boxes = document.querySelectorAll('.otp-box');
  const code = Array.from(boxes).map(b => b.value).join('');
  if (code.length < 4) return;

  if (!State.user) {
    navigate('auth-profile', { phone: phoneVal });
  } else {
    navigate('home', {}, true);
  }
}

// ──────────────────────────────────────────────────────
// SCREEN: AUTH - PROFILE SETUP
// ──────────────────────────────────────────────────────
registerScreen('auth-profile', (p) => `
  ${header(State.lang === 'uz' ? 'Profilingiz' : State.lang === 'ru' ? 'Ваш профиль' : 'Your Profile')}
  <div class="scroll-content" style="padding-bottom:100px;">
    <div class="auth-wrap" style="background:var(--white);padding-top:20px;">
      <p class="auth-sub">${State.lang === 'uz' ? 'Ma\'lumotlaringizni kiriting' : State.lang === 'ru' ? 'Введите ваши данные' : 'Enter your details'}</p>
      <div class="form-group">
        <label class="form-label">${t('full_name')}</label>
        <input type="text" class="form-input" id="nameInput" placeholder="${State.lang === 'uz' ? 'Ism Familiya Otasining ismi' : State.lang === 'ru' ? 'ФИО' : 'Full Name'}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('dob')}</label>
        <input type="date" class="form-input" id="dobInput">
      </div>
      <div class="form-group">
        <label class="form-label">${t('passport')}</label>
        <input type="text" class="form-input" id="passportInput" placeholder="AA 1234567" maxlength="9">
      </div>
      <div class="form-group">
        <label class="form-label">${t('region')}</label>
        <select class="form-select" id="regionInput">
          <option value="">— ${t('region')} —</option>
          ${['tashkent','andijan','namangan','samarkand','bukhara','kashkadarya','surkhandarya','jizzakh','syrdarya','navoi','fergana','khorezm','karakalpakstan'].map(r => `<option value="${r}">${t(r)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="padding:0 24px 24px;">
      <button class="btn btn-primary" onclick="saveProfile()">
        ${State.lang === 'uz' ? 'Davom etish' : State.lang === 'ru' ? 'Продолжить' : 'Continue'}
      </button>
    </div>
  </div>
`);

function saveProfile() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) { showToast(State.lang === 'uz' ? 'Ismingizni kiriting' : 'Введите имя', 'error'); return; }
  State.user = {
    name,
    dob: document.getElementById('dobInput').value,
    passport: document.getElementById('passportInput').value,
    region: document.getElementById('regionInput').value,
    phone: phoneVal,
    joined: new Date().toISOString().split('T')[0],
  };
  State.bonusPoints = 250;
  State.save();
  initDemoData();
  navigate('home', {}, true);
}

// ──────────────────────────────────────────────────────
// SCREEN: HOME
// ──────────────────────────────────────────────────────
registerScreen('home', () => {
  const featuredProducts = PRODUCTS.slice(0, 6);
  return `
  <div class="home-header">
    <div class="home-greeting">${greeting()},</div>
    <div class="home-name">${State.user?.name?.split(' ')[0] || 'Mehmon'} 👋</div>
    <div class="home-balance-card">
      <div class="home-balance-label">${t('your_bonuses')}</div>
      <div class="home-balance-row">
        <div class="home-balance-val">${formatPrice(State.bonusPoints)} ${t('points')}</div>
        <div class="home-balance-coin">
          <span>⭐</span>
          <span>${t('bonus_info')}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="scroll-content">
    <!-- Quick Actions -->
    <div class="quick-actions fade-in">
      <div class="qa-item" onclick="navigate('products-list')">
        <div class="qa-icon red">${svgIcon('shield')}</div>
        <span class="qa-label">${t('buy_policy')}</span>
      </div>
      <div class="qa-item" onclick="navigate('policies')">
        <div class="qa-icon blue">📋</div>
        <span class="qa-label">${t('my_policies')}</span>
      </div>
      <div class="qa-item" onclick="navigate('claims')">
        <div class="qa-icon orange">🆘</div>
        <span class="qa-label">${t('claims')}</span>
      </div>
      <div class="qa-item" onclick="navigate('notifications')">
        <div class="qa-icon purple">${svgIcon('bell')}</div>
        <span class="qa-label">${t('notifications')}</span>
      </div>
    </div>

    <!-- Banner -->
    <div class="banner fade-in" style="background:linear-gradient(135deg,#C0282C 0%,#9B1C1C 100%);color:white;margin-top:20px;">
      <div class="banner-tag">🔥 ${t('new_offer')}</div>
      <div class="banner-title">KASKO VIP — 15% chegirma!</div>
      <div class="banner-sub">${State.lang === 'uz' ? 'Faqat shu oy uchun maxsus narx' : State.lang === 'ru' ? 'Специальная цена только в этом месяце' : 'Special price this month only'}</div>
      <button class="banner-btn" onclick="openProduct('kasko_vip')">${t('buy_now')} →</button>
    </div>

    <!-- Products -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">${t('our_products')}</span>
        <button class="section-link" onclick="navigate('products-list')">${t('all_products')}</button>
      </div>
    </div>
    <div class="products-scroll fade-in">
      ${featuredProducts.map(p => `
        <div class="product-card" onclick="openProduct('${p.id}')">
          ${p.popular ? `<span class="product-badge">TOP</span>` : ''}
          <div class="product-icon" style="background:${p.color}20;">
            <span style="font-size:22px;">${p.icon}</span>
          </div>
          <div class="product-name">${t(p.key)}</div>
          <div class="product-price">${State.lang === 'uz' ? 'dan' : State.lang === 'ru' ? 'от' : 'from'} <strong>${formatPrice(p.minPrice)} so'm</strong></div>
          <div class="product-card-bg" style="background:${p.color};"></div>
        </div>
      `).join('')}
    </div>

    <!-- Active Policies -->
    ${State.policies.filter(p => p.status === 'active').length ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">${t('my_policies')}</span>
        <button class="section-link" onclick="navigate('policies')">${t('all_products')}</button>
      </div>
    </div>
    <div class="card fade-in" style="margin:0 16px 4px;">
      ${State.policies.filter(p => p.status === 'active').slice(0,2).map(p => policyItemHtml(p)).join('')}
    </div>
    ` : ''}

    <!-- Notifications -->
    ${State.notifications?.filter(n => n.unread).length ? `
    <div class="section" style="padding-bottom:0;">
      <div class="section-header">
        <span class="section-title">${t('notifications')}</span>
        <button class="section-link" onclick="navigate('notifications')">${t('all_products')}</button>
      </div>
    </div>
    <div class="card fade-in" style="margin:0 16px 4px;">
      ${State.notifications.filter(n=>n.unread).slice(0,2).map(n=>`
        <div class="notif-item unread">
          <div class="notif-icon" style="background:${n.bg};">${n.icon}</div>
          <div class="notif-body">
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
          <div class="notif-dot"></div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div style="height:8px;"></div>
  </div>
  ${bottomNav('home')}
`;
});

function policyItemHtml(p) {
  return `
    <div class="policy-item" onclick="navigate('policy-detail',{id:'${p.id}'})">
      <div class="policy-icon" style="background:${p.iconColor}20;">
        <span style="font-size:22px;">${p.icon}</span>
      </div>
      <div class="policy-info">
        <div class="policy-name">${p.productName}</div>
        <div class="policy-date">${p.startDate} — ${p.endDate}</div>
      </div>
      <div class="policy-status">
        <div class="policy-amount">${p.premium}</div>
        <div class="status-badge ${p.status}">${t(p.status)}</div>
      </div>
    </div>
  `;
}

// ──────────────────────────────────────────────────────
// SCREEN: PRODUCTS LIST
// ──────────────────────────────────────────────────────
const CATEGORIES = {
  uz: ['Barchasi', 'Avtomobil', 'Sayohat', 'Mulk', 'Shaxsiy'],
  ru: ['Все', 'Авто', 'Путешествия', 'Имущество', 'Личное'],
  en: ['All', 'Auto', 'Travel', 'Property', 'Personal'],
};

const PRODUCT_CATS = {
  osago: 1, kasko_mini: 1, kasko_std: 1, kasko_comfort: 1, kasko_vip: 1,
  travel: 2, property: 3,
  accident_person: 4, accident_sport: 4, accident_student: 4,
};

let activeCat = 0;

registerScreen('products-list', () => {
  const cats = CATEGORIES[State.lang] || CATEGORIES.uz;
  return `
  ${header(t('all_products'), true)}
  <div class="cat-tabs">
    ${cats.map((c, i) => `<button class="cat-tab ${i === activeCat ? 'active' : ''}" onclick="filterCat(${i})">${c}</button>`).join('')}
  </div>
  <div class="scroll-content" style="padding-bottom:24px;">
    <div class="card" id="productsList" style="margin:0 16px;">
      ${renderProductList(activeCat)}
    </div>
  </div>
  ${bottomNav('products-list')}
`;
});

function renderProductList(cat) {
  const filtered = cat === 0 ? PRODUCTS : PRODUCTS.filter(p => PRODUCT_CATS[p.id] === cat);
  return filtered.map(p => `
    <div class="product-list-item" onclick="openProduct('${p.id}')">
      <div class="product-list-icon" style="background:${p.color}15;">
        <span style="font-size:26px;">${p.icon}</span>
      </div>
      <div class="product-list-info">
        <div class="product-list-name">${t(p.key)}</div>
        <div class="product-list-desc">${State.lang === 'uz' ? p.desc : State.lang === 'ru' ? p.descRu : p.descEn}</div>
      </div>
      <div class="product-list-arrow">${svgIcon('chevron')}</div>
    </div>
  `).join('');
}

function filterCat(cat) {
  activeCat = cat;
  document.querySelectorAll('.cat-tab').forEach((el, i) => el.classList.toggle('active', i === cat));
  document.getElementById('productsList').innerHTML = renderProductList(cat);
}

function openProduct(id) {
  State.selectedProduct = PRODUCTS.find(p => p.id === id);
  navigate('product-detail', { id });
}

// ──────────────────────────────────────────────────────
// SCREEN: PRODUCT DETAIL
// ──────────────────────────────────────────────────────
registerScreen('product-detail', (p) => {
  const prod = State.selectedProduct || PRODUCTS.find(x => x.id === p.id);
  if (!prod) return '<div>Not found</div>';

  const desc = State.lang === 'uz' ? prod.desc : State.lang === 'ru' ? prod.descRu : prod.descEn;
  const features = getProductFeatures(prod.id);

  return `
  ${header(t(prod.key))}
  <div class="scroll-content" style="padding-bottom:120px;">
    <div class="product-hero" style="${prod.gradient ? '' : ''}">
      <div class="product-hero-bg" style="background:${prod.gradient};"></div>
      <div class="product-hero-icon"><span style="font-size:36px;">${prod.icon}</span></div>
      <div class="product-hero-title">${t(prod.key)}</div>
      <div class="product-hero-sub">${desc}</div>
    </div>

    <!-- Calculator -->
    <div class="calculator-card">
      <div class="calc-title">
        🧮 ${t('calculator')}
      </div>
      ${prod.fields.includes('vehicle_number') ? `
      <div class="form-group">
        <label class="form-label">${t('vehicle_number')}</label>
        <input type="text" class="form-input" id="f_vehicle" placeholder="01 A 123 AA" style="text-transform:uppercase;">
      </div>
      <div class="form-group">
        <label class="form-label">${t('vehicle_year')}</label>
        <select class="form-select" id="f_year">
          ${Array.from({length:20},(_,i)=>2024-i).map(y=>`<option>${y}</option>`).join('')}
        </select>
      </div>
      ` : ''}
      ${prod.fields.includes('passport') ? `
      <div class="form-group">
        <label class="form-label">${t('passport')}</label>
        <input type="text" class="form-input" id="f_passport" placeholder="AA 1234567">
      </div>
      ` : ''}
      ${prod.id === 'travel' ? `
      <div class="form-group">
        <label class="form-label">${State.lang==='uz'?'Yo\'nalish':State.lang==='ru'?'Направление':'Destination'}</label>
        <select class="form-select" id="f_dest">
          <option>Yevropa / Европа</option>
          <option>Osiyo / Азия</option>
          <option>AQSH / США</option>
          <option>Butun dunyo / Весь мир</option>
        </select>
      </div>
      ` : ''}
      <div class="form-group">
        <label class="form-label">${t('region')}</label>
        <select class="form-select" id="f_region">
          <option value="">— ${t('region')} —</option>
          ${['tashkent','andijan','namangan','samarkand','bukhara','fergana','khorezm','karakalpakstan'].map(r=>`<option value="${r}">${t(r)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t('period')}</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${prod.periods.map((per, i) => `
            <button class="btn btn-sm ${i===0?'btn-primary':'btn-secondary'}" id="period_${per}" onclick="selectPeriod(${per}, this, '${prod.id}')">
              ${per} ${prod.id==='travel' ? (State.lang==='uz'?'kun':State.lang==='ru'?'дн.':'days') : (per === 12 ? '1 '+t('years') : per+' '+t('months'))}
            </button>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary" onclick="calculatePrice('${prod.id}', ${prod.minPrice})" style="margin-top:8px;">
        ${t('calculate')}
      </button>
    </div>

    <!-- Result (hidden initially) -->
    <div id="calcResult" style="display:none;">
      <div class="calc-result">
        <div class="calc-result-label">${t('price')}</div>
        <div class="calc-result-amount" id="resultAmount">0 so'm</div>
        <div class="calc-result-period" id="resultPeriod"></div>
      </div>
      <div class="calc-features">
        ${features.map(f => `
          <div class="calc-feature">
            <span class="calc-feature-icon">${f.icon}</span>
            <div class="calc-feature-text"><strong>${f.title}</strong>${f.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Buy button (sticky) -->
  <div id="buyBtn" style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:16px;background:var(--white);border-top:1px solid var(--border);display:none;">
    <button class="btn btn-primary" onclick="startPurchase('${prod.id}')">
      ${t('buy_now')} ${prod.icon}
    </button>
  </div>
`;
});

let selectedPeriod = 12;
function selectPeriod(per, btn, prodId) {
  selectedPeriod = per;
  document.querySelectorAll('[id^="period_"]').forEach(b => {
    b.className = 'btn btn-sm btn-secondary';
  });
  btn.className = 'btn btn-sm btn-primary';
}

function getProductFeatures(id) {
  const l = State.lang;
  const fs = {
    osago: [
      { icon: '💰', title: l==='uz'?'Qoplash:':l==='ru'?'Покрытие:':'Coverage:', desc: ' 20 mln so\'m' },
      { icon: '⚡', title: l==='uz'?'Tez:':l==='ru'?'Быстро:':'Fast:', desc: l==='uz'?' 5 daqiqada':l==='ru'?' 5 минут':' 5 minutes' },
      { icon: '📱', title: l==='uz'?'Onlayn:':l==='ru'?'Онлайн:':'Online:', desc: l==='uz'?' PDF polis':l==='ru'?' PDF полис':' PDF policy' },
      { icon: '🔔', title: l==='uz'?'Eslatma:':l==='ru'?'Напомним:':'Reminder:', desc: l==='uz'?' muddat tugashida':l==='ru'?' об истечении':' on expiry' },
    ],
    kasko_vip: [
      { icon: '👑', title: 'VIP:', desc: l==='uz'?' to\'liq himoya':l==='ru'?' полная защита':' full protection' },
      { icon: '🚗', title: l==='uz'?'Evakuator:':l==='ru'?'Эвакуатор:':'Tow:', desc: l==='uz'?' bepul':l==='ru'?' бесплатно':' free' },
      { icon: '🏥', title: l==='uz'?'Tibbiy:':l==='ru'?'Медицина:':'Medical:', desc: ' 24/7' },
      { icon: '💳', title: l==='uz'?'Bonus:':l==='ru'?'Бонус:':'Bonus:', desc: ' 3%' },
    ],
  };
  return fs[id] || [
    { icon: '✅', title: l==='uz'?'Tez rasmiylash:':l==='ru'?'Быстрое оформление:':'Quick registration:', desc: ' online' },
    { icon: '📄', title: 'PDF:', desc: l==='uz'?' polis':l==='ru'?' полис':' policy' },
    { icon: '💰', title: l==='uz'?'Qoplash:':l==='ru'?'Покрытие:':'Coverage:', desc: ` ${PRODUCTS.find(p=>p.id===id)?.coverage || '20 000 000'}` },
    { icon: '⭐', title: l==='uz'?'Bonus:':l==='ru'?'Бонус:':'Bonus:', desc: ' 2%' },
  ];
}

function calculatePrice(prodId, basePrice) {
  const prod = PRODUCTS.find(p => p.id === prodId);
  let price = basePrice * (selectedPeriod / 12);

  // Year-based multiplier for vehicles
  const yearEl = document.getElementById('f_year');
  if (yearEl) {
    const year = parseInt(yearEl.value);
    const age = 2024 - year;
    if (age > 10) price *= 1.3;
    else if (age > 5) price *= 1.15;
  }

  price = Math.round(price / 1000) * 1000;
  State.calcResult = { price, prodId, period: selectedPeriod, prod };

  document.getElementById('calcResult').style.display = 'block';
  document.getElementById('resultAmount').textContent = formatPrice(price) + ' so\'m';
  const pLabel = prod.id === 'travel'
    ? selectedPeriod + (State.lang==='uz'?' kun':State.lang==='ru'?' дней':' days')
    : selectedPeriod === 12 ? '1 '+t('years') : selectedPeriod+' '+t('months');
  document.getElementById('resultPeriod').textContent = pLabel;
  document.getElementById('buyBtn').style.display = 'block';

  document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function startPurchase(prodId) {
  if (!State.calcResult) {
    showToast(State.lang === 'uz' ? 'Avval hisoblang' : State.lang === 'ru' ? 'Сначала рассчитайте' : 'Calculate first', 'error');
    return;
  }
  navigate('payment-screen', { prodId });
}

// ──────────────────────────────────────────────────────
// SCREEN: PAYMENT
// ──────────────────────────────────────────────────────
registerScreen('payment-screen', (p) => {
  const cr = State.calcResult;
  const prod = cr?.prod || PRODUCTS.find(x => x.id === p.prodId);
  const price = cr?.price || prod?.minPrice || 0;
  const bonus = Math.round(price * 0.02);
  const pLabel = cr?.period === 12 ? '1 '+t('years') : (cr?.period || 12)+' '+t('months');

  return `
  ${header(t('pay'))}
  <div class="scroll-content" style="padding-bottom:120px;">
    <!-- Steps -->
    <div class="steps">
      <div class="step done"><div class="step-num">✓</div><div class="step-label">${t('step_info')}</div></div>
      <div class="step done"><div class="step-num">✓</div><div class="step-label">${t('step_calc')}</div></div>
      <div class="step active"><div class="step-num">3</div><div class="step-label">${t('step_pay')}</div></div>
    </div>

    <!-- Summary -->
    <div class="payment-summary" style="margin-top:20px;">
      <div class="payment-row">
        <span class="payment-row-label">${State.lang==='uz'?'Mahsulot':State.lang==='ru'?'Продукт':'Product'}</span>
        <span class="payment-row-value">${t(prod?.key || 'osago')}</span>
      </div>
      <div class="payment-row">
        <span class="payment-row-label">${t('period')}</span>
        <span class="payment-row-value">${pLabel}</span>
      </div>
      <div class="payment-row">
        <span class="payment-row-label">${t('insured_amount')}</span>
        <span class="payment-row-value">${prod?.coverage || '20 000 000'} so'm</span>
      </div>
      <div class="payment-row">
        <span class="payment-row-label">${t('bonus_earned')}</span>
        <span class="payment-row-value green">+${formatPrice(bonus)} ${t('points')}</span>
      </div>
      <div class="payment-row payment-total">
        <span class="payment-row-label" style="font-weight:700;color:var(--dark);">${t('price')}</span>
        <span class="payment-row-value red" style="font-size:18px;">${formatPrice(price)} so'm</span>
      </div>
    </div>

    <!-- Bonus use -->
    ${State.bonusPoints >= 10000 ? `
    <div style="margin:0 16px;padding:14px 16px;background:var(--white);border-radius:var(--r2);border:2px solid var(--border);display:flex;align-items:center;gap:12px;">
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;color:var(--dark);">${State.lang==='uz'?'Bonus ball ishlatish':State.lang==='ru'?'Использовать баллы':'Use bonus points'}</div>
        <div style="font-size:12px;color:var(--gray);">${formatPrice(State.bonusPoints)} ${t('points')} ≈ ${formatPrice(Math.floor(State.bonusPoints/10))} so'm</div>
      </div>
      <div class="toggle" id="bonusToggle" onclick="this.classList.toggle('on')"></div>
    </div>
    ` : ''}

    <!-- Payment Methods -->
    <div class="payment-methods" style="margin-top:16px;">
      <div class="pm-title">${t('payment_method')}</div>
      <div class="pm-list">
        ${[
          { id: 'click', name: 'Click', icon: '💳' },
          { id: 'payme', name: 'Payme', icon: '🟢' },
          { id: 'uzcard', name: 'UzCard', icon: '🏦' },
          { id: 'humo', name: 'Humo', icon: '💜' },
          { id: 'installment', name: t('installment') + ' (3-12 ' + t('months') + ')', icon: '📅' },
        ].map(m => `
          <div class="pm-item ${State.selectedPayment === m.id ? 'selected' : ''}" onclick="selectPayment('${m.id}')">
            <div class="pm-icon">${m.icon}</div>
            <div class="pm-name">${m.name}</div>
            <div class="pm-radio"></div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:16px;background:var(--white);border-top:1px solid var(--border);">
    <button class="btn btn-primary" onclick="processPayment('${prod?.id}', ${price}, ${bonus})">
      ${t('pay')} ${formatPrice(price)} so'm 🔒
    </button>
  </div>
`;
});

function selectPayment(id) {
  State.selectedPayment = id;
  document.querySelectorAll('.pm-item').forEach(el => el.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

function processPayment(prodId, price, bonus) {
  const prod = PRODUCTS.find(p => p.id === prodId);
  const btn = event.currentTarget;
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:24px;height:24px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:white;"></div>';

  setTimeout(() => {
    // Create policy
    const newPolicy = {
      id: policyId(),
      productId: prodId,
      productName: t(prod?.key || prodId),
      icon: prod?.icon || '🛡️',
      iconColor: prod?.color || '#C0282C',
      startDate: dateStr(0),
      endDate: dateStr(selectedPeriod * 30),
      amount: (prod?.coverage || '20 000 000') + ' so\'m',
      premium: formatPrice(price) + ' so\'m',
      status: 'active',
      person: State.user?.name || 'Foydalanuvchi',
      vehicle: document.getElementById('f_vehicle')?.value || '',
    };
    State.policies.unshift(newPolicy);
    State.bonusPoints += bonus;
    State.notifications?.unshift({
      id: Date.now(), title: t('policy_created'), text: `${t(prod?.key||prodId)} — ${newPolicy.id}`,
      time: State.lang==='uz'?'Hozir':State.lang==='ru'?'Сейчас':'Now', icon: '✅', bg: '#D4EDDA', unread: true
    });
    State.save();
    State.calcResult = { ...State.calcResult, policyId: newPolicy.id, bonus };
    navigate('success-screen', { policyId: newPolicy.id, bonus }, true);
  }, 2000);
}

// ──────────────────────────────────────────────────────
// SCREEN: SUCCESS
// ──────────────────────────────────────────────────────
registerScreen('success-screen', (p) => `
  <div style="flex:1;background:linear-gradient(145deg,#1A4A2E 0%,#27AE60 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;gap:0;">
    <div class="success-icon">
      <div style="color:white;">${svgIcon('check')}</div>
    </div>
    <h2 class="success-title" style="margin-top:24px;">${t('policy_created')}</h2>
    <p class="success-sub">${State.lang==='uz'?'Polisiz muvaffaqiyatli rasmiylashtirildi. SMS orqali ham yuborildi.':State.lang==='ru'?'Полис успешно оформлен и отправлен на ваш номер.':'Your policy has been successfully issued and sent to your number.'}</p>
    <div class="success-bonus">
      <div class="success-bonus-label">⭐ ${t('bonus_earned')}</div>
      <div class="success-bonus-val">+${formatPrice(p.bonus || State.calcResult?.bonus || 0)} ${t('points')}</div>
    </div>
    <div style="width:100%;display:flex;flex-direction:column;gap:10px;">
      <button class="btn" style="background:rgba(255,255,255,0.9);color:#1A4A2E;font-weight:700;" onclick="viewNewPolicy()">
        📋 ${State.lang==='uz'?'Polisni ko\'rish':State.lang==='ru'?'Посмотреть полис':'View Policy'}
      </button>
      <button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1.5px solid rgba(255,255,255,0.3);" onclick="navigate('home',{},true);State.screenStack=[];">
        ${t('home')}
      </button>
    </div>
  </div>
`);

function viewNewPolicy() {
  const newest = State.policies[0];
  if (newest) navigate('policy-detail', { id: newest.id });
}

// ──────────────────────────────────────────────────────
// SCREEN: MY POLICIES
// ──────────────────────────────────────────────────────
registerScreen('policies', () => `
  ${header(t('my_policies'), false)}
  <div class="scroll-content" style="padding-bottom:24px;">
    ${State.policies.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">${t('my_policies_empty')}</div>
        <div class="empty-sub">${t('my_policies_empty_sub')}</div>
        <button class="btn btn-primary btn-sm" onclick="navigate('products-list')" style="margin-top:8px;">${t('buy_policy')}</button>
      </div>
    ` : `
      <!-- Filter tabs -->
      <div class="cat-tabs">
        ${[
          State.lang==='uz'?'Barchasi':State.lang==='ru'?'Все':'All',
          t('active'), t('expired'), t('pending')
        ].map((c,i) => `<button class="cat-tab ${i===0?'active':''}" onclick="filterPolicies(${i},this)">${c}</button>`).join('')}
      </div>
      <div id="policiesList" class="card" style="margin:0 16px;">
        ${State.policies.map(p => policyItemHtml(p)).join('')}
      </div>
    `}
  </div>
  ${bottomNav('policies')}
`);

function filterPolicies(idx, btn) {
  document.querySelectorAll('.cat-tabs .cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const statuses = [null, 'active', 'expired', 'pending'];
  const status = statuses[idx];
  const filtered = status ? State.policies.filter(p => p.status === status) : State.policies;
  document.getElementById('policiesList').innerHTML = filtered.length
    ? filtered.map(p => policyItemHtml(p)).join('')
    : `<div class="empty-state" style="padding:32px 24px;"><div class="empty-icon">🔍</div><div class="empty-title">${State.lang==='uz'?'Natija yo\'q':State.lang==='ru'?'Нет результатов':'No results'}</div></div>`;
}

// ──────────────────────────────────────────────────────
// SCREEN: POLICY DETAIL
// ──────────────────────────────────────────────────────
registerScreen('policy-detail', (p) => {
  const pol = State.policies.find(x => x.id === p.id);
  if (!pol) return header(t('my_policies')) + '<div class="empty-state"><div class="empty-icon">😕</div></div>';

  return `
  ${header(pol.productName)}
  <div class="scroll-content" style="padding-bottom:24px;">
    <div style="background:${pol.iconColor};padding-bottom:24px;">
      <div class="policy-detail-hero">
        <div class="policy-detail-icon" style="background:rgba(255,255,255,.2);">${pol.icon}</div>
        <div class="policy-detail-name" style="color:white;">${pol.productName}</div>
        <div class="policy-detail-number" style="color:rgba(255,255,255,.7);">${pol.id}</div>
        <div class="status-badge ${pol.status}" style="background:rgba(255,255,255,.25);color:white;">${t(pol.status)}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="detail-actions" style="margin-top:16px;">
      <div class="detail-action" onclick="downloadPdf('${pol.id}')">
        <div class="detail-action-icon" style="background:var(--blue-light);color:var(--blue);">${svgIcon('download')}</div>
        <div class="detail-action-label">${t('download_pdf')}</div>
      </div>
      <div class="detail-action" onclick="sendSmsPdf('${pol.id}')">
        <div class="detail-action-icon" style="background:var(--green-light);color:var(--green);">${svgIcon('sms')}</div>
        <div class="detail-action-label">${t('send_sms')}</div>
      </div>
      <div class="detail-action" onclick="sharePolicy('${pol.id}')">
        <div class="detail-action-icon" style="background:var(--orange-light);color:var(--orange);">${svgIcon('share')}</div>
        <div class="detail-action-label">${t('share')}</div>
      </div>
      <div class="detail-action" onclick="navigate('claim-new',{policyId:'${pol.id}'})">
        <div class="detail-action-icon" style="background:var(--red-light);color:var(--red);">🆘</div>
        <div class="detail-action-label">${t('new_claim')}</div>
      </div>
    </div>

    <!-- Info -->
    <div class="info-list">
      <div class="info-row"><span class="info-label">${t('policy_number')}</span><span class="info-val">${pol.id}</span></div>
      <div class="info-row"><span class="info-label">${t('insured_person')}</span><span class="info-val">${pol.person}</span></div>
      ${pol.vehicle ? `<div class="info-row"><span class="info-label">${t('vehicle_number')}</span><span class="info-val">${pol.vehicle}</span></div>` : ''}
      <div class="info-row"><span class="info-label">${t('start_date')}</span><span class="info-val">${pol.startDate}</span></div>
      <div class="info-row"><span class="info-label">${t('end_date')}</span><span class="info-val">${pol.endDate}</span></div>
      <div class="info-row"><span class="info-label">${t('insured_amount')}</span><span class="info-val">${pol.amount}</span></div>
      <div class="info-row"><span class="info-label">${t('premium')}</span><span class="info-val">${pol.premium}</span></div>
    </div>

    <!-- Call center -->
    <div style="margin:0 16px 16px;">
      <button class="btn btn-ghost" onclick="callCenter()">
        ${svgIcon('phone')} ${t('call_center')}: 71 200 04 14
      </button>
    </div>
  </div>
`;
});

function downloadPdf(id) {
  showToast(State.lang==='uz'?'PDF yuklab olinmoqda...':State.lang==='ru'?'Загружается PDF...':'Downloading PDF...', 'success');
}

function sendSmsPdf(id) {
  showToast(State.lang==='uz'?'SMS yuborildi!':State.lang==='ru'?'SMS отправлен!':'SMS sent!', 'success');
}

function sharePolicy(id) {
  if (navigator.share) {
    navigator.share({ title: 'Kafil Sug\'urta', text: 'Polisim: ' + id, url: 'https://kafil.uz' });
  } else {
    showToast(State.lang==='uz'?'Ulashish mavjud emas':State.lang==='ru'?'Недоступно':'Not available', 'error');
  }
}

function callCenter() {
  window.location.href = 'tel:+998712000414';
}

// ──────────────────────────────────────────────────────
// SCREEN: BONUSES
// ──────────────────────────────────────────────────────
registerScreen('bonuses', () => {
  const bonusHistory = [
    { type: 'plus', name: t('policy_created') + ' — OSAGO', date: '2024-03-01', amount: 360 },
    { type: 'plus', name: t('policy_created') + ' — '+t('travel'), date: '2024-01-15', amount: 190 },
    { type: 'minus', name: State.lang==='uz'?'Bonus ishlatildi':State.lang==='ru'?'Использованы баллы':'Bonus used', date: '2024-02-10', amount: -500 },
    { type: 'plus', name: State.lang==='uz'?'Ro\'yxatdan o\'tish bonus':State.lang==='ru'?'Бонус за регистрацию':'Registration bonus', date: '2024-01-01', amount: 250 },
    ...State.policies.map(p => ({ type:'plus', name: t('policy_created')+' — '+p.productName, date: p.startDate, amount: Math.round((parseInt(p.premium)||180000)*0.02/1000)*10 }))
  ];

  return `
  ${header(t('bonuses'), false)}
  <div class="scroll-content" style="padding-bottom:24px;">
    <div class="bonus-hero">
      <div class="bonus-hero-label">⭐ ${t('your_bonuses')}</div>
      <div class="bonus-hero-val">${formatPrice(State.bonusPoints)}</div>
      <div class="bonus-hero-sub">${t('points')} · ${t('bonus_info')}</div>
    </div>

    <!-- How to use -->
    <div class="calculator-card" style="margin:16px;">
      <div class="calc-title">💡 ${State.lang==='uz'?'Bonuslardan qanday foydalanish':State.lang==='ru'?'Как использовать баллы':'How to use bonuses'}</div>
      <div style="font-size:13px;color:var(--gray);line-height:1.6;">
        ${State.lang==='uz'
          ? '10 000 ball = 1 000 so\'m chegirma. Ixtiyoriy sug\'urtalarda to\'lov sifatida ishlatiladi.'
          : State.lang==='ru'
          ? '10 000 баллов = 1 000 сум скидки. Используется при оплате добровольных страховок.'
          : '10,000 points = 1,000 UZS discount. Used for voluntary insurance payments.'}
      </div>
    </div>

    <!-- History -->
    <div class="section-header" style="padding:0 16px 12px;">
      <span class="section-title">${State.lang==='uz'?'Tarix':State.lang==='ru'?'История':'History'}</span>
    </div>
    <div class="card" style="margin:0 16px;">
      ${bonusHistory.slice(0,8).map(h => `
        <div class="bonus-history-item">
          <div class="bonus-dot ${h.type}">${h.type==='plus'?'↑':'↓'}</div>
          <div class="bonus-history-info">
            <div class="bonus-history-name">${h.name}</div>
            <div class="bonus-history-date">${h.date}</div>
          </div>
          <div class="bonus-history-amount ${h.type}">${h.type==='plus'?'+':''}${formatPrice(h.amount)} ${t('points')}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ${bottomNav('bonuses')}
`;
});

// ──────────────────────────────────────────────────────
// SCREEN: CLAIMS
// ──────────────────────────────────────────────────────
registerScreen('claims', () => `
  ${header(t('claims'), true, `<button class="header-action" onclick="navigate('claim-new')">${svgIcon('plus')}</button>`)}
  <div class="scroll-content" style="padding-bottom:24px;">
    ${State.claims.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🆘</div>
        <div class="empty-title">${t('claim_empty')}</div>
        <div class="empty-sub">${t('claim_empty_sub')}</div>
        <button class="btn btn-primary btn-sm" onclick="navigate('claim-new')" style="margin-top:8px;">${t('new_claim')}</button>
      </div>
    ` : `
      <div class="card" style="margin:16px;">
        ${State.claims.map(c => `
          <div class="claim-item">
            <div class="claim-icon">🆘</div>
            <div class="claim-info">
              <div class="claim-title">${c.type}</div>
              <div class="claim-date">${c.date}</div>
              <span class="status-badge ${c.status} claim-status">${t(c.status)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `}

    <!-- Call center quick -->
    <div style="margin:16px;">
      <div style="font-size:14px;font-weight:600;color:var(--dark);margin-bottom:12px;">
        ${State.lang==='uz'?'Tezkor aloqa':State.lang==='ru'?'Быстрая связь':'Quick Contact'}
      </div>
      <button class="btn btn-ghost" onclick="callCenter()" style="margin-bottom:10px;">
        ${svgIcon('phone')} ${t('call_center')}: 71 200 04 14
      </button>
      <button class="btn btn-secondary" onclick="navigate('claim-new')">
        ${svgIcon('plus')} ${t('new_claim')}
      </button>
    </div>
  </div>
`);

// ──────────────────────────────────────────────────────
// SCREEN: NEW CLAIM
// ──────────────────────────────────────────────────────
registerScreen('claim-new', (p) => `
  ${header(t('new_claim'))}
  <div class="scroll-content" style="padding-bottom:120px;">
    <div style="padding:16px;">
      ${State.policies.length ? `
      <div class="form-group">
        <label class="form-label">${t('my_policies')}</label>
        <select class="form-select" id="claimPolicy">
          ${State.policies.filter(x=>x.status==='active').map(pol=>`<option value="${pol.id}">${pol.productName} — ${pol.id}</option>`).join('') || `<option>${State.lang==='uz'?'Faol polis yo\'q':State.lang==='ru'?'Нет активных полисов':'No active policies'}</option>`}
        </select>
      </div>
      ` : ''}
      <div class="form-group">
        <label class="form-label">${t('claim_type')}</label>
        <select class="form-select" id="claimType">
          ${['accident','theft','natural','fire','other'].map(c=>`<option value="${c}">${t(c)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${State.lang==='uz'?'Voqea sanasi':State.lang==='ru'?'Дата события':'Event date'}</label>
        <input type="date" class="form-input" id="claimDate" value="${dateStr(0)}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('description')}</label>
        <textarea class="form-textarea" id="claimDesc" placeholder="${State.lang==='uz'?'Voqeani batafsil tasvirlab bering...':State.lang==='ru'?'Опишите событие подробно...':'Describe the event in detail...'}"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">${t('attach_photo')}</label>
        <div class="upload-area" onclick="triggerUpload()">
          <div class="upload-icon">📷</div>
          <div class="upload-text">
            <strong>${State.lang==='uz'?'Foto/video tanlash':State.lang==='ru'?'Выбрать фото/видео':'Select photo/video'}</strong>
            ${State.lang==='uz'?'JPG, PNG, MP4 • Max 10MB':State.lang==='ru'?'JPG, PNG, MP4 • Макс 10МБ':'JPG, PNG, MP4 • Max 10MB'}
          </div>
        </div>
        <input type="file" id="claimFile" accept="image/*,video/*" multiple style="display:none" onchange="previewFiles(this)">
        <div id="uploadPreview" class="upload-preview"></div>
      </div>
    </div>
  </div>
  <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:16px;background:var(--white);border-top:1px solid var(--border);">
    <button class="btn btn-primary" onclick="submitClaim()">
      ${t('submit')}
    </button>
  </div>
`);

function triggerUpload() {
  document.getElementById('claimFile').click();
}

function previewFiles(input) {
  const preview = document.getElementById('uploadPreview');
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'upload-preview-item';
      div.innerHTML = `<img src="${e.target.result}">`;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function submitClaim() {
  const type = document.getElementById('claimType')?.value;
  const date = document.getElementById('claimDate')?.value;
  const desc = document.getElementById('claimDesc')?.value;
  if (!desc?.trim()) {
    showToast(State.lang==='uz'?'Tavsif kiriting':State.lang==='ru'?'Введите описание':'Enter description', 'error');
    return;
  }
  State.claims.unshift({ id: 'C-'+Date.now(), type: t(type||'accident'), date, desc, status: 'pending' });
  State.save();
  showToast(State.lang==='uz'?'Da\'vo yuborildi!':State.lang==='ru'?'Претензия отправлена!':'Claim submitted!', 'success');
  setTimeout(() => goBack(), 1000);
}

// ──────────────────────────────────────────────────────
// SCREEN: NOTIFICATIONS
// ──────────────────────────────────────────────────────
registerScreen('notifications', () => `
  ${header(t('notifications'))}
  <div class="scroll-content" style="padding-bottom:24px;">
    ${!State.notifications?.length ? `
      <div class="empty-state">
        <div class="empty-icon">🔔</div>
        <div class="empty-title">${t('notif_empty')}</div>
      </div>
    ` : `
      <div class="card" style="margin:16px;">
        ${State.notifications.map(n => `
          <div class="notif-item ${n.unread?'unread':''}" onclick="markRead(${n.id})">
            <div class="notif-icon" style="background:${n.bg};">${n.icon}</div>
            <div class="notif-body">
              <div class="notif-title">${n.title}</div>
              <div class="notif-text">${n.text}</div>
              <div class="notif-time">${n.time}</div>
            </div>
            ${n.unread ? '<div class="notif-dot"></div>' : ''}
          </div>
        `).join('')}
      </div>
    `}
  </div>
`);

function markRead(id) {
  const n = State.notifications?.find(x => x.id === id);
  if (n) { n.unread = false; State.save(); }
}

// ──────────────────────────────────────────────────────
// SCREEN: PROFILE
// ──────────────────────────────────────────────────────
registerScreen('profile-screen', () => {
  const initials = State.user?.name?.split(' ').map(w=>w[0]).slice(0,2).join('') || 'U';
  return `
  ${header(t('profile'), false)}
  <div class="scroll-content" style="padding-bottom:24px;">
    <div class="profile-hero">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-name">${State.user?.name || 'Foydalanuvchi'}</div>
      <div class="profile-phone">${State.user?.phone || phoneVal || '+998 -- --- -- --'}</div>
    </div>

    <!-- Lang switch -->
    <div style="padding:16px 16px 0;">
      <div style="font-size:13px;font-weight:600;color:var(--gray);margin-bottom:8px;">
        ${State.lang==='uz'?'Tilni o\'zgartirish':State.lang==='ru'?'Сменить язык':'Change language'}
      </div>
      <div class="lang-tabs">
        <button class="lang-tab ${State.lang==='uz'?'active':''}" onclick="changeLang('uz')">O'zbekcha</button>
        <button class="lang-tab ${State.lang==='ru'?'active':''}" onclick="changeLang('ru')">Русский</button>
        <button class="lang-tab ${State.lang==='en'?'active':''}" onclick="changeLang('en')">English</button>
      </div>
    </div>

    <div class="profile-menu">
      ${[
        { icon: '👤', bg: '#EBF5FB', title: State.lang==='uz'?'Shaxsiy ma\'lumotlar':State.lang==='ru'?'Личные данные':'Personal info', sub: State.user?.passport || '', action: 'editProfile' },
        { icon: '🔔', bg: '#FEF9E7', title: t('notifications'), sub: State.lang==='uz'?'Sozlash':State.lang==='ru'?'Настроить':'Configure', action: 'navigate(\'notifications\')' },
        { icon: '⭐', bg: '#F9F0FF', title: t('bonuses'), sub: `${formatPrice(State.bonusPoints)} ${t('points')}`, action: 'navigate(\'bonuses\')' },
        { icon: '🆘', bg: '#FFF0F0', title: t('claims'), sub: `${State.claims.length} ${State.lang==='uz'?'ta':State.lang==='ru'?'шт.':''}`, action: 'navigate(\'claims\')' },
        { icon: '📞', bg: '#E8F8F5', title: t('call_center'), sub: '71 200 04 14', action: 'callCenter()' },
        { icon: '🌐', bg: '#EBF5FB', title: 'kafil.uz', sub: State.lang==='uz'?'Saytga o\'tish':State.lang==='ru'?'Перейти на сайт':'Visit website', action: 'openWebsite()' },
      ].map(item => `
        <div class="profile-menu-item" onclick="${item.action}">
          <div class="profile-menu-icon" style="background:${item.bg};">${item.icon}</div>
          <div class="profile-menu-text">
            <div class="profile-menu-title">${item.title}</div>
            ${item.sub ? `<div class="profile-menu-sub">${item.sub}</div>` : ''}
          </div>
          <div style="color:var(--gray2);">${svgIcon('chevron')}</div>
        </div>
      `).join('')}
    </div>

    <div style="padding:0 16px 16px;">
      <button class="btn btn-secondary" style="color:var(--red);border-color:var(--red);" onclick="logout()">
        ${State.lang==='uz'?'Chiqish':State.lang==='ru'?'Выйти':'Log out'}
      </button>
    </div>

    <div style="text-align:center;font-size:12px;color:var(--gray2);padding-bottom:8px;">
      Kafil Sug'urta v1.0 · kafil.uz
    </div>
  </div>
  ${bottomNav('profile-screen')}
`;
});

function changeLang(lang) {
  State.lang = lang;
  State.save();
  // Reload the current tab
  const cur = activeScreen;
  if (document.getElementById(`screen-${cur}`)) document.getElementById(`screen-${cur}`).remove();
  navigate(cur, {}, true);
}

function editProfile() {
  showToast(State.lang==='uz'?'Tez orada...':State.lang==='ru'?'Скоро...':'Coming soon...');
}

function openWebsite() {
  window.open('https://kafil.uz', '_blank');
}

function logout() {
  if (confirm(State.lang==='uz'?'Hisobdan chiqmoqchimisiz?':State.lang==='ru'?'Выйти из аккаунта?':'Log out?')) {
    State.user = null;
    localStorage.removeItem('kfUser');
    localStorage.removeItem('kfPolicies');
    localStorage.removeItem('kfClaims');
    localStorage.removeItem('kfBonus');
    localStorage.removeItem('kfNotifs');
    State.policies = [];
    State.claims = [];
    State.bonusPoints = 0;
    State.notifications = null;
    State.screenStack = [];
    document.getElementById('app').innerHTML = '';
    init();
  }
}

// ──────────────────────────────────────────────────────
// BIND SCREENS (event wiring after render)
// ──────────────────────────────────────────────────────
function bindScreen(id, el, params) {
  if (id === 'auth-otp') {
    let timer = 60;
    const interval = setInterval(() => {
      timer--;
      const el = document.getElementById('resendText');
      if (el) {
        if (timer > 0) el.textContent = t('resend_in').replace('{}', timer);
        else { el.innerHTML = `<button onclick="resendOtp()">${t('resend')}</button>`; clearInterval(interval); }
      } else clearInterval(interval);
    }, 1000);
    setTimeout(() => document.querySelector('.otp-box')?.focus(), 100);
  }
}

function resendOtp() {
  showToast(t('otp_sent') + '!', 'success');
  // Reset timer logic would go here
}

// ──────────────────────────────────────────────────────
// TELEGRAM MINI APP INTEGRATION
// ──────────────────────────────────────────────────────
function initTelegram() {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#1A2B4A');
      tg.setBackgroundColor('#EDF0F5');

      // Get user from Telegram
      if (tg.initDataUnsafe?.user) {
        const tu = tg.initDataUnsafe.user;
        if (!State.user) {
          phoneVal = 'Telegram: @' + (tu.username || tu.id);
          State.user = {
            name: `${tu.first_name || ''} ${tu.last_name || ''}`.trim(),
            phone: phoneVal,
            joined: new Date().toISOString().split('T')[0],
          };
          State.save();
        }
      }

      // Back button
      tg.BackButton.onClick(() => {
        if (State.screenStack.length) goBack();
        else tg.close();
      });
    }
  } catch (e) {}
}

// ──────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────
function init() {
  initTelegram();

  // Render splash
  navigate('splash', {}, true);

  setTimeout(() => {
    if (!localStorage.getItem('kfLang')) {
      navigate('lang-select', {}, true);
    } else if (!State.user) {
      navigate('auth-phone', {}, true);
    } else {
      initDemoData();
      navigate('home', {}, true);
    }
  }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
