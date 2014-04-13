$(document).ready(function () {
    $('.addToCart').click(function () {
        var selMoney = $('input[name=money]:checked', '#catalog').val();
        var selTime = $('input[name=time]:checked', '#catalog').val();
        selMoney = selMoney == '-1' ? $('#moneyOther').val() : selMoney;
        selTime = selTime == '-1' ? $('#timeOther').val() : selTime;
        
        var selTalent = getMultiProducts('input[name=talent]:checked', '#catalog');
        var selInKind = getMultiProducts('input[name=inKind]:checked', '#catalog');

        function getMultiProducts(selector)
        {
            var values = '';
            $(selector).each(function () {
                if (values != '')
                    values += ',';
                values += $(this).val();
            });
            return values;
        }
    });

});