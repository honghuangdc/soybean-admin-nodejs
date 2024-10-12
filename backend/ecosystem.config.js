module.exports = {
  apps: [
    {
      name: 'soybean-admin-nest-backend',
      script: './dist/apps/base-system/src/main.js',
      autorestart: true,
      instances: -1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      args: '',
      env: {
        NODE_ENV: 'production',
        PORT: '9528',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/app-err.log',
      out_file: 'logs/app-out.log',
      merge_logs: true,
    },
  ],
};
