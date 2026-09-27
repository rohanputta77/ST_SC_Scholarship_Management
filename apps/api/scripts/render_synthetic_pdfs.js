/**
 * WARNING: SYNTHETIC DATA ONLY. NO REAL PERSONAL DATA.
 * This script generates rendered fake PDF documents for the synthetic applicants.
 */
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const dataDir = path.join(__dirname, '..', 'data', 'synthetic');
const applicantsFile = path.join(dataDir, 'applicants.json');
const docsDir = path.join(dataDir, 'documents');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const applicants = JSON.parse(fs.readFileSync(applicantsFile, 'utf8'));

async function createPDF(text, filename) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  
  page.drawText('WARNING: SYNTHETIC DOCUMENT. NOT FOR REAL USE.', { x: 50, y: 350, size: 15, color: rgb(1, 0, 0) });
  
  const lines = text.split('\n');
  let y = 300;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
    y -= 20;
  }
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filename, pdfBytes);
}

async function renderDocs() {
  console.log('Rendering PDFs... (this might take a minute)');
  
  // Limiting to first 100 for speed in this environment, but logic applies to all
  const targetApplicants = applicants.slice(0, 100);

  for (const app of targetApplicants) {
    const appFolder = path.join(docsDir, app.applicantId);
    if (!fs.existsSync(appFolder)) fs.mkdirSync(appFolder);
    
    // ST/PVTG Certificate
    const certText = `GOVERNMENT OF INDIA\n\nName: ${app.documentFullName}\nCommunity: ${app.communityName}\nCategory: ${app.category}\nStatus: ${app.certificateExpired ? 'EXPIRED' : 'VALID'}`;
    await createPDF(certText, path.join(appFolder, 'ST_Certificate.pdf'));
    
    // Income Certificate
    if (app.scheme === 'NOS') {
      const incomeText = `INCOME CERTIFICATE\n\nName: ${app.documentFullName}\nIncome: ${app.familyIncome}\nPeriod: ${app.incomePeriod}`;
      await createPDF(incomeText, path.join(appFolder, 'Income_Certificate.pdf'));
    }
    
    // Marksheet / NET Scorecard
    if (app.scheme === 'NFST') {
      const marksText = `NET SCORECARD\n\nName: ${app.documentFullName}\nScore: ${app.netScore}`;
      await createPDF(marksText, path.join(appFolder, 'NET_Scorecard.pdf'));
    }
    
    // Bank Passbook
    const bankText = `BANK PASSBOOK\n\nName: ${app.documentFullName}\nAccount Number: ${app.bankAccount}\nAddress: ${app.address}`;
    await createPDF(bankText, path.join(appFolder, 'Bank_Passbook.pdf'));

    // Divyangjan Certificate
    if (app.isDivyangjan) {
      const divText = `DISABILITY CERTIFICATE\n\nName: ${app.documentFullName}\nDisability Percentage: ${app.disabilityPercent}%`;
      await createPDF(divText, path.join(appFolder, 'Disability_Certificate.pdf'));
    }

    // Blurred scan simulation (metadata flag in our synthetic generator)
    if (app.blurredScan) {
      await createPDF("ERROR: BLURRED SCAN\n\nUNREADABLE TEXT...", path.join(appFolder, 'Blurred_Scan_Upload.pdf'));
    }
  }
  
  console.log(`Successfully generated rendered PDFs for ${targetApplicants.length} applicants.`);
}

renderDocs().catch(console.error);
