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
const [command, ...args] = rest
const proc = spawn(command, args)
proc.stdout.on('data', data => console.log(format(data)))
proc.stderr.on('data', data => console.error(format(data)))
proc.on('exit', (code, signal) => {
  let message = `[set-node-env] ${rest.join(' ')} exited with code ${code}`
  message += signal ? `and signal ${signal}` : ''
  console.log(message)
})
proc.on('error', error => console.error(error))
