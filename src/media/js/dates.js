define('dates', ['underscore', 'l10n'], function(_, l10n) {
    var ngettext = l10n.ngettext;

    var unitFormatters = {
        s: function(n) { return ngettext('1 second ago', '{n} seconds ago', {n: n}); },
        m: function(n) { return ngettext('1 minute ago', '{n} minutes ago', {n: n}); },
        h: function(n) { return ngettext('1 hour ago', '{n} hours ago', {n: n}); },
        d: function(n) { return ngettext('1 day ago', '{n} days ago', {n: n}); },
        w: function(n) { return ngettext('1 week ago', '{n} weeks ago', {n: n}); },
        M: function(n) { return ngettext('1 month ago', '{n} months ago', {n: n}); },
        y: function(n) { return ngettext('1 year ago', '{n} years ago', {n: n}); }
    };
    var unitSizes = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 60 * 60 * 24,
        w: 60 * 60 * 24 * 7,
        M: 60 * 60 * 24 * 30,
        y: 60 * 60 * 24 * 365
    };
    var unitOrdinality = ['y', 'M', 'w', 'd', 'h', 'm', 's'];

    /*
    Forms a localized relative date string from a given Date object. 
    For example, '1 day ago'.

    Options:
        referenceDate: The date to compare to. Defaults to Date.now().
        minUnit: The minimum unit that can be displayed in the string. Units
            are referenced using abbreviations of the following convention:
                's': seconds
                'm': minutes
                'h': hours
                'd': days
                'M': months
                'y': years
    */
    function relativeDateString(date, opts) {
        opts = opts || {};
        opts.minUnit = opts.minUnit || 's';
        opts.referenceDate = opts.referenceDate || Date.now();

        // TODO: Mark negative diffs so they can be handled differently
        // in the future (ie. adding an 'ago' vs 'from now' suffix)
        var diffInSeconds = Math.max((opts.referenceDate - date) / 1000, 0);

        var dateString;
        var maxOrdinalityIdx = unitOrdinality.indexOf(opts.minUnit);
        unitOrdinality.some(function(unit, idx) {
            var unitSize = unitSizes[unit];
            var quantity = Math.floor(diffInSeconds / unitSize);
            if (quantity > 0 || idx === maxOrdinalityIdx) {
                dateString = unitFormatters[unit](quantity);
                return true;
            }
            return false;
        });
        return dateString;
    }

    return {
        relativeDateString: relativeDateString,
        unitSizes: unitSizes
    };
});
