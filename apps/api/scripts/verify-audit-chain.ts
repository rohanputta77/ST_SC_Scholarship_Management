import { Client } from 'pg';
import crypto from 'crypto';

async function verifyChain() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://stsc:stsc_password@localhost:5432/stsc_db'
  });
  await client.connect();

  try {
    const res = await client.query('SELECT * FROM audit_log ORDER BY timestamp ASC, id ASC');
    const logs = res.rows;

    let previousHash = 'GENESIS';
    let broken = false;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.previous_hash !== previousHash) {
        console.error(`Broken link detected at log ID ${log.id}: Expected previous hash ${previousHash}, got ${log.previous_hash}`);
        broken = true;
        break;
      }

      const entryPayload = JSON.stringify({
        applicationId: log.entity_id,
        fromState: log.changes.fromState,
        toState: log.changes.toState,
        action: log.action,
        payload: log.changes.payload,
        performedBy: log.performed_by
      });

      const currentHash = crypto.createHash('sha256').update(log.previous_hash + entryPayload).digest('hex');

      if (log.current_hash !== currentHash) {
        console.error(`Hash mismatch detected at log ID ${log.id}: Expected ${currentHash}, got ${log.current_hash}`);
        broken = true;
        break;
      }

      previousHash = currentHash;
    }

    if (!broken) {
      console.log(`Successfully verified ${logs.length} audit log entries. No broken links.`);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Error verifying audit chain:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyChain();
