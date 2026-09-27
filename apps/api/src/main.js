const express = require('express');
const RuleEngine = require('./engine/RuleEngine');
const AllocationService = require('./engine/AllocationService');
const lifecycleMachine = require('./engine/LifecycleMachine');
const AuditLogger = require('./db/AuditLogger');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const app = express();
app.use(express.json());

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://stsc:stsc_password@localhost:5432/stsc_db'
});
dbClient.connect().catch(console.error);

const auditLogger = new AuditLogger(dbClient);

// RBAC Middleware
const requireRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).send('Forbidden: Insufficient privileges.');
  }
  req.userRole = userRole;
  req.userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000000'; // mock fallback
  next();
};

const mockDecisionsDB = new Map();
const loadConfig = (scheme) => JSON.parse(fs.readFileSync(path.join(__dirname, `../../../configs/${scheme.toLowerCase() === 'nfst' ? 'nfst' : 'nos_st'}.json`), 'utf8'));

app.post('/rules/evaluate', requireRole(['applicant', 'scrutiny_officer', 'ministry_admin']), (req, res) => {
  const { application, scheme_version } = req.body;
  if (!application || !scheme_version) return res.status(400).send('Missing data');
  const engine = new RuleEngine(loadConfig(scheme_version));
  res.json({
    eligible: engine.evaluateEligibility(application).eligible,
    score: engine.calculateScore(application),
    document_status: engine.checkDocuments(application).document_status,
    rules_evaluation: engine.evaluateEligibility(application).results
  });
});

app.post('/allocate', requireRole(['selection_committee', 'ministry_admin']), (req, res) => {
  const { candidates, scheme_version } = req.body;
  const result = new AllocationService(loadConfig(scheme_version)).allocate(candidates);
  result.allocations.forEach(c => mockDecisionsDB.set(c.id, { applicant: c, final_bucket: c.allocated_bucket, buckets_matched: c.buckets_matched, final_score: c.score, scheme_version }));
  res.json(result);
});

app.get('/decisions/:id/explain', requireRole(['applicant', 'ministry_admin', 'scrutiny_officer', 'approver']), (req, res) => {
  const decision = mockDecisionsDB.get(req.params.id);
  if (!decision) return res.status(404).send('Decision not found');
  const config = loadConfig(decision.scheme_version);
  res.json({
    applicant_id: decision.applicant.id,
    final_bucket: decision.final_bucket,
    buckets_matched: decision.buckets_matched,
    final_score: decision.final_score,
    rules_trail: new RuleEngine(config).evaluateEligibility(decision.applicant).results,
    score_breakdown: config.scoring.map(comp => {
      let pt = 0;
      if (comp.scaling_method === 'linear') pt = (decision.applicant.net_scaled || 0) * (comp.weight / 100);
      else if (comp.scaling_method === 'percentage') pt = (decision.applicant.master_scaled || 0) * (comp.weight / 100);
      else if (comp.scaling_method === 'boolean_to_max' && decision.applicant.qs_top_1000_offer) pt = 100;
      return { component: comp.component, points_awarded: pt };
    })
  });
});

// Lifecycle Transition Endpoint
app.post('/applications/:id/transition', requireRole(['applicant', 'institute_nodal_officer', 'state_nodal_officer', 'ministry_admin', 'scrutiny_officer']), async (req, res) => {
  const { id } = req.params;
  const { action, payload, rejection_reason } = req.body;
  
  const standardCodes = ['not_bonafide_student', 'invalid_documents', 'already_availed_scholarship_full_duration', 'income_certificate_invalid_period', 'community_name_mismatch', 'other_with_remark'];
  
  try {
    const appQuery = await dbClient.query('SELECT status FROM applications WHERE id = $1', [id]);
    if (appQuery.rows.length === 0) return res.status(404).send('Not found');
    
    const currentStateStr = appQuery.rows[0].status;
    const nextState = lifecycleMachine.transition(currentStateStr, action).value;
    
    if (nextState === currentStateStr) {
      return res.status(400).send(`Invalid action ${action} for state ${currentStateStr}`);
    }

    if (action === 'MARK_DEFECTIVE') {
       if (!standardCodes.includes(rejection_reason)) {
           return res.status(400).send('Invalid rejection reason code');
       }
    }

    await dbClient.query('UPDATE applications SET status = $1, rejection_reason = $2 WHERE id = $3', [nextState, rejection_reason || null, id]);
    
    await auditLogger.logTransition(id, currentStateStr, nextState, action, req.userId, payload);
    
    res.json({ id, previous_state: currentStateStr, new_state: nextState });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// SLA Escalation Cron/Trigger
app.post('/jobs/check-slas', requireRole(['ministry_admin']), async (req, res) => {
  try {
    // Escalate if stuck in verification for > 15 days
    const result = await dbClient.query(`
      UPDATE applications 
      SET is_escalated = TRUE 
      WHERE status IN ('institute_verification', 'ministry_verification') 
      AND is_escalated = FALSE 
      AND (applied_at < NOW() - INTERVAL '15 days')
      RETURNING id, status;
    `);
    res.json({ escalated_count: result.rowCount, escalated_apps: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
