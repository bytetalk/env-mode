# set-node-env

Set node env from a .env and a .env.mode files.

[![Build Status](https://app.travis-ci.com/bytetalk/set-node-env.svg?branch=master)](https://app.travis-ci.com/github/bytetalk/set-node-env)

## Installation

```shell
npm install --save-dev set-node-env
// or
yarn add --dev set-node-env
```

## Usage Demo

##### 1. Create corresponding files under your project root directory as below

.env file

```
APP_NAME=set-node-env-demo
```

.env.development file

```
PORT=7777
```

.env.test file

```
PORT=8888
```

.env.production file

```
PORT=9999
```

app.js

```javascript
console.log(process.env.APP_NAME)
console.log(process.env.PORT)
```

##### 2. Run set-node-env command

package.json

```json
"scripts": {
    "test": "set-node-env --mode=production --debug=true node app.js"
}
```

```
$ npm test
$ set-node-env-demo
$ 9999
```

or

```shell
$ ./node_modules/.bin/set-node-env --mode=production --debug=true node app.js
$ set-node-env-demo
$ 9999
```

Both .env and .env.prodocution will take affect.

##### 3. (Optional and Alternative) Run below code instead of step above under your project root directory

```shell
$ node -r ./node_modules/set-node-env/preload.js app.js --env-mode=production --env-debug=true // node -r preload the specified module at startup
$ set-node-env-demo
$ 9999
```

## Command Line Interface

> Make sure set-env-node or node -r ./node_modules/set-node-env/preload.js command be executed under your project root directory since .env and .env.mode files were created there, that means set-node-env module code loads .env and .env.mode files under you current working directory.

> 1. A .env file will always be tried to load even if it does not exist. A .env.mode file has a higher priority.
> 2. If process.env has the key defined in .env or .env.mode files, new value will be ignored.
> 3. If mode exists and process.env.NODE_ENV is undefined, set process.env.NODE_ENV=mode.

```shell
set-node-env --mode=production --debug=true node app.js

Options
  --mode             (optional) specify mode and must create a corresponding .env.mode file first
  --debug            (optional) show debug info or not, no specified means false, --debug means true
```

```shell
node -r ./node_modules/set-node-env/preload.js app.js --env-mode=production --env-debug=true

Options
  --env-mode         same as --mode
  --env-debug        same as --debug
```

## More Examples

package.json

```json
"scripts": {
    "node": "set-node-env --mode=production --debug=true node app.js",
    "electron": "set-node-env --mode=production --debug=true electron .", // install electron first
    "npx": "set-node-env --mode=production --debug=true npx electron .", // npm >= 5.2
    "npm": "set-node-env --mode=production --debug=true npm env"
}
```

## LICENSE

MIT
