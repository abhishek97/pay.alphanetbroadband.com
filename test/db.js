const moment = require('moment')
const assert = require('assert')
const db = require('../db')

const {expect} = require('chai')

describe('Database Functions', function () {
    describe('getCustomerDetails()', function () {
        it('should return details of customer', async function () {
            const users = await db.getCustomerDetails('Ind_abhishek')
            const user = users[0]
            expect(user).to.be.have.property('CID', 'Ind_abhishek')
            expect(user).to.be.have.property('Name', 'Abhishek Gupta')
            expect(user).to.be.have.property('Mobile', 7290057600)
        })
    })
    describe('updateExpiryAndGrace()', function () {
        it('should update expiry date of customer and Grace', async function () {

            const userBefore = await db.getCustomerDetails('Ind_abhishek').then( ([u]) => u)

            expect(userBefore).to.be.have.property('CID', 'Ind_abhishek')
            expect(userBefore).to.be.have.property('Grace', 1)

            await db.updateExpiryAndGrace('Ind_abhishek', {
                CID: 'Ind_abhishek',
                MONTHS: 3
            })

            const userAfter = await db.getCustomerDetails('Ind_abhishek').then( ([u]) => u)
            expect(userAfter).to.be.have.property('CID', 'Ind_abhishek')
            expect(userAfter).to.be.have.property('Grace', 0)
            assert(userAfter.expiry.toISOString() === moment(userBefore.expiry).add(3, 'months').toISOString())

        })
    })
})