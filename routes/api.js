/**
 * Created by abhishek on 16/10/17.
 */
'use strict';

var express = require('express');
var router = express.Router();

const db = require('../db')


router.get('/customers/:cid', function(req, res) {
    db.getCustomerDetails(req.params.cid)
        .then(rows => {
            if (rows.length)
                res.json(rows[0])
            else
                res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
});


module.exports = router;
