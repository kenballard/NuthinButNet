jQuery(document).ready(function ($) {
    $('.addToCart').click(function () {
        fillCartItem('money', getSingleProduct('money'), '$', '');
        fillCartItem('time', getSingleProduct('time'), '', ' hours');
        fillCartItem('talent', getMultiProducts('talent'), '', '');
        fillCartItem('inKind', getMultiProducts('inKind'), '', '');

        $('#catalog').hide();
        $('#checkout').show();
        $('#checkout-error').hide();

        window.scrollTo(0, 0);

        togglePayment($('#moneyProduct').text() != '');

        
        function togglePayment(show) {
            if (show) {
                $('#payment').show();
                $('#payment').children().each(function () {
                    $(this).attr('required', 'required');
                });
            } else {
                $('#payment').hide();
                $('#payment').children().each(function () {
                    $(this).removeAttr('required');
                });
            }
        }

        function fillCartItem(selector, value, prepender, postpender)
        {
            if (value != null && value != '0' && value != '')
            {
                $('.' + selector + 'Selected').text(prepender + value + postpender);
                $('#' + selector + 'Product').text(value);
            }
        }

        function getSingleProduct(selector, parentSelector, otherSelector)
        {
            var sel = $('input[name=' + selector + ']:checked', '#catalog').val();
            sel = sel == '-1' ? $('#' + selector + 'Other').val() : sel;
            return sel;
        }

        function getMultiProducts(selector)
        {
            var values = '';
            $('input[name=' + selector + ']:checked').each(function () {
                if (values != '')
                    values += ', ';
                values += $(this).val();
            });
            return values;
        }
    });

    $('#checkout-form').submit(function (e) {
        $('#checkout-submit').attr('disabled', 'disabled');
        $('#checkout-processing').show();

        var data = getCheckout();
        $.ajax({
            type: 'POST',
            url: '/umbraco/surface/GetInvolved/Submit',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function (msg) {
                $('#checkout').hide();
                $('#checkout-success').show();
                $('#checkout-processing').hide();
            },
            error: function (msg) {
                $('#checkout-error').show();
                $('#checkout-submit').removeAttr('disabled');
                $('#checkout-processing').hide();
                window.scrollTo(0, 0);
            }
        })
        return false;

        function getCheckout() {
            return {
                'FirstName': $('#FirstName').val(),
                'LastName': $('#LastName').val(),
                'Address': $('#Address').val(),
                'City': $('#City').val(),
                'State': $('#State').val(),
                'Zip': $('#Zip').val(),
                'Phone': $('#Phone').val(),
                'Email': $('#Email').val(),
                'CreditCard': $('#CreditCard').val(),
                'VerificationCode': $('#VerificationCode').val(),
                'ExpyMonth': $('#ExpyMonth').val(),
                'ExpyYear': $('#ExpyYear').val(),
                'Money': $('#moneyProduct').text(),
                'Time': $('#timeProduct').text(),
                'Talent': $('#talentProduct').text(),
                'InKind': $('#inKindProduct').text()
            };
        }
    });
});