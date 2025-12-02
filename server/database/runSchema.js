const fs = require("fs");
const path = require("path");
const ora = require("ora");
const readline = require("readline");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Pool } = require("pg");

// Create a new pool with environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runSQLFiles() {
  const spinner = ora({
    text: "Setting up database schema...",
    color: "cyan",
  }).start();

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    spinner.succeed("Database schema has been set up successfully! ✨");

    // Show success message for 1.5 seconds before closing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await pool.end();
  } catch (err) {
    spinner.fail("Failed to set up database schema ❌");
    console.error("\nError details:", err.message);
    await pool.end();
    process.exit(1);
  }
}

runSQLFiles();
