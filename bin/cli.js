#!/usr/bin/env node
const { EOL } = require('os')
const { spawn } = require('child_process')
const setNodeEnv = require('../src')
const parse = require('../src/parse-argv')
const ARG_KEY_PREFIX = '--'
function format (buffer) {
  const data = buffer.toString()
  const reg = new RegExp(`${EOL}$`)
  return data.replace(reg, '')
}
const {
  mode,
  debug,
  rest,
} = parse(ARG_KEY_PREFIX)
setNodeEnv(mode, debug)
let [command, ...args] = rest
if (command !== 'node' && process.platform === 'win32') {
  command = `${command}.cmd` // npm、npx、node_modules/.bin/*
}
const proc = spawn(command, args)
console.log(`> ${rest.join(' ')}`)
proc.stdout.on('data', data => console.log(format(data)))
proc.stderr.on('data', data => console.error(format(data)))
proc.on('exit', (code, signal) => {
  if (debug) {
    let message = `[set-node-env][debug] ${rest.join(' ')} exited with code ${code}`
    message += signal ? `and signal ${signal}` : ''

    console.log(message)
  }
})
proc.on('error', error => console.error(error))
