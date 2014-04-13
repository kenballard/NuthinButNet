$(document).ready(function () {
    $('.addToCart').click(function () {
        var selMoney = getSingleProduct('money');
        var selTime = getSingleProduct('time');
        var selTalent = getMultiProducts('talent');
        var selInKind = getMultiProducts('inKind');

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