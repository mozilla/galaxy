importScripts('lunr.js');

var index;
var allItems;
var refKey;

function index(data) {
    // Define fields to index in lunr.
    refKey = data.ref || '_id';
    index = lunr(function() {
        var that = this;
        Object.keys(data.fields).forEach(function(k) {
            that.field(k, data.fields[k]);
        });
        that.ref(refKey);
    });

    var xhr = new XMLHttpRequest();
    xhr.onload = load;
    xhr.open('get', data.url, true);
    xhr.send();
}

function load(items) {
    rawItems = JSON.parse(this.responseText);
    allItems = [];

    for(itemId in rawItems)
    {
        item = rawItems[itemId];

        allItems[item[refKey]] = item;
        index.add(item);
    }
    postMessage({type: 'indexed'});
}

function search(query) {
    var results;

    if (!query) {
        results = allItems;
    } else {
        results = index.search(query).map(function (v) {
            return {
                item: allItems[v.ref],
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
