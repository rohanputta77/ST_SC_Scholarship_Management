import os
import json
from datetime import datetime

class PolicyChangeService:
    def __init__(self, db, ai_service, audit_logger, rule_engine):
        self.db = db
        self.ai = ai_service
        self.audit = audit_logger
        self.engine = rule_engine

    def initiate_proposal(self, document_path, uploaded_by_id):
        # 1. Audit log upload
        self.audit.log(
            action="POLICY_DOCUMENT_UPLOADED",
            actor=uploaded_by_id,
            payload={"document": document_path}
        )

        current_scheme = self.db.get_latest_scheme_version("NFST")

        # 2. AI extracts rule change diff
        ai_result = self.ai.extract_policy_diff(document_path, current_scheme)

        proposal_id = self.db.create_policy_proposal({
            "document_path": document_path,
            "status": "PENDING_PREVIEW",
            "extracted_diff": ai_result["diff"],
            "quoted_source": ai_result["quoted_source"],
            "no_change_flag": ai_result["no_change_flag"]
        })

        self.audit.log(
            action="POLICY_AI_DIFF_GENERATED",
            actor="system",
            payload={"proposal_id": proposal_id, "diff": ai_result["diff"]}
        )

        return proposal_id, ai_result

    def generate_impact_preview(self, proposal_id, synthetic_dataset):
        proposal = self.db.get_proposal(proposal_id)
        if proposal["no_change_flag"]:
            return {"status": "No change detected, preview skipped."}
        
        current_scheme = self.db.get_latest_scheme_version("NFST")
        proposed_scheme = self._apply_diff_to_config(current_scheme, proposal["extracted_diff"])
        
        # Simulate allocation delta
        delta = self.engine.calculate_allocation_delta(current_scheme, proposed_scheme, synthetic_dataset)
        
        self.db.update_proposal(proposal_id, {"impact_preview": delta, "status": "PENDING_APPROVAL"})
        
        self.audit.log(
            action="POLICY_IMPACT_PREVIEW_GENERATED",
            actor="system",
            payload={"proposal_id": proposal_id, "delta_summary": f"{len(delta['entered'])} entered, {len(delta['exited'])} exited"}
        )
        return delta

    def approve_proposal(self, proposal_id, approver_role, approver_id, effective_from):
        # 5. Must be strictly gated by 'approver' role at the code level
        if approver_role != 'approver':
            raise Exception("UNAUTHORIZED: Only the 'approver' role can approve policy changes.")
        
        proposal = self.db.get_proposal(proposal_id)
        if proposal["status"] != "PENDING_APPROVAL":
            raise Exception("INVALID_STATE: Proposal must have impact preview generated before approval.")

        current_scheme = self.db.get_latest_scheme_version("NFST")
        proposed_scheme = self._apply_diff_to_config(current_scheme, proposal["extracted_diff"])
        
        # 7. Code strictly enforces manual approval (this block requires explicit trigger by 'approver')
        # Create NEW version, NEVER overwrite history
        new_version_id = self.db.create_scheme_version(
            scheme_id="NFST",
            config=proposed_scheme,
            effective_from=effective_from,
            approved_by=approver_id
        )

        self.db.update_proposal(proposal_id, {"status": "APPROVED", "new_version_id": new_version_id})

        self.audit.log(
            action="POLICY_PROPOSAL_APPROVED",
            actor=approver_id,
            payload={"proposal_id": proposal_id, "new_version_id": new_version_id}
        )
        return new_version_id

    def _apply_diff_to_config(self, base_config, diff):
        # Merges JSON diff into the base config dictionary
        new_config = json.loads(json.dumps(base_config)) # deep copy
        for key, val in diff.items():
            new_config[key] = val
        return new_config

# Mock dependencies to illustrate architectural constraint enforcement
class MockDB:
    def get_latest_scheme_version(self, scheme_id):
        return {"merit_weights": {"net": 50, "masters": 50}}
    def create_policy_proposal(self, data): return "PROPOSAL_123"
    def get_proposal(self, p_id): return {"status": "PENDING_APPROVAL", "extracted_diff": {"merit_weights": {"net": 60, "masters": 40}}, "no_change_flag": False}
    def update_proposal(self, p_id, data): pass
    def create_scheme_version(self, scheme_id, config, effective_from, approved_by): return "NFST_V2"

class MockAudit:
    def log(self, action, actor, payload):
        print(f"[AUDIT CHAIN] {action} | By: {actor} | Payload: {payload}")
