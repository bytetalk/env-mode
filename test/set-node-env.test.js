const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const { PORT, clear } = require('./common')
const { setNodeEnv } = require('../src')

function setNodeEnvThenExpect (mode) {
  setNodeEnv(mode)
  expect(process.env.APP_NAME).to.equal('set-node-env')
  expect(process.env.NODE_ENV).to.equal(mode)
  expect(process.env.PORT).to.equal(PORT[mode])
}

describe('src/set-node-env.js', () => {
  beforeEach(() => {
    clear()
  })
  afterEach(() => {
    clear()
  })
  it('setNodeEnv("development")', () => {
    setNodeEnvThenExpect('development')
  })
  it('setNodeEnv("test")', () => {
    setNodeEnvThenExpect('test')
  })
  it('setNodeEnv("production")', () => {
    setNodeEnvThenExpect('production')
  })
  it('setNodeEnv("development") && setNodeEnv("production"), the last one should be ignored', () => {
    setNodeEnv('development')
    setNodeEnv('production')
    expect(process.env.NODE_ENV).to.equal('development')
    expect(process.env.PORT).to.equal('7777')
  })
})
