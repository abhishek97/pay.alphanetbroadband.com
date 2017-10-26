/**
 * Created by abhishek on 26/10/17.
 */
'use strict';

const config = require('./config')
module.exports = {
    addOnlineFees (plans) {
        return plans.map( plan => {
            plan.amount = (+plan.amount) + config.fee
            plan.quaterly = (+plan.quaterly) + (3*config.fee)
            return plan
        })
    }
}