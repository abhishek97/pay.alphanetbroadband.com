var express = require('express');
var router = express.Router();

const razorypay = require('../razorpay')
const U = require('../utils')
const db = require('../db')

/* GET home page. */
router.get('/', async function(req, res, next) {
    const razorPaymentId = req.query.razorpay_payment_id
    const payment = await razorypay.payments.fetch(razorPaymentId)

    const {amount, notes} = payment
    const [planId, planAmount, planName]  = notes.plan.split(';')

    const dbPlans = U.addOnlineFees(await db.getPlans())

    const dbPlan = dbPlans.find(plan => plan.id == planId)

    console.log(dbPlan.amount, payment.amount)
    if (notes.months == 3) {
        if (+dbPlan.quaterly*100 != payment.amount)
            return res.render('error', {message: 'Invalid Payment, Plan Id-Amount mismatch'})
    } else if ( (+dbPlan.amount*notes.months)*100 != payment.amount)
        return res.render('error', {message: 'Invalid Payment, Plan Id-Amount mismatch'})

    try {
        console.log(notes)
        const capturedPayment = await razorypay.payments.capture(razorPaymentId, payment.amount)
        console.log(capturedPayment)
        const dbPayment = await db.addPayment(notes, capturedPayment)
        capturedPayment.amount /= 100

        await db.updateExpiryAndGrace(notes.CID, dbPayment)

        res.render('checkout', {payment: capturedPayment})
        //TODO: Send Message on facebook
    } catch (e) {
        console.error(e)
        res.render('error', {message: 'Cannot Capture the payment.'})
    }
});

module.exports = router;