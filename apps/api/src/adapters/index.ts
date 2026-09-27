/**
 * EXTERNAL SYSTEM ADAPTERS (MOCKS FOR PROTOTYPE)
 * These mock implementations satisfy strict TypeScript interfaces for integration points.
 * NEVER make real external API calls in this environment.
 */

// 1. DigiLocker / API Setu
export interface DigiLockerAdapter {
  fetchDocument(aadhaarToken: string, documentType: string): Promise<Buffer>;
}
export class MockDigiLocker implements DigiLockerAdapter {
  /**
   * REAL WORLD INTEGRATION:
   * Target: API Setu (apisetu.gov.in) DigiLocker integration.
   * Flow: OAuth 2.0 authorization code flow -> User consents -> API Setu returns URI -> Fetch document buffer.
   */
  async fetchDocument(aadhaarToken: string, documentType: string): Promise<Buffer> {
    console.log(`[MOCK] Fetching ${documentType} from DigiLocker for token ${aadhaarToken}`);
    return Buffer.from("MOCK_PDF_CONTENT"); // Returns pre-seeded synthetic data in reality
  }
}

// 2. PFMS (Public Financial Management System)
export interface PFMSAdapter {
  generatePaymentBatchXML(applications: any[], batchId: string): string;
}
export class MockPFMS implements PFMSAdapter {
  /**
   * REAL WORLD INTEGRATION:
   * Target: PFMS SFTP server or API.
   * Flow: System generates an XML block (Sanction ID, Beneficiary Account, IFSC, Amount, Scheme Code)
   * conforming to the standard PFMS integration schema, and pushes it to the nodal officer's signing queue.
   */
  generatePaymentBatchXML(applications: any[], batchId: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<PFMSBatch id="${batchId}">\n`;
    applications.forEach(app => {
      xml += `  <Beneficiary>\n    <AppId>${app.id}</AppId>\n    <Account>${app.bankAccount}</Account>\n    <Amount>31000</Amount>\n  </Beneficiary>\n`;
    });
    xml += `</PFMSBatch>`;
    console.log(`[MOCK] Generated PFMS XML batch ${batchId} for ${applications.length} beneficiaries.`);
    return xml;
  }
}

// 3. eSign (C-DAC / NSDL)
export interface ESignAdapter {
  signSanctionLetter(officerId: string, unsignedPdfBuffer: Buffer): Promise<Buffer>;
}
export class MockESign implements ESignAdapter {
  /**
   * REAL WORLD INTEGRATION:
   * Target: ESP (eSign Service Provider) like C-DAC or NSDL.
   * Flow: Officer authenticates via Aadhaar OTP/Biometric -> System sends document hash to ESP -> 
   * ESP returns PKCS#7 signature -> System embeds signature & QR code into PDF.
   */
  async signSanctionLetter(officerId: string, unsignedPdfBuffer: Buffer): Promise<Buffer> {
    console.log(`[MOCK] eSigning document by officer ${officerId}`);
    return Buffer.from("MOCK_SIGNED_PDF_WITH_QR_CODE");
  }
}

// 4. Notifications (SMS / WhatsApp)
export interface NotificationAdapter {
  sendSMS(mobile: string, templateId: string, params: Record<string, string>): Promise<boolean>;
}
export class MockNotification implements NotificationAdapter {
  /**
   * REAL WORLD INTEGRATION:
   * Target: CDAC Mobile Seva / NIC SMS Gateway / WhatsApp Business API.
   * Flow: Post JSON payload with DLT-approved template ID and variables.
   */
  async sendSMS(mobile: string, templateId: string, params: Record<string, string>): Promise<boolean> {
    console.log(`[MOCK] Sending SMS to ${mobile} using template ${templateId}. Params:`, params);
    return true;
  }
}

// 5. Bhashini (Translation)
export interface BhashiniAdapter {
  translateText(text: string, sourceLang: string, targetLang: string): Promise<string>;
}
export class MockBhashini implements BhashiniAdapter {
  /**
   * REAL WORLD INTEGRATION:
   * Target: Bhashini API (bhashini.gov.in).
   * Flow: Send text chunks for Neural Machine Translation (NMT) between Indian languages.
   */
  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    console.log(`[MOCK] Translating via Bhashini: "${text}" from ${sourceLang} to ${targetLang}`);
    return `[Translated to ${targetLang}] ${text}`;
  }
}
