const { join } = require('path')
const { spawn } = require('child_process')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const { PORT, clear } = require('./common')

function getArgs (mode) {
  return [
    join(__dirname, '../bin/cli.js'),
    `--mode=${mode}`,
    'node',
    join(__dirname, 'child-process.js'),
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

describe('bin/cli.js', () => {
  beforeEach(() => {
    clear()
  })
  afterEach(() => {
    clear()
  })
  it('node bin/cli.js --mode=development node test/child-process.js', done => {
    spawnNodeThenExpect('development', done)
  })
  it('node bin/cli.js --mode=test node test/child-process.js', done => {
    spawnNodeThenExpect('test', done)
  })
  it('node bin/cli.js --mode=production node test/child-process.js', done => {
    spawnNodeThenExpect('production', done)
  })
})
