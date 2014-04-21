jQuery(document).ready(function ($) {
    $('.other-radio').click(function (e) {
        var otherInput = $('#' + $(e.target).attr('data-other'));
        var isActive = true;
        toggleOtherInput(otherInput, isActive);
    });

    $('.open').click(function () {
        openCatalogItem(this);
    });

    $('.catalog-item').submit(function () {
        return false;
    });

    $('.edit-catalog-item').click(function (e) {
        e.preventDefault();
        return false;
    });

    $('.discard').click(function () {
        var catalogItem = $(this).parents('.catalog-item');
        var open = catalogItem.find('.open')[0];
        var selectedItem = catalogItem.find('.selected-catalog-items')[0];
        var edit = catalogItem.find('.edit-catalog-item')[0];
        $(open).hide();
        $(selectedItem).text('Not now');
        $(selectedItem).show();
        $(edit).show();
        $(this).hide();
        return false;
    });

    $('.confirm-catalog-item').click(function () {
        var catalogItem = $(this).parents('.catalog-item');
        var form = catalogItem.children('.catalog-form');
        var selectedItem = catalogItem.find('.selected-catalog-items')[0];
        var open = catalogItem.find('.open')[0];
        var edit = catalogItem.find('.edit-catalog-item')[0];
        var discard = catalogItem.find('.discard')[0];
        form.validate();
        if (form.valid()) {
            toggleItem(this);
        }

        function toggleItem(e) {
            catalogItem.children('.cover').show();
            form.hide();
            var selectedValues;
            if ($(e).attr('data-single') == 'True') {
                selectedValues = getSingleProduct($(e).attr('data-product-type'));
                var value = $(selectedItem).attr('data-prepender');
                value += selectedValues;
                value += $(selectedItem).attr('data-postpender');

                $(selectedItem).text(value);
            } else {
                selectedValues = getMultiProducts($(e).attr('data-product-type'));
                $(selectedItem).text(selectedValues);
            }
            if (selectedValues == null || selectedValues == "") {
                $(selectedItem).hide();
                $(open).show();
                $(edit).hide();
                $(discard).show();
            } else {
                $(selectedItem).show();
                $(open).hide();
                $(edit).show();
                $(discard).hide();
                $('.add-to-cart').removeAttr('disabled');
            };
        }
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

    $('#editCart').click(function () {
        $('#catalog').show();
        $('#checkout').hide();
        $('#checkout-error').hide();
        return false;
    });

    function openCatalogItem(control) {
        var catalogItem = $(control).parents('.catalog-item');
        catalogItem.children('.cover').hide();
        catalogItem.children('.catalog-form').show();
    }

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

    function getSingleProduct(selector, parentSelector, otherSelector) {
        var sel = $('input[name=' + selector + ']:checked', '#catalog').val();
        sel = sel == '-1' ? $('#' + selector + 'Other').val() : sel;
        return sel;
    }

    function getMultiProducts(selector) {
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
                    $(this).addClass('required');
                });
            } else {
                $('#payment').hide();
                $('#payment').children().each(function () {
                    $(this).removeClass('required');
                });
            }
        }

        function fillCartItem(selector, value, prepender, postpender)
        {
            if (value != null && value != '0' && value != '')
            {
                var formattedValue = toTitleCase(selector) + ": " + prepender + value + postpender;
                $('.' + selector + 'Selected').text(formattedValue);
                $('#' + selector + 'Product').text(value);
            }

            function toTitleCase(str) {
                str = str == 'inKind' ? 'In Kind' : str;
                return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            }
        }

        return false;
    });

    $('#checkout-form').submit(function (e) {
        $('#checkout-form').validate();
        if ($('#checkout-form').valid()) {
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
                    window.scrollTo(0, 0);
                },
                error: function (msg) {
                    $('#checkout-error').show();
                    $('#checkout-submit').removeAttr('disabled');
                    $('#checkout-processing').hide();
                }
            });
        };

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