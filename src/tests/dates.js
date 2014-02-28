(function() {
var a = require('assert');
var assert = a.assert;
var eq_ = a.eq_;
var contains = a.contains;

var dateslib = require('dates');
test('dates.relativeDateString', function(done) {
    var refDate = new Date(2014,1,1);
    var opts = {
        referenceDate: refDate
    };

    eq_(dateslib.relativeDateString(new Date(2014,1,1,1), opts), '1 hour');
    eq_(dateslib.relativeDateString(new Date(2014,1,1,4), opts), '4 hours');

    eq_(dateslib.relativeDateString(new Date(2014,1,2), opts), '1 day');
    eq_(dateslib.relativeDateString(new Date(2014,1,7), opts), '6 days');

    eq_(dateslib.relativeDateString(new Date(2014,2,1), opts), '1 month');
    eq_(dateslib.relativeDateString(new Date(2014,7,1), opts), '6 months');

    eq_(dateslib.relativeDateString(new Date(2015,1,1), opts), '1 year');
    eq_(dateslib.relativeDateString(new Date(2018,1,1), opts), '4 years');
    eq_(dateslib.relativeDateString(new Date(2034,1,1), opts), '20 years');

    eq_(dateslib.relativeDateString(new Date(2014,1,1,2,30,45), opts), '2 hours, 30 minutes, 45 seconds');

    done();
});

})();
