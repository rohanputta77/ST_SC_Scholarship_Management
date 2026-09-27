import json
import networkx as nx
from collections import defaultdict

def run_fraud_analytics(applicants, scheme_configs):
    """
    Runs deterministic and graph-based fraud analytics on the applicant pool.
    """
    findings = defaultdict(list)
    
    # 1. Deterministic Checks
    bank_map = defaultdict(list)
    family_map = defaultdict(list) # For NOS one-child violation
    institute_approvals = defaultdict(lambda: {"total": 0, "approved": 0})
    
    # 2. Graph Initialization (Applicant <-> Shared Attribute)
    G = nx.Graph()

    for app in applicants:
        app_id = app["applicantId"]
        G.add_node(app_id, type="applicant")
        
        # Track bank accounts
        bank_acct = app.get("bankAccount")
        if bank_acct:
            bank_map[bank_acct].append(app_id)
            G.add_node(f"BANK_{bank_acct}", type="bank")
            G.add_edge(app_id, f"BANK_{bank_acct}")
            
        # Track address (proxy for shared household/fraud ring)
        address = app.get("address")
        if address:
            G.add_node(f"ADDR_{address}", type="address")
            G.add_edge(app_id, f"ADDR_{address}")
            
        # Track family/guardian + DOB for NOS one-child rule
        if app.get("scheme") == "NOS":
            # Synthesizing guardian + dob hash for the demo dataset
            guardian_dob_hash = f"{app.get('guardianName', 'Unknown')}_{app.get('dob', 'Unknown')}"
            family_map[guardian_dob_hash].append(app_id)
            
        # Track institution stats (Mocking approval status)
        inst = app.get("offerInstitute", "Unknown")
        institute_approvals[inst]["total"] += 1
        if app.get("isApproved", False): # Simulated flag
            institute_approvals[inst]["approved"] += 1

    # Deterministic Flagging
    for bank, users in bank_map.items():
        if len(users) > 1:
            for u in users:
                findings[u].append({
                    "type": "SHARED_BANK_ACCOUNT",
                    "severity": "blocking",
                    "message": f"Bank account {bank} is shared by {len(users)} applicants."
                })
                
    for fam_hash, users in family_map.items():
        if len(users) > 1:
            for u in users:
                findings[u].append({
                    "type": "NOS_ONE_CHILD_VIOLATION",
                    "severity": "blocking",
                    "message": "Multiple NOS applicants detected from the same family unit."
                })

    # Institution-level Anomalies (e.g., >95% approval rate on >50 apps)
    inst_anomalies = []
    for inst, stats in institute_approvals.items():
        if stats["total"] > 50:
            rate = stats["approved"] / stats["total"]
            if rate > 0.95:
                inst_anomalies.append(f"{inst} has anomalously high approval rate ({rate*100:.1f}%).")

    # 3. Graph-Based Ring Detection
    # We find connected components in the bipartite graph
    fraud_rings = []
    components = nx.connected_components(G)
    
    RING_SIZE_THRESHOLD = 3 # If more than 3 applicants are connected via shared attributes
    
    for comp in components:
        # Filter to just the applicant nodes in this component
        app_nodes = [n for n in comp if G.nodes[n].get("type") == "applicant"]
        if len(app_nodes) >= RING_SIZE_THRESHOLD:
            # We found a fraud ring
            fraud_rings.append(app_nodes)
            shared_attrs = [n for n in comp if G.nodes[n].get("type") != "applicant"]
            
            for u in app_nodes:
                findings[u].append({
                    "type": "FRAUD_RING_DETECTED",
                    "severity": "blocking",
                    "message": f"Applicant belongs to a suspected fraud ring of {len(app_nodes)} users sharing attributes: {', '.join([str(x) for x in shared_attrs][:3])}..."
                })

    return {
        "applicant_flags": findings,
        "institution_anomalies": inst_anomalies,
        "total_rings_detected": len(fraud_rings)
    }

if __name__ == "__main__":
    # Test execution against the synthetic ground truth
    import os
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "apps", "api", "data", "synthetic")
    with open(os.path.join(DATA_DIR, "applicants.json"), 'r') as f:
        applicants = json.load(f)
        
    res = run_fraud_analytics(applicants, {})
    print(f"Detected {res['total_rings_detected']} fraud rings via Graph Network Analysis.")
    
    # Print sample flags
    flagged_count = len(res["applicant_flags"])
    print(f"{flagged_count} applicants flagged for fraud violations.")
