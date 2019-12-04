const setNodeEnv = require('../src')
const logEnv = require('./log-env')

function deleteEnv () {
  delete process.env.NODE_ENV
  delete process.env.APP_NAME
  delete process.env.PORT
}
setNodeEnv('development', true)
logEnv()
setNodeEnv('test', true)
logEnv()
deleteEnv()
setNodeEnv('production', true)
logEnv()
