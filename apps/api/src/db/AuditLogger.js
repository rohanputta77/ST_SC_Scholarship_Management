const crypto = require('crypto');

class AuditLogger {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async logTransition(applicationId, fromState, toState, action, performedBy, payload) {
    // get previous hash
    const prev = await this.db.query('SELECT current_hash FROM audit_log ORDER BY timestamp DESC, id DESC LIMIT 1');
    const prevHash = prev.rows.length > 0 ? prev.rows[0].current_hash : 'GENESIS';
    
    const entryPayload = JSON.stringify({
      applicationId,
      fromState,
      toState,
      action,
      payload,
      performedBy
    });
    
    const currentHash = crypto.createHash('sha256').update(prevHash + entryPayload).digest('hex');
    
    await this.db.query(
      'INSERT INTO audit_log (entity_table, entity_id, action, changes, performed_by, previous_hash, current_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['applications', applicationId, action, entryPayload, performedBy, prevHash, currentHash]
    );
  }
}

module.exports = AuditLogger;
