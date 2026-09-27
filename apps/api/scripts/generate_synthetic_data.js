/**
 * WARNING: SYNTHETIC DATA ONLY. NO REAL PERSONAL DATA.
 * This script generates entirely synthetic applicants, institutions, and documents
 * for testing the STSC scholarship system. 
 * Aadhaar tokens are guaranteed to be structurally invalid for real-world use.
 */

const fs = require('fs');
const path = require('path');
const { fakerEN_IN: faker } = require('@faker-js/faker');

const TOTAL_NFST = 5000;
const TOTAL_NOS = 300;

// PVTG Real and Near-miss lists
const REAL_PVTG = ["Saharia", "Baiga", "Bonda", "Toda", "Sentinelese", "Jarawa", "Lodha", "Abujh Macia"];
const FAKE_PVTG = ["Sahariaa", "Baigah", "Bondaa", "Tohda", "Sentinelez", "Jarwa", "Lohda"];

// We will inject specific defect rates
const DEFECT_RATES = {
  NAME_MISMATCH: 0.08,
  COMMUNITY_MISSPELLED: 0.05,
  MONTHLY_INCOME: 0.05, // (Only NOS)
  EXPIRED_CERT: 0.05,
  DUPLICATE_BANK: 0.02,
  BLURRED_SCAN: 0.10,
  DISABILITY_BELOW_40: 0.03
};

function generateAadhaarToken() {
  // Always starts with 0000, which is un-issuable
  return '0000' + faker.string.numeric(8);
}

const fraudRing = {
  bankAccount: faker.finance.accountNumber(15),
  address: faker.location.streetAddress() + ", " + faker.location.city()
};
let fraudRingCount = 0;
const MAX_FRAUD_RING = 8; // 5-8 applicants

function getVariantName(name) {
  if (name.endsWith('a')) return name + 'a';
  if (name.endsWith('i')) return name + 'ee';
  return name;
}

const applicants = [];
const groundTruth = {};
const duplicateBankPool = [];

function generateApplicant(scheme, idSuffix) {
  const isFraudRing = (fraudRingCount < MAX_FRAUD_RING) && Math.random() < 0.01;
  const isFemale = Math.random() < 0.45;
  const gender = isFemale ? 'Female' : 'Male';
  const firstName = faker.person.firstName(gender.toLowerCase());
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;

  // Aadhaar Token
  const aadhaar = generateAadhaarToken();

  // Address & Bank
  let address = faker.location.streetAddress() + ", " + faker.location.city();
  let bankAccount = faker.finance.accountNumber(15);
  let isDupeBank = false;
  
  if (isFraudRing) {
    address = fraudRing.address;
    bankAccount = fraudRing.bankAccount;
    fraudRingCount++;
  } else if (Math.random() < DEFECT_RATES.DUPLICATE_BANK) {
    if (duplicateBankPool.length > 0 && Math.random() < 0.5) {
      bankAccount = duplicateBankPool[Math.floor(Math.random() * duplicateBankPool.length)];
      isDupeBank = true;
    } else {
      duplicateBankPool.push(bankAccount);
    }
  }

  // Demographics
  const isPVTG = Math.random() < 0.20;
  const isDivyangjan = Math.random() < 0.05;
  const category = isPVTG ? 'PVTG' : 'ST';

  // Defects
  const defects = [];
  const hasNameMismatch = Math.random() < DEFECT_RATES.NAME_MISMATCH;
  const docFullName = hasNameMismatch ? getVariantName(firstName) + ' ' + lastName : fullName;
  if (hasNameMismatch) defects.push('NAME_MISMATCH');

  let communityName = category === 'PVTG' ? REAL_PVTG[Math.floor(Math.random() * REAL_PVTG.length)] : 'Gond';
  if (isPVTG && Math.random() < DEFECT_RATES.COMMUNITY_MISSPELLED) {
    communityName = FAKE_PVTG[Math.floor(Math.random() * FAKE_PVTG.length)];
    defects.push('COMMUNITY_MISSPELLED');
  }

  let incomePeriod = 'annual';
  if (scheme === 'NOS' && Math.random() < DEFECT_RATES.MONTHLY_INCOME) {
    incomePeriod = 'monthly';
    defects.push('MONTHLY_INCOME');
  }

  const hasExpiredCert = Math.random() < DEFECT_RATES.EXPIRED_CERT;
  if (hasExpiredCert) defects.push('EXPIRED_CERT');

  const hasBlurredScan = Math.random() < DEFECT_RATES.BLURRED_SCAN;
  if (hasBlurredScan) defects.push('BLURRED_SCAN');

  let disabilityPercent = isDivyangjan ? faker.number.int({ min: 40, max: 100 }) : 0;
  if (isDivyangjan && Math.random() < DEFECT_RATES.DISABILITY_BELOW_40) {
    disabilityPercent = faker.number.int({ min: 10, max: 39 });
    defects.push('DISABILITY_BELOW_40');
  }

  if (isFraudRing) defects.push('FRAUD_RING');
  if (isDupeBank) defects.push('DUPLICATE_BANK');

  const applicantId = `APP-${scheme}-${idSuffix.toString().padStart(5, '0')}`;
  
  // Base App Data
  const appData = {
    applicantId,
    scheme,
    aadhaarToken: aadhaar,
    fullName,
    documentFullName: docFullName,
    gender,
    category,
    communityName,
    isDivyangjan,
    disabilityPercent,
    bankAccount,
    address,
    familyIncome: faker.number.int({ min: 100000, max: 1500000 }),
    incomePeriod,
    certificateExpired: hasExpiredCert,
    blurredScan: hasBlurredScan,
    // Scoring mock
    netScore: scheme === 'NFST' ? faker.number.int({ min: 0, max: 100 }) : null,
    masterScore: faker.number.int({ min: 50, max: 100 }),
    qsTop1000: scheme === 'NOS' ? Math.random() < 0.2 : false,
    offerInstitute: scheme === 'NFST' && Math.random() < 0.1 ? 'IIT' : 'Other'
  };

  applicants.push(appData);

  groundTruth[applicantId] = {
    scheme,
    trueFullName: fullName,
    isFraudRing,
    isDupeBank,
    defects,
    eligible: defects.length === 0 && (scheme === 'NOS' ? (appData.familyIncome <= 600000 && incomePeriod === 'annual') : true)
  };
}

// Generate data
for (let i = 1; i <= TOTAL_NFST; i++) {
  generateApplicant('NFST', i);
}
for (let i = 1; i <= TOTAL_NOS; i++) {
  generateApplicant('NOS', i);
}

// Save outputs
const outDir = path.join(__dirname, '..', 'data', 'synthetic');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'applicants.json'), JSON.stringify(applicants, null, 2));
fs.writeFileSync(path.join(outDir, 'ground_truth.json'), JSON.stringify(groundTruth, null, 2));

console.log(`Generated ${applicants.length} synthetic applicants with explicit ground-truth labeling.`);
