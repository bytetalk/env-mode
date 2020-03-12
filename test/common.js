const PORT = {
  development: '7777',
  test: '8888',
  production: '9999',
}

function clear () {
  delete process.env.APP_NAME
  delete process.env.NODE_ENV
  delete process.env.PORT
}

module.exports = {
  PORT,
  clear,
}
