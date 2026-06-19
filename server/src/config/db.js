const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

// Enable SSL for remote hosts (Supabase, Render, etc.)
const requiresSSL =
  connectionString?.includes("supabase.com") ||
  connectionString?.includes("supabase.co") ||
  connectionString?.includes("render.com");

const pool = new Pool({
  connectionString,
  ...(requiresSSL && { ssl: { rejectUnauthorized: false } }),
});

// Test connection on startup
pool.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => console.error("❌ PostgreSQL connection failed:", err.message));

module.exports = pool;
