define('worker', function () {
	var worker = new Worker('../../media/js/lib/search.js');
	return worker;
});