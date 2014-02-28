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

test('dates.relativeDateString simple', function(done) {
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

test('dates.relativeDateString compound', function(done) {
    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1}), opts), '1 day, 1 hour');
    eq_(dateslib.relativeDateString(deltaDate({d: 4, h: 12}), opts), '4 days, 12 hours');
    eq_(dateslib.relativeDateString(deltaDate({y: 1, M: 7}), opts), '1 year, 7 months');
    eq_(dateslib.relativeDateString(deltaDate({m: 20, s: 30}), opts), '20 minutes, 30 seconds');

    // The defaults for these options would limit the number of units displayed, so reset them here
    var fullUnitOpts = { 
        referenceDate: refDate,
        maxDisplayUnits: 100,
        maxUnitSpread: 100
    };
    eq_(dateslib.relativeDateString(deltaDate({d: 2, h: 3, m: 20, s: 45}), fullUnitOpts), '2 days, 3 hours, 20 minutes, 45 seconds');
    eq_(dateslib.relativeDateString(deltaDate({y: 20, M: 10, w: 2, d: 4, h: 3, m: 20, s: 45}), fullUnitOpts), '20 years, 10 months, 2 weeks, 4 days, 3 hours, 20 minutes, 45 seconds');

    eq_(dateslib.relativeDateString(deltaDate({d: 10, h: 3}), fullUnitOpts), '1 week, 3 days, 3 hours');
    eq_(dateslib.relativeDateString(deltaDate({d: 48, h: 50}), fullUnitOpts), '1 month, 2 weeks, 6 days, 2 hours');

    done();
});

test('dates.relativeDateString options', function(done) {
    function fullOpts(opts) {
        opts.referenceDate = refDate;
        if (!opts.maxDisplayUnits) opts.maxDisplayUnits = 100;
        if (!opts.maxUnitSpread) opts.maxUnitSpread = 100;
        return opts;
    }

    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1}), fullOpts({
        minUnit: 'd'
    })), '1 day');
    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1, s: 1}), fullOpts({
        minUnit: 'm'
    })), '1 day, 1 hour');
    eq_(dateslib.relativeDateString(deltaDate({m: 1, s: 1}), fullOpts({
        minUnit: 'h'
    })), '0 hours');

    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1}), fullOpts({
        maxDisplayUnits: 1
    })), '1 day');
    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1, m: 1, s: 1}), fullOpts({
        maxDisplayUnits: 3
    })), '1 day, 1 hour, 1 minute');

    eq_(dateslib.relativeDateString(deltaDate({d: 1, m: 1}), fullOpts({
        maxUnitSpread: 2
    })), '1 day');
    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1, m: 1, s: 1}), fullOpts({
        maxUnitSpread: 3
    })), '1 day, 1 hour, 1 minute');

    eq_(dateslib.relativeDateString(deltaDate({d: 1, h: 1, s: 1}), fullOpts({
        maxDisplayUnits: 3,
        maxUnitSpread: 2
    })), '1 day, 1 hour');

    done();
});

})();
