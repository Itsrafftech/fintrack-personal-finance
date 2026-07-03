const { Pool, types } = require('pg');

// Return DATE columns as plain 'YYYY-MM-DD' strings instead of JS Date objects,
// which avoids timezone-shift bugs when the value is later JSON-serialized.
types.setTypeParser(types.builtins.DATE, (val) => val);

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || 'fintrack',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
    });

module.exports = pool;
