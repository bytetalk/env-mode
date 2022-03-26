#!/usr/bin/env node
const { spawn } = require('child_process')
const { CLI_ARG_KEY_PREFIX, log, format } = require('../src/common')
const parse = require('../src/parse-argv')
const { setNodeEnv } = require('../src')

const {
  mode,
  debug,
  rest,
} = parse(CLI_ARG_KEY_PREFIX)

setNodeEnv(mode, debug)

let [command, ...args] = rest

if (command !== 'node' && process.platform === 'win32') {
  command = `${command}.cmd` // npm、npx、node_modules/.bin/*
}

const proc = spawn(command, args, {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'], // https://nodejs.org/api/child_process.html#child_process_options_stdio
})

console.log(`> ${rest.join(' ')}`)

proc.stdout.on('data', data => console.log(format(data)))
proc.stderr.on('data', data => console.error(format(data)))
proc.on('message', env => { // test/cli.test.js
  process.send(env)
  proc.disconnect()
})
proc.on('exit', (code, signal) => {
  if (code) {
    let message = `${rest.join(' ')} exited with code ${code}`

    message += signal ? `and signal ${signal}` : ''

    log(debug, message)
  }
})
proc.on('error', error => console.error(error))
