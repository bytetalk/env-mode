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
let proc = null

// https://nodejs.org/dist/latest-v17.x/docs/api/child_process.html#optionsstdio
if (command === 'node') {
  proc = spawn(command, args, {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  })

  proc.on('message', env => { // test/cli.test.js by node way
    process.send(env)
  })
} else {
  if (process.platform === 'win32') {
    args.unshift('/c', command)
    command = 'cmd.exe'
  }

  proc = spawn(command, args)
}

log(debug, `> ${command} ${args.join(' ')}`)

proc.stdout.on('data', data => console.log(format(data)))
proc.stderr.on('data', data => console.error(format(data)))

proc.on('exit', (code, signal) => {
  if (code) {
    let message = `${rest.join(' ')} exited with code ${code}`

    message += signal ? `and signal ${signal}` : ''

    log(debug, message)
  }
})
proc.on('error', error => console.error(error))
