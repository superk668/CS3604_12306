const { spawnSync } = require('child_process')
const path = require('path')

const env = {
  ...process.env,
  NODE_ENV: 'test',
  DB_DIALECT: 'mysql',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || 'root',
  DB_NAME: process.env.DB_NAME || 'trae_12306'
}

const jestBin = path.join(__dirname, '../../node_modules/jest/bin/jest.js')
const result = spawnSync(process.execPath, [jestBin, '--runInBand'], {
  stdio: 'inherit',
  env
})

process.exit(result.status ?? 1)