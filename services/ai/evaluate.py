import json
import os
import requests
from copy import deepcopy

# Load Ground Truth
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "apps", "api", "data", "synthetic")
GROUND_TRUTH_PATH = os.path.join(DATA_DIR, "ground_truth.json")
APPLICANTS_PATH = os.path.join(DATA_DIR, "applicants.json")
DOCS_DIR = os.path.join(DATA_DIR, "documents")

with open(GROUND_TRUTH_PATH, 'r') as f:
    ground_truth = json.load(f)

with open(APPLICANTS_PATH, 'r') as f:
    applicants = json.load(f)

# Metrics structure
metrics = {
    "NAME_MISMATCH": {"tp": 0, "fp": 0, "fn": 0, "tn": 0},
    "COMMUNITY_MISSPELLED": {"tp": 0, "fp": 0, "fn": 0, "tn": 0},
    "MONTHLY_INCOME": {"tp": 0, "fp": 0, "fn": 0, "tn": 0},
    "EXPIRED_CERT": {"tp": 0, "fp": 0, "fn": 0, "tn": 0},
    "BLURRED_SCAN": {"tp": 0, "fp": 0, "fn": 0, "tn": 0},
    "DISABILITY_BELOW_40": {"tp": 0, "fp": 0, "fn": 0, "tn": 0}
}

stp_stats = {
    "total_clean": 0,
    "fast_cleared": 0,
    "false_positives": 0
}

import main

print("Evaluating 5,300 applicants... (Simulating internal API calls)")

# Limit evaluation to those that have actual rendered docs in our subset
count = 0
for app in applicants:
    app_id = app["applicantId"]
    doc_folder = os.path.join(DOCS_DIR, app_id)
    if not os.path.exists(doc_folder):
        continue  # We only rendered a subset of PDFs

    count += 1
    
    docs = []
    for f in os.listdir(doc_folder):
        docs.append(main.DocumentPath(filepath=os.path.join(doc_folder, f)))

    packet = main.ApplicationPacket(
        applicantId=app_id,
        fullName=app["fullName"],
        scheme=app["scheme"],
        documents=docs
    )
    
    # Run API verify function directly for speed
    response = main.verify_application(packet)
    
    gt = ground_truth[app_id]
    true_defects = gt["defects"]
    
    findings = response["findings"]
    predicted_issues = [f["issue"] for f in findings]
    
    # Clean applicant STP rate
    if len(true_defects) == 0:
        stp_stats["total_clean"] += 1
        if response["fast_clearance_eligible"]:
            stp_stats["fast_cleared"] += 1
        else:
            stp_stats["false_positives"] += 1

    # NAME_MISMATCH
    has_true = "NAME_MISMATCH" in true_defects
    has_pred = "name_mismatch" in predicted_issues
    if has_true and has_pred: metrics["NAME_MISMATCH"]["tp"] += 1
    elif has_true and not has_pred: metrics["NAME_MISMATCH"]["fn"] += 1
    elif not has_true and has_pred: metrics["NAME_MISMATCH"]["fp"] += 1
    else: metrics["NAME_MISMATCH"]["tn"] += 1

    # COMMUNITY_MISSPELLED
    has_true = "COMMUNITY_MISSPELLED" in true_defects
    has_pred = "community_name_mismatch" in predicted_issues
    if has_true and has_pred: metrics["COMMUNITY_MISSPELLED"]["tp"] += 1
    elif has_true and not has_pred: metrics["COMMUNITY_MISSPELLED"]["fn"] += 1
    elif not has_true and has_pred: metrics["COMMUNITY_MISSPELLED"]["fp"] += 1
    else: metrics["COMMUNITY_MISSPELLED"]["tn"] += 1

    # MONTHLY_INCOME
    has_true = "MONTHLY_INCOME" in true_defects
    has_pred = "monthly_income_certificate" in predicted_issues
    if has_true and has_pred: metrics["MONTHLY_INCOME"]["tp"] += 1
    elif has_true and not has_pred: metrics["MONTHLY_INCOME"]["fn"] += 1
    elif not has_true and has_pred: metrics["MONTHLY_INCOME"]["fp"] += 1
    else: metrics["MONTHLY_INCOME"]["tn"] += 1

    # EXPIRED_CERT
    has_true = "EXPIRED_CERT" in true_defects
    has_pred = "expired_certificate" in predicted_issues
    if has_true and has_pred: metrics["EXPIRED_CERT"]["tp"] += 1
    elif has_true and not has_pred: metrics["EXPIRED_CERT"]["fn"] += 1
    elif not has_true and has_pred: metrics["EXPIRED_CERT"]["fp"] += 1
    else: metrics["EXPIRED_CERT"]["tn"] += 1

    # BLURRED_SCAN
    has_true = "BLURRED_SCAN" in true_defects
    has_pred = "low_confidence_ocr" in predicted_issues
    if has_true and has_pred: metrics["BLURRED_SCAN"]["tp"] += 1
    elif has_true and not has_pred: metrics["BLURRED_SCAN"]["fn"] += 1
    elif not has_true and has_pred: metrics["BLURRED_SCAN"]["fp"] += 1
    else: metrics["BLURRED_SCAN"]["tn"] += 1

    # DISABILITY_BELOW_40
    has_true = "DISABILITY_BELOW_40" in true_defects
    has_pred = "disability_below_40" in predicted_issues
    if has_true and has_pred: metrics["DISABILITY_BELOW_40"]["tp"] += 1
    elif has_true and not has_pred: metrics["DISABILITY_BELOW_40"]["fn"] += 1
    elif not has_true and has_pred: metrics["DISABILITY_BELOW_40"]["fp"] += 1
    else: metrics["DISABILITY_BELOW_40"]["tn"] += 1


# Calculate Precision and Recall
markdown = "# AI OCR Evaluation Report\n\n"
markdown += f"**Evaluated sample size**: {count} synthetic applicants (with rendered PDFs).\n"
markdown += f"**Straight-Through Processing (STP) Rate for clean applicants**: "
if stp_stats["total_clean"] > 0:
    stp_rate = (stp_stats["fast_cleared"] / stp_stats["total_clean"]) * 100
    markdown += f"{stp_rate:.2f}% ({stp_stats['fast_cleared']}/{stp_stats['total_clean']})\n\n"
else:
    markdown += "N/A (No clean applicants in subset)\n\n"

markdown += "## Precision and Recall by Defect Type\n\n"
markdown += "| Defect Type | Precision | Recall | True Positives | False Positives | False Negatives |\n"
markdown += "|-------------|-----------|--------|----------------|-----------------|-----------------|\n"

for defect, m in metrics.items():
    precision = (m["tp"] / (m["tp"] + m["fp"])) * 100 if (m["tp"] + m["fp"]) > 0 else 100.0
    recall = (m["tp"] / (m["tp"] + m["fn"])) * 100 if (m["tp"] + m["fn"]) > 0 else 100.0
    markdown += f"| {defect} | {precision:.2f}% | {recall:.2f}% | {m['tp']} | {m['fp']} | {m['fn']} |\n"

out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "docs", "ai_eval.md")
with open(out_path, 'w') as f:
    f.write(markdown)

print(f"Evaluation complete. Report saved to {out_path}")
