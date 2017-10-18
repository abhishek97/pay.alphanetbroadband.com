/**
 * Created by abhishek on 15/10/17.
 */
'use strict';
 
const mysql = require('mysql')
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
    addPayment (notes, payment) {
        const options = {
            CID: notes.CID,
            CNAME: notes.Name,
            MONTHS: notes.months,
            AMOUNT: +payment.amount/100,
            TYPE: 'online',
            COMMENT: notes.plan + ';' + payment.id,
            PLAN: notes.plan.split(';')[2]
        }
        return runQuery('INSERT INTO `alphanet_payment` SET ?', options)
    }
}

