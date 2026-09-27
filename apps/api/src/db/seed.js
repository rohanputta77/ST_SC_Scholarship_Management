const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://stsc:stsc_password@localhost:5432/stsc_db'
  });

  try {
    await client.connect();
    console.log("Connected to the database. Running migrations...");

    const sqlPath = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);

    console.log("Migration successful. Starting seed...");

    // Create a mock user
    const userRes = await client.query(`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@tribal.gov.in', 'hashed_pass', 'admin') 
      RETURNING id;
    `);
    const userId = userRes.rows[0].id;

    // Seed configurations
    const nfstConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../configs/nfst.json'), 'utf8'));
    const nosConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../configs/nos_st.json'), 'utf8'));

    await client.query(`
      INSERT INTO scheme_versions (scheme_name, academic_year, is_active, configuration) 
      VALUES ('NFST', '2025-26', true, $1), ('NOS', '2025-26', true, $2);
    `, [nfstConfig, nosConfig]);

    console.log("Seed complete.");
  } catch (err) {
    console.error("Error during migration/seed:", err);
  } finally {
    await client.end();
  }
}

seed();
