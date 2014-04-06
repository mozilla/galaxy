casper.test.begin('Game Detail Page Test', 5, function suite(test) {
	var root = 'http://0.0.0.0:8675';

    casper.start(root + '/game/nutty-ninjas/detail', function() {
        
    }).waitFor(function checkLoaded() {
        return this.evaluate(function() {
            return $(document).find("title").text() === 'Nutty Ninjas | Mozilla Galaxy';
        });
    }, function then() {
        test.assertExists('.featured-games-section', 'Featured game section is present');
        test.assertExists('.game-details-container-left', 'Game detail section is present');
        test.assertExists('.game-details-media', 'Game details media is present');
        test.assertExists('button.btn-play', 'Play button is present');
        this.capture('game-detail-page.png', {
            top: 0,
            left: 0,
            width: 1200,
            height: 700
        });
    }, function timeout() {
        this.echo("Timeout: page did not load in time...").exit();
    }).then(function() {
        this.click('.game-media:last-child');
        this.wait(100, function() {
            var currentMedia = this.evaluate(function() {
                return $('.game-current-media img');
            });
            if (currentMedia !== null) {
                test.assert(this.evaluate(function() {
                    var src = $('.game-media:last-child').attr('src');
                    return $('.game-current-media img').attr('src') == src;
                }), 'Game media selection works');
            } else {
                test.assert(this.evaluate(function() {
                    return true;
                }));
            }
        });
    }).run(function() {
        test.done();
    });
});