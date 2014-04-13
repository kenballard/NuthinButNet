$(document).ready(function () {
    $('.addToCart').click(function () {
        var selMoney = getSingleProduct('money');
        var selTime = getSingleProduct('time');
        var selTalent = getMultiProducts('input[name=talent]:checked', '#catalog');
        var selInKind = getMultiProducts('input[name=inKind]:checked', '#catalog');

        function getSingleProduct(selector, parentSelector, otherSelector)
        {
            var sel = $('input[name=' + selector + ']:checked', '#catalog').val();
            sel = sel == '-1' ? $('#' + selector + 'Other').val() : selMoney;
        }

        function getMultiProducts(selector)
        {
            var values = '';
            $(selector).each(function () {
                if (values != '')
                    values += ', ';
                values += $(this).val();
            });
            return values;
        }
    });

});