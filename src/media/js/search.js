

define('search', ['requests', 'urls', 'lunr', 'underscore'], function(requests, urls, lunr, _) {

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

		globalSearch = index;

		requests.get(urls.api.url(data.url)).done(load);
		this.postMessage({type: 'indexed'}, '*');
	}

	function load(items)
	{
		allItems = items;
		items.forEach(function (item) {
			index.add(item);
		});
	}

	function search(query) {
		var results;

		if(!query) {
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
		}, '*');
	}

	var methods = {
		index: index,
		search: search
	};

	addEventListener('message', function(e) {
		console.log(e);
		var method = methods[e.data.type];
		if (method) {
			method(e.data.data);
		}
	}, false);

	return methods;
})

