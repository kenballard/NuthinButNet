jQuery(document).ready(function ($) {
    $('.other-radio').click(function (e) {
        var otherInput = $('#' + $(e.target).attr('data-other'));
        var isActive = true;
        toggleOtherInput(otherInput, isActive);
    });

    $('.not-other-radio').click(function (e) {
        var otherInput = $('#' + $(e.target).attr('data-other'));
        var isActive = false;
        toggleOtherInput(otherInput, isActive);
    });

    $('.other-checkbox').click(function (e) {
        var otherInput = $('#' + $(e.target).attr('data-other'));
        var isActive = $(e.target).prop('checked');
        toggleOtherInput(otherInput, isActive);
    });

    function toggleOtherInput(otherInput, isActive) {
        if (isActive) {
            otherInput.removeAttr('disabled');
            otherInput.addClass('required');
        } else {
            otherInput.attr('disabled', 'disabled');
            otherInput.val('');
            otherInput.removeClass('required');
        }
    }

    $('.add-to-cart').click(function () {
        var isValid = true;
        $('.catalog-form').each(function() {
            $(this).validate();
            isValid = $(this).valid() && isValid;
        });
        if (isValid) {
            fillCartItem('money', getSingleProduct('money'), '$', '');
            fillCartItem('time', getSingleProduct('time'), '', ' hours');
            fillCartItem('talent', getMultiProducts('talent'), '', '');
            fillCartItem('inKind', getMultiProducts('inKind'), '', '');

            $('#catalog').hide();
            $('#checkout').show();
            $('#checkout-error').hide();

            togglePayment($('#moneyProduct').text() != '');
        }

        window.scrollTo(0, 0);

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
                var sel = $(this).val();
                sel = sel == '-1' ? $('#' + selector + 'Other').val() : sel;
                values += sel;
            });
            return values;
        }

        return false;
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