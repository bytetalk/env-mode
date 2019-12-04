const setNodeEnv = require('./src')
const parse = require('./src/parse-argv')
const ARG_KEY_PREFIX = '--env-'

const {
  mode,
  debug,
} = parse(ARG_KEY_PREFIX)

setNodeEnv(mode, debug)
