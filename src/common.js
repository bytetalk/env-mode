const { EOL } = require('os')

const KEY_VALUE_SEPARATOR = '='
const END_OF_LINE = /\n|\r|\r\n/
const CLI_ARG_KEY_PREFIX = '--'
const PRELOAD_ARG_KEY_PREFIX = '--env-'

function log (debug, message) {
  if (debug) {
    console.log(`[set-node-env][debug] ${message}`)
  }
}
function format (buffer) {
  const data = buffer.toString()
  const reg = new RegExp(`${EOL}$`)

  return data.replace(reg, '')
}

module.exports = {
  KEY_VALUE_SEPARATOR,
  END_OF_LINE,
  CLI_ARG_KEY_PREFIX,
  PRELOAD_ARG_KEY_PREFIX,
  log,
  format,
}
