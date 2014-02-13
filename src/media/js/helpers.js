define('helpers',
       ['l10n', 'nunjucks', 'underscore', 'utils', 'format', 'settings', 'urls', 'user'],
       function(l10n, nunjucks, _, utils) {

    var gettext = l10n.gettext;

    var SafeString = nunjucks.require('runtime').SafeString;
    var filters = nunjucks.require('filters');

    function make_safe(func) {
        return function() {
            return new SafeString(func.apply(this, arguments));
        };
    }

    function safe_filter(name, func) {
        filters[name] = make_safe(func);
    }

    filters.extend = function(base, kwargs) {
        delete kwargs.__keywords;
        return _.extend(base, kwargs);
    };

    filters.urlparams = utils.urlparams;
    filters.urlunparam = utils.urlunparam;

    safe_filter('nl2br', function(obj) {
        if (typeof obj !== 'string') {
            return obj;
        }
        return obj.replace(/\n/g, '<br>');
    });

    safe_filter('make_data_attrs', function(obj) {
        return _.pairs(obj).map(function(pair) {
            return 'data-' + utils.escape_(pair[0]) + '="' + utils.escape_(pair[1]) + '"';
        }).join(' ');
    });

    safe_filter('external_href', function(obj) {
        return 'href="' + utils.escape_(obj) + '" target="_blank"';
    });

    filters.translate = utils.translate;

    filters.numberfmt = function(num) {
        if (typeof num === 'number' && num.toLocaleString) {
            return num.toLocaleString();
        }
        return num;
    };

    filters.date = function(date, format, time) {
        if (!date) {
            return '';
        }
        var orig_date = date;
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        if (format) {
            return formatDateTime(date, format, time);
        }
        var dateStr = date.toLocaleString();
        if (dateStr === 'Invalid Date') {
            console.warn('Invalid date: ', orig_date);
            return '';
        } else {
            return dateStr;
        }
    };

    filters.datetime = function(date, format, time) {
        return filters.date(date, format, true);
    }

    var monthNames = [
        gettext('January'),
        gettext('February'),
        gettext('March'),
        gettext('April'),
        gettext('May'),
        gettext('June'),
        gettext('July'),
        gettext('August'),
        gettext('September'),
        gettext('October'),
        gettext('November'),
        gettext('December')
    ];

    function formatDateTime(date, format, time) {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        var d = {
            'B': function() { return monthNames[date.getMonth()]; },
            'MM': function() { return month.toString(); },
            'yyyy': function() { return year.toString(); },
            'yy': function() { return year.toString().substr(2, 2); },
            'dd': function() { return day.toString(); },
            't': function() { return hours > 11 ? gettext('pm') : gettext('am'); },
            'T': function() { return hours > 11 ? gettext('PM') : gettext('AM'); },
            'HH': function() { return hours.toString(); },
            'hh': function() { if (hours > 12) { hours -= 12; } if (hours === 0) { hours = 12; } return hours.toString(); },
            'mm': function() { return minutes.toString().replace(/^(\d)$/, '0$1'); },
            'ss': function() { return seconds.toString().replace(/^(\d)$/, '0$1'); }
        };

        format = (time ? 'datetime-' : 'date-') + format;

        switch (format) {
            case 'datetime-short':
                return d.MM() + '/' + fmt.dd() + '/' + d.yyyy() + ' ' +
                       d.HH() + ':' + fmt.mm() + ':' + d.ss();
            case 'datetime-long':
                return d.B() + ' ' + d.dd() + ', ' + d.yyyy() + ' ' +
                       d.HH() + ':' + d.mm() + ':' + d.ss();
            case 'date-short':
                return d.MM() + '/' + d.dd() + '/' + d.yyyy();
            case 'date-long':
                return d.B() + ' ' + d.dd() + ', ' + d.yyyy();
        }
    }

    filters.filter = function(list, kwargs) {
        var output = [];
        outer:
        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            inner:
            for (var prop in kwargs) {
                if (!kwargs.hasOwnProperty(prop) || prop === '__keywords') continue inner;
                if (!(prop in val)) continue outer;
                if (Array.isArray(kwargs[prop]) ?
                    kwargs[prop].indexOf(val[prop]) === -1 :
                    val[prop] !== kwargs[prop]) continue outer;
            }
            output.push(val);
        }
        return output;
    };

    // Credit to ngoke and potch.
    filters.hex2rgba = function(hex, o) {
        hex = parseInt(hex.substring(hex[0] == '#' ? 1 : 0), 16);
        return 'rgba(' +
            (hex >> 16) + ',' +
            ((hex & 0x00FF00) >> 8) + ',' +
            (hex & 0x0000FF) + ',' + o + ')';
    };

    function gravatar(email, opts) {
        opts = _.extend({
            size: 64,
            rating: '',
            image: '',
            secure: false
        }, opts);

        var url = opts.secure ? 'https://secure.gravatar.com/avatar/' : 'http://www.gravatar.com/avatar/';

        var params = {};
        if (opts.size) {
            params.s = opts.size;
        }
        if (opts.rating) {
            params.r = opts.rating;
        }
        if (opts.image) {
            params.d = encodeURIComponent(opts.image);
        }

        var md5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

        return utils.urlparams(url + md5(email) + '.jpg',  params);
    }

    safe_filter('stringify', JSON.stringify);

    // add slashes where needed, ie. "What's up" -> "What\'s up"
    function addSlashes(str) {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }

    safe_filter('safeurl', function(obj) {
        if (typeof obj !== 'string') {
            return obj;
        }
        return addSlashes(obj);
    });

    filters.format = require('format').format;
    filters.sum = function(obj) {
        return obj.reduce(function(mem, num) {return mem + num;}, 0);
    };

    // The exposed user object should know nothing of tokens.
    var user = require('user');
    var userobj = {
        get_setting: user.get_setting,
        get_settings: function() {
            return _.clone(user.get_settings());
        },
        get_permission: user.get_permission,
        logged_in: user.logged_in
    };

    // Functions provided in the default context.
    var helpers = {
        api: require('urls').api.url,
        apiParams: require('urls').api.params,
        url: require('urls').reverse,
        media: require('urls').media,

        _: make_safe(gettext),
        _plural: make_safe(l10n.ngettext),
        format: require('format').format,
        settings: require('settings'),
        user: userobj,

        escape: utils.escape_,
        len: function(x) {return x ? x.length || 0 : 0;},
        max: Math.max,
        min: Math.min,
        range: _.range,
        identity: function(obj) {
            if ('__keywords' in obj) delete obj.__keywords;
            return obj;
        },
        gravatar: gravatar,

        navigator: window.navigator,
        screen: window.screen,
        // TODO: Pull the default value from settings.
        language: window.navigator.l10n ? window.navigator.l10n.language : 'en-US'
    };

    // Put the helpers into the nunjucks global.
    var globals = nunjucks.require('globals');
    for (var i in helpers) {
        if (helpers.hasOwnProperty(i)) {
            globals[i] = helpers[i];
        }
    }

    return helpers;
});
