// Container-only checks; no application imports, credentials or external API calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
(async () => {
  assert.equal(process.arch, 'arm64');
  for (const p of ['/pnpm', '/root/.local/share/pnpm/store', '/app/.git', '/app/.env',
    '/app/.npmrc', '/app/apps/frontend/.next/cache', '/app/apps/backend/src',
    '/app/node_modules/jest', '/app/node_modules/ts-jest']) {
    assert(!fs.existsSync(p), `Unexpected build/secret path: ${p}`);
  }
  for (const name of ['g++', 'make', 'python3', 'pnpm']) {
    assert.throws(() => execFileSync('sh', ['-c', `command -v ${name}`], {stdio: 'pipe'}));
  }
  for (const name of ['backend', 'workers', 'cron']) {
    assert(fs.existsSync(`/app/apps/${name}/dist/apps/${name}/src/main.js`));
  }
  assert(fs.existsSync('/app/apps/frontend/.next/BUILD_ID'));
  const bcrypt = require('bcrypt');
  assert(await bcrypt.compare('isolated-smoke', await bcrypt.hash('isolated-smoke', 4)));
  const sharp = require('sharp');
  const png = await sharp({create:{width:8,height:8,channels:3,background:'#ff8800'}}).png().toBuffer();
  assert.equal((await sharp(png).metadata()).width, 8);
  const {PrismaClient} = require('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  require('@sentry/profiling-node');
  execFileSync('prisma', ['--version'], {stdio:'pipe'});
  console.log('PASS: ARM64, runtime contents, Prisma CLI/client, bcrypt, sharp PNG and Sentry native module');
})().catch(e => { console.error(e); process.exit(1); });
