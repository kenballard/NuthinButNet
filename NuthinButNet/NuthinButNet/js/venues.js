FOTP = {};
FOTP.Venues = {};

FOTP.Venues.Navigation = function (opts) {
    var self = this;

    self.opts = jQuery.extend({
        baseUrl: '/parks/',
        page: 0,
        pageSize: 2
    }, opts);

    self._init = function () {
        var prev = jQuery('#' + self.opts.id + ' li.previous a');
        var next = jQuery('#' + self.opts.id + ' li.next a');

        if (self.opts.page <= 0) {
            prev.attr('disabled', 'disabled');
        } else {
            prev.on('click', self._prevHandler);
        }

        var numPages = Math.ceil(self.opts.totalVenues / pageSize) - 1;
        if (self.opts.page < numPages) {
            next.on('click', self._nextHandler);
        } else {
            next.attr('disabled', 'disabled');
        }
    };

    self._prevHandler = function () {
        window.location.href = self._getQueryStringForPrev();
        return false;
    };

    self._nextHandler = function () {
        window.location.href = self._getQueryStringForNext();
        return false;
    };

    self._getQueryStringForPrev = function () {
        var prevPage = self.opts.page - 1;
        return '?page=' + (prevPage).toString() + '&pageSize=' + (self.opts.pageSize).toString();
    };

    self._getQueryStringForNext = function () {
        var nextPage = self.opts.page + 1;
        return '?page=' + (nextPage).toString() + '&pageSize=' + (self.opts.pageSize).toString();
    };

    self._init();
};