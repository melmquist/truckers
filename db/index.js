'use strict'
const debug = require('debug')('sql')
const chalk = require('chalk')
const Sequelize = require('sequelize')
const app = require('APP')

const name = (process.env.DATABASE_NAME || app.name) +
  (app.isTesting ? '_test' : '')

const url = process.env.DATABASE_URL || `postgres://localhost:5432/${name}`

console.log(chalk.yellow(`Opening database connection to ${url}`));

// create the database instance
const db = module.exports = new Sequelize(url, {
  logging: debug, // export DEBUG=sql in the environment to get SQL queries
  native: true,   // lets Sequelize know we can use pg-native for ~30% more speed
  define: {
    underscored: true,       // use snake_case rather than camelCase column names
    freezeTableName: true,   // don't change table names from the one specified
    timestamps: true,        // automatically include timestamp columns
  }
})
