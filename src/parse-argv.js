const KEY_VALUE_SEPARATOR = '='

function pick (argKeyPrefix = '--') {
  const [, , ...rawArgs] = process.argv
  const env = {}
  const rest = []
  rawArgs.forEach(arg => {
    let [
      key = '',
      value = '',
    ] = arg.split(KEY_VALUE_SEPARATOR, 2)
    if (key.indexOf(argKeyPrefix) === 0) {
      key = key.substring(argKeyPrefix.length)
      if (key) {
        env[key] = value || ''
      }
    } else {
      rest.push(arg)
    }
  })
  return {
    env,
    rest,
  }
}
function parse (argKeyPrefix) {
  let {
    env: {
      mode,
      debug,
    },
    rest,
  } = pick(argKeyPrefix)
  if (debug) {
    if (debug === 'false') {
      debug = false
    } else {
      debug = true
    }
  } else {
    if (debug === '') {
      debug = true
    } else {
      debug = false
    }
  }
  return {
    mode,
    debug,
    rest,
  }
}

module.exports = parse
