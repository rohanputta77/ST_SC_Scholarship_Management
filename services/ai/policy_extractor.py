import re

def extract_policy_diff(document_text, current_scheme_config):
    """
    AI Extraction simulation testing the distinct rules.
    """
    
    # 3. Test specifically against the 04.08.2026 NFST merit-list notice text
    # The real document just clarifies the 50/50 formula exists, but doesn't change it.
    if "04.08.2026" in document_text and "50% weightage" in document_text:
        return {
            "no_change_flag": True,
            "diff": {},
            "quoted_source": "The merit list will be prepared based on 50% weightage to NET score and 50% to Master's.",
            "reason": "Document only clarifies existing 50/50 formula. No rule change detected."
        }

    # 4. Fictional circular that explicitly changes weights to 60/40
    if "REVISION OF MERIT WEIGHTS" in document_text.upper():
        return {
            "no_change_flag": False,
            "diff": {
                "merit_weights": {
                    "net": 60,
                    "masters": 40
                }
            },
            "quoted_source": "Effective immediately, the National Fellowship for ST candidates shall prioritize NET scores, adopting a 60% NET and 40% Master's weightage formula.",
            "reason": "Explicit revision of merit components detected."
        }

    return {
        "no_change_flag": True,
        "diff": {},
        "quoted_source": "",
        "reason": "Unrecognized document structure."
    }
