(function() {
var a = require('assert');
var assert = a.assert;
var eq_ = a.eq_;
var contains = a.contains;

var dateslib = require('dates');

var refDate = new Date(2014, 1, 1);
var opts = {
    referenceDate: refDate
};

function deltaDate(units) {
    var offsetInSeconds = 0;
    for (var unit in units) {
        offsetInSeconds += dateslib.unitSizes[unit] * units[unit];
    }
    return new Date(refDate.getTime() - offsetInSeconds * 1000);
}

test('dates.relativeDateString', function(done) {
    eq_(dateslib.relativeDateString(deltaDate({h: 1}), opts), '1 hour');
    eq_(dateslib.relativeDateString(deltaDate({h: 4}), opts), '4 hours');

    eq_(dateslib.relativeDateString(deltaDate({d: 1}), opts), '1 day');
    eq_(dateslib.relativeDateString(deltaDate({d: 6}), opts), '6 days');

    eq_(dateslib.relativeDateString(deltaDate({M: 1}), opts), '1 month');
    eq_(dateslib.relativeDateString(deltaDate({M: 6}), opts), '6 months');

    eq_(dateslib.relativeDateString(deltaDate({y: 1}), opts), '1 year');
    eq_(dateslib.relativeDateString(deltaDate({y: 4}), opts), '4 years');
    eq_(dateslib.relativeDateString(deltaDate({y: 20}), opts), '20 years');

    // This will likely change behaviour when future relative dates are needed
    eq_(dateslib.relativeDateString(deltaDate({h: -1}), opts), '0 seconds');

    done();
});

})();
