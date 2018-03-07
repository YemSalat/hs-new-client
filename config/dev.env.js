'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const appPackage = require('../package')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
