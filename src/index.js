const fs = require('fs')
const { KEY_VALUE_SEPARATOR, END_OF_LINE, log } = require('./common')

function getEnvValue (value) {
  // https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_env
  // Assigning a property on process.env will implicitly convert the value to a string.
  // This behavior is deprecated.
  // Future versions of Node.js may throw an error when the value is not a string, number, or boolean.
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else {
    const number = Number(value)

    if (isNaN(number)) {
      return value
    } else {
      return number
    }
  }
}
function parseEnvFile (name, content = '', debug) {
  const ret = {}

  content.split(END_OF_LINE).forEach((line, index) => {
    let [
      key = '',
      ...value
    ] = line.split(KEY_VALUE_SEPARATOR)

    key = key.trim()
    value = value.join(KEY_VALUE_SEPARATOR).trim()

    if (key.startsWith('#')) {
      return
    }

    if (key && value) {
      ret[key] = getEnvValue(value)
    } else if (key + value) {
      log(debug, `parsing ${name} line:${index + 1}, value:'${line}' is illegal format`)
    }
  })

  return ret
}
function loadEnvFile (name, debug) {
  try {
    const content = fs.readFileSync(name, { // relative to process.cwd()
      encoding: 'utf-8',
    })

    return parseEnvFile(name, content, debug)
  } catch (err) {
    log(debug, err.message)

    return {}
  }
}
function getNodeEnv (mode, debug) {
  const basicEnv = loadEnvFile('.env', debug)
  const modeEnv = mode ? loadEnvFile(`.env.${mode}`, debug) : {}
  const mergedEnv = {
    ...basicEnv,
    ...modeEnv,
  }
  const env = {}

  Object.keys(mergedEnv).forEach(key => {
    if (process.env[key] === undefined) {
      env[key] = mergedEnv[key]
    } else {
      log(debug, `'${key}:${process.env[key]}' is already defined in process.env, new value:'${mergedEnv[key]}' is ignored`)
    }
  })

  if (process.env.NODE_ENV === undefined) {
    env.NODE_ENV = mode
  }

  return env
}
function setNodeEnv (mode, debug) {
  const env = getNodeEnv(mode, debug)

  Object.keys(env).forEach(key => {
    process.env[key] = env[key]
  })
}

module.exports = {
  getNodeEnv,
  setNodeEnv,
}
