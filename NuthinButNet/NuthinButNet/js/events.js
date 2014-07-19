FOTP = {};
FOTP.Events = {};

FOTP.Events.Navigation = function (opts) {
    var self = this;

    self.opts = jQuery.extend({
        baseUrl: '/events/',
        year: year,
        month: month
    }, opts);

    self._init = function () {
        jQuery('#' + opts.id + ' li.previous a').on('click', function () {
            window.location.href = self.opts.baseUrl + self._getQueryStringForPrev();
            return false;
        });
        jQuery('#' + opts.id + ' li.next a').on('click', function() {
            window.location.href = self.opts.baseUrl + self._getQueryStringForNext();
            return false;
        });
    };

    self._getQueryStringForPrev = function () {
        return '?year=' + (self._getYearForPrev()).toString() + '&month=' + (self._getMonthForPrev()).toString();
    };

    self._getQueryStringForNext = function () {
        return '?year=' + (self._getYearForNext()).toString() + '&month=' + (self._getMonthForNext()).toString();
    };

    self._getYearForPrev = function() {
        var month = self.opts.month;
        if (month === 1) {
            return self.opts.year - 1;
        }
        return self.opts.year;
    };

    self._getYearForNext = function () {
        var month = self.opts.month;
        if (month === 12) {
            return self.opts.year + 1;
        }
        return self.opts.year;
    };

    self._getMonthForPrev = function() {
        var month = self.opts.month;
        if (month === 1) {
            return 12;
        }
        return self.opts.month - 1;
    };

    self._getMonthForNext = function () {
        var month = self.opts.month;
        if (month === 12) {
            return 1;
        }
        return self.opts.month + 1;
    };

    self._init();
};