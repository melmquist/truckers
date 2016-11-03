'use strict'

const request = require('supertest-as-promised')
const {expect} = require('chai')
const db = require('APP/db')
const Orders = require('./orders')
const app = require('./start')

describe('api/orders', () => {
  before('wait for the db', () => db.didSync)

  const fakeOrder = {
          id: 100,
          userId: 110,
          truckId: 1,
          orders: {
            menuItem: 'tacos',
            quantity: 2
          }
        }

  describe('creates an order', () => {
    it('POST to / creates an order with userId, truckId, and menu selections', () =>
      request(app)
        .post('/api/orders')
        .send(fakeOrder)
        .expect(201)
      )

    it('POST to / rejects incomplete orders', () =>
      request(app)
        .post('/api/orders')
        .send({
          userId: 500
        })
        .expect(500)
      )

  describe('gets all orders (admin)', () => {

    before(() =>
      request(app)
        .post('/api/orders')
        .send(fakeOrder)
    )

    it('GET to / gets all orders', () =>
      request(app)
        .get('/api/orders')
        .then(res => expect(res.body).to.contain.({
          userId: 110
        }))
      )
  }

  describe('gets all orders for a given order id', () => {
    before(() =>
      Orders.create(fakeOrder)
            .then()
            .catch(() => console.log('Order.create not working'))
    )

    it('GET to :orderId gets a single order by id', () =>
      request(app)
        .get('/api/orders/100')
        .then(res => expect(res.body).to.contain.({
          userId: 110
        }))
    )

    it('GET to :orderId returns an empty array if not found', () =>
      request(app)
        .get('/api/orders/101')
        .then(res => expect(res.body).to.contain.({
          []
        }))
      )
  })

  describe('gets all orders for a given user id', () => {

    before(() =>
      Orders.create(fakeOrder)
            .then()
            .catch(() => console.log('Order.create not working'))
    )

    it('GET to /user/:userId gets all orders by a user', () =>
      request(app)
        .get('/api/orders/110')
        .then(res => expect(res.body).to.contain.({
          truckId: 1
        }))
      )

    it('GET to /user/:userId returns an empty array if none found', () =>
      request(app)
        .get('/api/orders/110')
        .then(res => expect(res.body).to.contain.({
          []
        }))
      )
  })

  describe('gets all orders for a given food truck', () => {

    before(() =>
      Orders.create(fakeOrder)
            .then()
            .catch(() => console.log('Order.create not working'))
    )

    it('GET to /orders/:truckid can find orders by truck id', () =>
      request(app)
        .get('/api/orders/1')
        .then(res => expect(res.body).to.contain.({
          userId: 110
        }))
      )

    it('GET to /orders/:truckid returns an empty array if a truck has no orders', () =>
      request(app)
        .get('/api/orders/1')
        .then(res => expect(res.body).to.contain.({
          []
        }))
      )
  })

  describe('allows a vendor to modify or delete orders', () => {

    before(() =>
      Orders.create(fakeOrder)
            .then()
            .catch(() => console.log('Order.create not working'))
    )

    it('PUT to /orders/:orderId updates an order', () =>
      request(app)
        .put('/api/orders/100')
        .send({
          orders: {
            menuItem: 'enchiladas',
            quantity: 1
          }
        })
        .then(res => {
          return request(app)
            .get('/api/orders/100')
            .then(res => expect(res.body).to.contain.({
              orders: {
                menuItem: 'enchiladas',
                quantity: 1
              }
            }))
        })
      )

    it('DELETE to orders/:orderId deletes an order', () =>
      request(app)
        .delete('/api/orders/100')
        .then(res => {
          return request(app)
            .get('/api/orders/100')
            .then(res => expect(res.body).to.contain.({
              []
            }))
      })
    )
    
})
