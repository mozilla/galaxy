casper.test.begin('Game Detail Page Test', 1, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/game/nutty-ninjas/detail', function() {
        //test.assertTitle('Nutty Ninjas | Mozilla Galaxy', 'Game detail page title is the one expected');
        test.assertExists('featured-games-section', 'Featured game section is present');
        test.assertExists('.game-details-container-left', 'Game detail section is present');
        test.assertExists('.game-details-media', 'Game details media is present');
        test.assertExists('.play', 'Play button is present');
    });

    casper.then(function() {
    	//this.click('game-media-list')
    });

    // TODO: add other elements from mockup

    casper.run(function() {
        test.done();
    });
});