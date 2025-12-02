const { Pool } = require("pg");
const ora = require("ora");

// Create a connection pool with configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Pool configuration
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the database connection on startup
pool.connect(async (err, _client, release) => {
  const spinner = ora("Connecting to database...").start();

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (err) {
    spinner.fail("Database connection failed ❌");
    console.error("\nError:", err.message);
    console.error("⚠️  Server will start but database operations will fail\n");
  } else {
    spinner.succeed("Database connected successfully! 💾");
    console.log(`\n📊 Database: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
    release();
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Handle unexpected errors on idle clients
pool.on("error", (err) => {});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await pool.end();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = pool;
