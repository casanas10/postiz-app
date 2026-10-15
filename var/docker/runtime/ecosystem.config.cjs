const common = {
  interpreter: 'node',
  out_file: '/dev/stdout',
  error_file: '/dev/stderr',
  merge_logs: true,
  min_uptime: 10000,
  max_restarts: 10,
  kill_timeout: 10000,
};
module.exports = {
  apps: [
    ...['backend', 'workers', 'cron'].map((name) => ({
      ...common,
      name,
      cwd: `/app/apps/${name}`,
      script: `./dist/apps/${name}/src/main.js`,
      node_args: '--experimental-require-module',
    })),
    {
      ...common,
      name: 'frontend',
      cwd: '/app/apps/frontend',
      script: '/app/node_modules/next/dist/bin/next',
      args: 'start -p 4200',
    },
  ],
};
