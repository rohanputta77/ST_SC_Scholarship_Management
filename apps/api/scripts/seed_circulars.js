const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const docsDir = path.join(__dirname, '..', '..', '..', 'documents');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

async function createPDF(text, filename) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  
  const lines = text.split('\n');
  let y = 350;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
    y -= 20;
  }
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filename, pdfBytes);
  console.log(`Generated: ${filename}`);
}

async function run() {
  // Document 1: 04.08.2026 Notice (Clarification only)
  const doc1 = `MINISTRY OF TRIBAL AFFAIRS\nNotice Date: 04.08.2026\n\nSubject: Clarification on NFST Merit List\n\nThis is to clarify that the merit list will be prepared\nbased on 50% weightage to NET score and 50% to Master's.\nThis formula remains unchanged.`;
  await createPDF(doc1, path.join(docsDir, 'notice_04_08_2026_clarification.pdf'));

  // Document 2: Fictional Circular (Explicit Change)
  const doc2 = `MINISTRY OF TRIBAL AFFAIRS\nCircular Date: 12.11.2026\n\nSubject: REVISION OF MERIT WEIGHTS\n\nEffective immediately, the National Fellowship for ST\ncandidates shall prioritize NET scores, adopting a\n60% NET and 40% Master's weightage formula for all\nupcoming allocation cycles.`;
  await createPDF(doc2, path.join(docsDir, 'circular_fictional_60_40_revision.pdf'));
}

run().catch(console.error);
