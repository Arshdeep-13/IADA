module.exports = {
  apps: [
    {
      name: "server",
      script: "server.js",
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      out_file: "/app/backend/logs/server-out.log",  // Standard output
      error_file: "/app/backend/logs/server-error.log", // Error output
      combine_logs: true,
    },
  ],
};
