const { PRELOAD_ARG_KEY_PREFIX } = require('./src/common')
const parse = require('./src/parse-argv')
const setNodeEnv = require('./src')

const {
  mode,
  debug,
} = parse(PRELOAD_ARG_KEY_PREFIX)

setNodeEnv(mode, debug)
