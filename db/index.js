/**
 * Created by abhishek on 15/10/17.
 */
'use strict';
 
const mysql = require('mysql')
const moment = require('moment')
const config = require('../config')

const connection = mysql.createConnection(config.db)


const runQuery = (query, ...args) => {
    return new Promise( (resolve, reject) => {
        connection.query(query, ...args, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })

}

module.exports = {
    getCustomerDetails (cid) {
        return runQuery('SELECT * FROM `alphanet_customer` WHERE `CID` = ?', cid)
    },
    getPlans () {
        return runQuery('SELECT * FROM `plans` WHERE TRUE')
    },
    async addPayment (notes, payment) {
        const options = {
            CID: notes.CID,
            CNAME: notes.Name,
            MONTHS: notes.months,
            AMOUNT: (+payment.amount/100) - (+notes.months*config.fee),
            TYPE: 'online',
            COMMENT: notes.plan + ';' + payment.id,
            PLAN: notes.plan.split(';')[2]
        }
        const dbPayment = await runQuery('INSERT INTO `alphanet_payment` SET ?', options)

        const obj = {
            PID: dbPayment.insertId,
            razorPayId: payment.id
        }
        await runQuery('INSERT INTO `alphanet_online_payment` SET ?', obj)
        return runQuery('SELECT * FROM `alphanet_payment` WHERE PID = ?', obj.PID).then( ([u]) => u )
    },
    async updateExpiryAndGrace (cid, payment) {
        console.log(payment)
        const dbCustomer = await this.getCustomerDetails (cid).then( ([u]) => u)
        const newExpiry = moment(dbCustomer.expiry).add(payment.MONTHS, 'months')
        return runQuery('UPDATE `alphanet_customer` SET `Grace` = 0, `expiry` = ? WHERE `CID` = ?', [newExpiry.format('YYYY-MM-DD HH:mm:ss'), cid])

    }
}

