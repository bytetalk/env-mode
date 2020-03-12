const { join } = require('path')
const { spawn } = require('child_process')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const { PORT, clear } = require('./common')

function getArgs (mode) {
  return [
    '-r',
    join(__dirname, '../preload.js'),
    join(__dirname, 'child-process.js'),
    `--env-mode=${mode}`,
  ]
}
function spawnNode (mode, callback) {
  const proc = spawn('node', getArgs(mode), {
    stdio: [null, null, null, 'ipc'],
  })

  proc.on('message', env => {
    callback(env)
    proc.disconnect()
  })
  proc.on('error', error => console.error(error))
}
function spawnNodeThenExpect (mode, done) {
  spawnNode(mode, env => {
    expect(env.APP_NAME).to.equal('set-node-env')
    expect(env.NODE_ENV).to.equal(mode)
    expect(env.PORT).to.equal(PORT[mode])
    done()
  })
}

describe('preload.js', () => {
  beforeEach(() => {
    clear()
  })
  afterEach(() => {
    clear()
  })
  it('node -r preload.js test/child-process.js --env-mode=development', done => {
    spawnNodeThenExpect('development', done)
  })
  it('node -r preload.js test/child-process.js --env-mode=test', done => {
    spawnNodeThenExpect('test', done)
  })
  it('node -r preload.js test/child-process.js --env-mode=production', done => {
    spawnNodeThenExpect('production', done)
  })
})
