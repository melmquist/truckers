const db = require('APP/db')
<<<<<<< HEAD
const { foodTrucks, menuItems, users } = require('./seedData')

const seedFoodTrucks = () => db.Promise.map(foodTrucks, truck => db.model('foodTrucks').create(truck));
const seedMenuItems = () => db.Promise.map(menuItems, item => db.model('menuItems').create(item));
const seedUsers = () => db.Promise.map(users, user => db.model('users').create(user));

db.didSync
  .then(() => db.sync({force: true}))
  .then(seedFoodTrucks)
  .then(seedMenuItems)
  .then(seedUsers)
  .then(trucks => {
    console.log(`Seeded foodTrucks, menuItems, and users`)
    // console.log(trucks)
  })
  .catch(error => console.error(error))
  .finally(() => db.close())
