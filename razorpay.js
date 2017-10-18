/**
 * Created by abhishek on 16/10/17.
 */
'use strict';
const razorpay = require('razorpay')
const config = require('./config')
const razorPay = new razorpay({
    key_id: config.razorPay.id,
    key_secret: config.razorPay.secret
})

module.exports = razorPay