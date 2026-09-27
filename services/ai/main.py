import os
import json
import fitz  # PyMuPDF
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from rapidfuzz import fuzz

app = FastAPI()

class DocumentPath(BaseModel):
    filepath: str
    doc_type: Optional[str] = None

class ApplicationPacket(BaseModel):
    applicantId: str
    fullName: str
    scheme: str
    documents: List[DocumentPath]

PVTG_LIST = ["Saharia", "Baiga", "Bonda", "Toda", "Sentinelese", "Jarawa", "Lodha", "Abujh Macia"]

def extract_text_pymupdf(filepath: str) -> dict:
    text = ""
    try:
        doc = fitz.open(filepath)
        for page in doc:
            text += page.get_text()
        doc.close()
        
        # Simulate OCR confidence degradation if blurred
        confidence = 0.95
        if "ERROR: BLURRED SCAN" in text or "UNREADABLE TEXT" in text:
            confidence = 0.30
        
        return {"text": text, "confidence": confidence}
    except Exception as e:
        return {"text": "", "confidence": 0.0}

def check_name_consistency(expected_name, extracted_text):
    # Fuzzy match the expected name within the text
    # Simplified approach: see if a substring has high fuzzy ratio
    score = fuzz.partial_ratio(expected_name.lower(), extracted_text.lower())
    return score

def run_cross_checks(packet: ApplicationPacket, extracted_docs: dict):
    findings = []
    
    # 1. Name Consistency across all docs
    for doc_type, data in extracted_docs.items():
        if data["confidence"] < 0.5:
            findings.append({
                "field": doc_type,
                "issue": "low_confidence_ocr",
                "severity": "blocking",
                "message_en": f"Document {doc_type} is unreadable (blurred or low quality scan).",
                "message_hi": f"दस्तावेज़ {doc_type} अपठनीय है।"
            })
            continue

        name_score = check_name_consistency(packet.fullName, data["text"])
        if name_score < 80:  # Transliteration tolerance boundary
            findings.append({
                "field": "fullName",
                "issue": "name_mismatch",
                "severity": "blocking",
                "message_en": f"Name mismatch in {doc_type}. Expected {packet.fullName}, fuzzy score {name_score}.",
                "message_hi": f"{doc_type} में नाम मेल नहीं खाता।"
            })

        # 2. Income certificate check
        if "Income_Certificate" in doc_type:
            if "monthly" in data["text"].lower():
                findings.append({
                    "field": "incomePeriod",
                    "issue": "monthly_income_certificate",
                    "severity": "blocking",
                    "message_en": "Monthly income certificate submitted instead of Annual.",
                    "message_hi": "वार्षिक के बजाय मासिक आय प्रमाण पत्र प्रस्तुत किया गया।"
                })

        # 3. PVTG spelling check in ST cert
        if "ST_Certificate" in doc_type:
            if "EXPIRED" in data["text"]:
                findings.append({
                    "field": "certificateStatus",
                    "issue": "expired_certificate",
                    "severity": "blocking",
                    "message_en": "The ST/PVTG certificate has expired.",
                    "message_hi": "प्रमाणपत्र समाप्त हो गया है।"
                })
            
            # Extract community line: "Community: [Name]"
            lines = data["text"].split("\n")
            community_extracted = None
            for line in lines:
                if line.startswith("Community:"):
                    community_extracted = line.replace("Community:", "").strip()
                    break
            
            if community_extracted:
                # Fuzzy match against PVTG list
                best_score = 0
                for pvtg in PVTG_LIST:
                    score = fuzz.ratio(community_extracted.lower(), pvtg.lower())
                    if score > best_score:
                        best_score = score
                
                # If it's Gond or ST, it might score low, which is fine unless they claimed PVTG. 
                # Let's flag near-misses (e.g. 70-95 score)
                if 60 < best_score < 100:
                    findings.append({
                        "field": "communityName",
                        "issue": "community_name_mismatch",
                        "severity": "warning",
                        "message_en": f"Community name '{community_extracted}' is a near-miss for a PVTG list entry (score: {best_score}).",
                        "message_hi": "समुदाय का नाम पीवीटीजी सूची से मेल नहीं खाता (स्पेलिंग)।"
                    })

        # 4. Disability Check
        if "Disability_Certificate" in doc_type:
            # Extract percentage
            lines = data["text"].split("\n")
            for line in lines:
                if "Disability Percentage:" in line:
                    try:
                        pct = int(line.replace("Disability Percentage:", "").replace("%", "").strip())
                        if pct < 40:
                            findings.append({
                                "field": "disabilityPercent",
                                "issue": "disability_below_40",
                                "severity": "blocking",
                                "message_en": f"Disability percentage is {pct}%, which is below the 40% threshold.",
                                "message_hi": f"विकलांगता प्रतिशत 40% से कम है ({pct}%)।"
                            })
                    except:
                        pass
    
    return findings

@app.post("/verify")
def verify_application(packet: ApplicationPacket):
    extracted_docs = {}
    
    for doc in packet.documents:
        # 1. Rule-based Document Classifier
        doc_type = doc.doc_type
        if not doc_type:
            filename = os.path.basename(doc.filepath).lower()
            if "st" in filename or "pvtg" in filename: doc_type = "ST_Certificate"
            elif "income" in filename: doc_type = "Income_Certificate"
            elif "bank" in filename: doc_type = "Bank_Passbook"
            elif "disability" in filename: doc_type = "Disability_Certificate"
            elif "scorecard" in filename: doc_type = "NET_Scorecard"
            elif "scan" in filename: doc_type = "Blurred_Scan"
            else: doc_type = "Other"
            
        # 2. OCR Extraction
        ocr_result = extract_text_pymupdf(doc.filepath)
        extracted_docs[doc_type] = ocr_result
        
    # 3. Deterministic Cross-checks
    findings = run_cross_checks(packet, extracted_docs)
    
    # 4. Final Eligibility for Fast Document Clearance
    # Clean cases = marked eligible for FAST document-completeness ONLY
    # Blocking cases = routed to human exception queue
    
    blocking_count = sum(1 for f in findings if f["severity"] == "blocking")
    
    return {
        "applicantId": packet.applicantId,
        "findings": findings,
        "fast_clearance_eligible": blocking_count == 0,
        "routing": "human_exception_queue" if blocking_count > 0 else "rules_engine_pending"
    }
