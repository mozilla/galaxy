define('filters',
       ['nunjucks'],
       function(nunjucks) {

    var filters = nunjucks.require('filters');

    filters.safeurl = function(obj) {
        if (typeof obj !== 'string') {
            return obj;
        }

        // add slashes where needed, ie. "What's up" -> "What\'s up"
        function addSlashes(str) {
            return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        }
        return addSlashes(obj);
    }
});
