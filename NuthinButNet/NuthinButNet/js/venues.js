FOTP = {};
FOTP.Venues = {};

FOTP.Venues.Navigation = function (opts) {
    var self = this;

    self.opts = jQuery.extend({
        baseUrl: '/parks/',
        page: 0,
        pageSize: 2,
        totalVenues: 5
    }, opts);

    self._init = function () {
        jQuery('#' + self.opts.id + ' li.previous a').on('click', self._prevHandler);
        jQuery('#' + self.opts.id + ' li.next a').on('click', self._nextHandler);
    };

    self._prevHandler = function () {
        console.log('prev');
        if (self.opts.page > 0) {
            window.location.href = self._getQueryStringForPrev();
        }
        return false;
    };

    self._nextHandler = function () {
        console.log('next');
        var numPages = Math.ceil(self.opts.totalVenues / pageSize);
        if (self.opts.page < numPages) {
            window.location.href = self._getQueryStringForNext();
        }
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

    console.log('venue nav', self.opts);

    self._init();
};