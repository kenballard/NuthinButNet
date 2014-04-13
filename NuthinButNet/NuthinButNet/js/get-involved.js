$(document).ready(function () {
    $('.addToCart').click(function () {
        fillCartItem('money', getSingleProduct('money'), '$', '');
        fillCartItem('time', getSingleProduct('time'), '', ' hours');
        fillCartItem('talent', getMultiProducts('talent'), '', '');
        fillCartItem('inKind', getMultiProducts('inKind'), '', '');

        function fillCartItem(selector, value, prepender, postpender)
        {
            if (value != '0' && value != '')
            {
                $('#' + selector + 'Selected').text(prepender + value + postpender);
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

});