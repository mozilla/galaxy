(function () {
    // importScripts('lunr.js');

    var itemIndex;
    var allItems;
    var refKey;

    function index(data) {
        // Define fields to index in lunr.
        refKey = data.ref || '_id';
        itemIndex = lunr(function() {
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
        var rawItems = JSON.parse(this.responseText);
        allItems = [];

        rawItems.forEach( function (item) {
            allItems[item[refKey]] = item;
            itemIndex.add(item);
        });

        postMessage({type: 'indexed'});
    }

    function search(query) {
        var results;

        if (!query) {
            results = allItems;
        } else {
            results = itemIndex.search(query).map(function (v) {
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
})();
