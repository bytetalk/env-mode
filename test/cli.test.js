const { join } = require('path')
const { spawn } = require('child_process')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const { format } = require('../src/common')
const { PORT, clear } = require('./common')

function execCommandNode (mode, callback) {
  const args = [
    join(__dirname, '../bin/cli.js'),
    `--mode=${mode}`,
    'node',
    join(__dirname, 'child-process.js'),
  ]
  const proc = spawn('node', args, {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  })

  proc.on('message', env => {
    callback(env)
  })
  proc.on('error', error => console.error(error))
}
function execCommandNodeThenExpect (mode, done) {
  execCommandNode(mode, env => {
    expect(env.APP_NAME).to.equal('set-node-env')
    expect(env.NODE_ENV).to.equal(mode)
    expect(env.PORT).to.equal(PORT[mode])
    done()
  })
}
function execCommandNpm (mode, callback) {
  const args = [
    join(__dirname, '../bin/cli.js'),
    `--mode=${mode}`,
    'npm',
    '-v',
  ]
  const proc = spawn('node', args)

  proc.stdout.on('data', data => callback(format(data)))

  proc.on('error', error => console.error(error))
}
function execCommandNpmThenExpect (mode, done) {
  execCommandNpm(mode, data => {
    expect(data).to.match(/^\d+\.\d+\.\d+/g)
    done()
  })
}

describe('bin/cli.js', () => {
  describe('npm -v', () => {
    it('node bin/cli.js --mode=development npm -v', done => {
      execCommandNpmThenExpect('development', done)
    })
    it('node bin/cli.js --mode=test npm -v', done => {
      execCommandNpmThenExpect('test', done)
    })
    it('node bin/cli.js --mode=production npm -v', done => {
      execCommandNpmThenExpect('production', done)
    })
  })
  describe('node test/child-process.js', () => {
    beforeEach(() => {
      clear()
    })
    afterEach(() => {
      clear()
    })
    it('node bin/cli.js --mode=development node test/child-process.js', done => {
      execCommandNodeThenExpect('development', done)
    })
    it('node bin/cli.js --mode=test node test/child-process.js', done => {
      execCommandNodeThenExpect('test', done)
    })
    it('node bin/cli.js --mode=production node test/child-process.js', done => {
      execCommandNodeThenExpect('production', done)
    })
  })
})
