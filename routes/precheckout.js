const express = require('express');
const router = express.Router();

const db = require('../db')

/* GET users listing. */
router.get('/', function(req, res) {
  const customerPromise = db.getCustomerDetails(req.query.cid)
  const plansPromise = db.getPlans()
  Promise.all([customerPromise, plansPromise])
      .then( ([ [customer], plans ]) => {
        console.log(plans)
        res.render('precheckout', {customer, plans, months: Array(13).fill().map( (e,i) => i )})
      })
      .catch(err => {
        console.error(err)
        res.sendStatus(500)
      })
});

module.exports = router;
