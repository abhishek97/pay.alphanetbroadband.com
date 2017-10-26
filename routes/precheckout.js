const express = require('express');
const router = express.Router();
const config = require('../config')

const U = require('../utils')
const db = require('../db')

/* GET users listing. */
router.get('/', function(req, res) {
  const customerPromise = db.getCustomerDetails(req.query.cid)
  const plansPromise = db.getPlans()
  Promise.all([customerPromise, plansPromise])
      .then( ([ [customer], plans ]) => {
        console.log(customer)
        if (!customer) {
            res.render('error', {
                message: 'Customer ID not found!'
            })
        }
        plans = plans.map(plan => (plan.showAmount = plan.amount,plan) )
        plans = U.addOnlineFees(plans)
        res.render('precheckout', {razorPayKey: config.razorPay.id, customer, plans, months: Array(13).fill().map( (e,i) => i )})
      })
      .catch(err => {
        console.error(err)
        res.sendStatus(500)
      })
});

module.exports = router;
