importScripts('lunr.js');
importScripts('require.js');
importScripts('underscore.js');

var index;
function index(data) {
    // Define fields to index in lunr.
    index = lunr(function() {
        var that = this;
        Object.keys(data.fields).forEach(function(k) {
            that.field(k, data.fields[k]);
        });
        that.ref(data.ref || '_id');
    });

    var xhr = new XMLHttpRequest();
    xhr.onload = load;
    xhr.open('get', data.url, true);
    xhr.send();
}

function load(items) {
    var allItems = JSON.parse(this.responseText);
    _.forEach(allItems, function (item) {
        index.add(item);
    });
    postMessage({type: 'indexed'});
}

function search(query) {
    var results;

    if (!query) {
        results = allItems;
    } else {
        results = index.search(query).map(function (v) {
            return {
                item: v,
                score: v.score
            };
        });
    }

    postMessage({
        type: 'results',
        data: {
            query: query,
            results: results
        }
    });
}

var methods = {
    index: index,
    search: search
};

onmessage = function(e) {
    var method = methods[e.data.type];
    if (method) {
        method(e.data.data);
    }
};