module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-frontend-err.log',
      out_file: './logs/pm2-frontend-out.log',
      merge_logs: true,
      time: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
