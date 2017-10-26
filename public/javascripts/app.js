/**
 * Created by abhishek on 16/10/17.
 */

const fee = 10

function generateOptions (customer, amount) {
    return {
        key: $('#razorPayKey').val(),
        amount,
        name: "Alphanet Broadband Pvt Ltd",
        description: "Subscription Payment",
        handler: function (resp) {
            window.location.href = '/checkout/?' + $.param(resp)
        },
        prefill: {
            name: customer.Name,
            email: customer.Email,
            contact: customer.Mobile
        },
        notes: {
            plan: $('#plan').val(),
            months: $('#month').val(),
            ...customer
        }
    }
}

function calcAmt (planAmt, quaterly, month) {
    var amt = (+planAmt)*(+month)
    if (month == 3)
        //TODO: perform you save: logic
        return quaterly

    return amt
}

function updatePrice () {
    var planAmount = $('#plan').val().split(';')[1]
    var planAmountQuaterly = $('#plan').val().split(';')[3]
    var month = $('#month').val()
    var totalAmt = calcAmt(planAmount, planAmountQuaterly, month)
    var planAmt = totalAmt - (+month*fee)
    $('#planPrice').html(planAmt > 0 ? planAmt : 0)
    $('#price').html(totalAmt)
}

$('#plan').change(updatePrice)
$('#month').change(updatePrice)



$('#rzp-button1').click(function (e) {
    var cid = $('#customerID').html()
    var amount = $('#price').html()
    $.getJSON("/api/customers/" + cid)
        .done(function (data) {
            console.log(data)
            var rzp = new Razorpay(generateOptions(data, +amount*100))
            rzp.open()
            e.preventDefault()
        })
        .fail(function (err) {
            console.error(err)
        })
})