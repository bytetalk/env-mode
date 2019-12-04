#!/usr/bin/env node
const setNodeEnv = require('../src')
const parse = require('../src/parse-argv')
const ARG_KEY_PREFIX = '--'

const {
  mode,
  debug,
  rest,
} = parse(ARG_KEY_PREFIX)

setNodeEnv(mode, debug)
console.log(rest) // todo spawn rest
