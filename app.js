/**
 * BD 業務員工獎金計算邏輯
 */

// Table Booking: 1-8 間 400/間, 9+ 間 1000/間（該月總間數用同一單價）
function tableBookingBonusMonthly(count) {
  if (count <= 0) return 0;
  const perUnit = count >= 9 ? 1000 : 400;
  return count * perUnit;
}

// Menu Sign-up: 每間 650
const MENU_SIGNUP_PER_UNIT = 650;
function menuSignupBonusMonthly(count) {
  return count * MENU_SIGNUP_PER_UNIT;
}

// Menu GMV tiers (單一 tier，整筆用該費率)
// Nett Revenue ≈ GMV * 5%, commission = Nett * rate
const MENU_GMV_TIERS = [
  { min: 100000, max: 399999, rate: 0.12 },
  { min: 400000, max: 799999, rate: 0.17 },
  { min: 800000, max: 1499999, rate: 0.23 },
  { min: 1500000, max: 2199999, rate: 0.25 },
  { min: 2200000, max: 9000000, rate: 0.27 },
];
const MENU_NETT_RATIO = 0.05; // 約略估算

function menuGmvCommission(gmv) {
  if (gmv < 100000) return 0;
  const tier = MENU_GMV_TIERS.find((t) => gmv >= t.min && gmv <= t.max);
  if (!tier) return 0; // 超過 9,000,000 不計或可擴充
  const nett = gmv * MENU_NETT_RATIO;
  return Math.round(nett * tier.rate);
}

// RMS: 每 POI 20000, Nett ≈ 20000 * POIs * 35%, commission = Nett * tier rate
const RMS_PRICE_PER_POI = 20000;
const RMS_NETT_RATIO = 0.35; // 約略估算
const RMS_POI_TIERS = [
  { min: 1, max: 4, rate: 0.1 },
  { min: 5, max: 10, rate: 0.15 },
  { min: 11, max: 19, rate: 0.23 },
  { min: 20, max: 29, rate: 0.25 },
  { min: 30, max: 40, rate: 0.27 },
];

function rmsCommission(pois) {
  if (pois <= 0) return 0;
  const tier = RMS_POI_TIERS.find((t) => pois >= t.min && pois <= t.max);
  if (!tier) return 0;
  const nett = RMS_PRICE_PER_POI * pois * RMS_NETT_RATIO;
  return Math.round(nett * tier.rate);
}

function formatCurrency(n) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function calculateQuarterly(input) {
  const tableMonthly = Number(input.tableBookingMonthly) || 0;
  const menuSignupMonthly = Number(input.menuSignupMonthly) || 0;
  const menuGmv = Number(input.menuGmvQuarterly) || 0;
  const rmsPois = Number(input.rmsPoisQuarterly) || 0;

  const tableBookingQuarterly = tableBookingBonusMonthly(tableMonthly) * 3;
  const menuSignupQuarterly = menuSignupBonusMonthly(menuSignupMonthly) * 3;
  const menuGmvCommissionAmount = menuGmvCommission(menuGmv);
  const rmsCommissionAmount = rmsCommission(rmsPois);

  const total =
    tableBookingQuarterly +
    menuSignupQuarterly +
    menuGmvCommissionAmount +
    rmsCommissionAmount;

  return {
    tableBookingQuarterly,
    menuSignupQuarterly,
    menuGmvCommission: menuGmvCommissionAmount,
    rmsCommission: rmsCommissionAmount,
    total,
  };
}

// DOM
const form = document.getElementById('commission-form');
const resultContent = document.getElementById('result-content');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const input = {
    tableBookingMonthly: formData.get('tableBookingMonthly'),
    menuSignupMonthly: formData.get('menuSignupMonthly'),
    menuGmvQuarterly: formData.get('menuGmvQuarterly'),
    rmsPoisQuarterly: formData.get('rmsPoisQuarterly'),
  };

  const result = calculateQuarterly(input);

  resultContent.innerHTML = `
    <ul class="result-list">
      <li>
        <span class="label">Table Booking Sign-up Bonus（季）</span>
        <span class="value">NTD ${formatCurrency(result.tableBookingQuarterly)}</span>
        <span class="note">該獎金以每月為結算發放。</span>
      </li>
      <li>
        <span class="label">Menu Sign-up Bonus（季）</span>
        <span class="value">NTD ${formatCurrency(result.menuSignupQuarterly)}</span>
        <span class="note">該獎金以每月為結算發放。</span>
      </li>
      <li>
        <span class="label">Net Menu GMV Commission（季）</span>
        <span class="value">NTD ${formatCurrency(result.menuGmvCommission)}</span>
        <span class="note">* Nett Revenue 約為稅前 GMV × 5%，僅供約略估算，實際依簽約分潤與成本為準。</span>
      </li>
      <li>
        <span class="label">Net RMS Revenue Commission（季）</span>
        <span class="value">NTD ${formatCurrency(result.rmsCommission)}</span>
        <span class="note">* Nett Revenue 約為稅前 GMV × 35%，僅供約略估算，實際依 RMS 售價與成本為準。</span>
      </li>
    </ul>
    <div class="total-row">
      <span class="label">季獎金總計</span>
      <span class="value">NTD ${formatCurrency(result.total)}</span>
    </div>
  `;
});
