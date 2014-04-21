casper.test.begin('Homepage Test', 5, function suite(test) {
    casper.start("http://0.0.0.0:8675", function() {
        test.assertTitle("Mozilla Galaxy", "Galaxy homepage title is the one expected");
    }).waitFor(function checkLoaded() {
    	return this.evaluate(function() {
    		return $('.site-footer') !== null;
    	});
    }, function then() {
    	test.assertExists('.featured-games-section', 'Featured games section is present');
    	test.assertExists('.homepage-content', 'Homepage content is present');
    	test.assertExists('header.site-header', 'Header is present');
    	test.assertExists('footer.site-footer', 'Footer is present');
        this.capture('test-results/homepage.png', {
	        top: 0,
	        left: 0,
	        width: 1200,
	        height: 700
	    });
    }, function timeout() {
    	this.echo("Timeout: page did not load in time...").exit();
    }).run(function() {
        test.done();
    });
});
