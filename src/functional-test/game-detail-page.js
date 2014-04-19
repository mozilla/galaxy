casper.test.begin('Game Detail Page Test', 8, function suite(test) {
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
        test.assertExists('.btn-play', 'Play button is present');
        test.assertExists('.icon-facebook', 'Facebook share button is present');
        test.assertExists('.icon-twitter', 'Twitter share button is present');
        this.capture('test-results/game-detail-page.png', {
            top: 0,
            left: 0,
            width: 1200,
            height: 700
        });
    }, function timeout() {
        this.echo('Timeout: page did not load in time...').exit();
    }).then(function() {
        // check game media selection
        this.click('.game-media:last-child');
        this.wait(100, function() {
            var currentMedia = this.evaluate(function() {
                return $('.game-current-media img');
            });

            if (currentMedia !== null) {
                test.assert(this.evaluate(function() {
                    var src = $('.game-media:last-child').attr('src');
                    return $('.game-current-media img').attr('src') === src;
                }), 'Game media selection works');
            } else {
                test.assert(true);
            }
        });

        // check game play button
        test.assert(this.evaluate(function() {
            return $('.btn-play').data('appUrl') === 'http://nuttyninjas.com/';
        }), 'Game play button matches');

        // check Facebook share button
        this.click('.icon-facebook');
        this.waitForPopup(/^https:\/\/www\.facebook\.com.*?$/)
            .withPopup(/^https:\/\/www\.facebook\.com.*?$/, function() {
                test.assertUrlMatch(/^.*\/game\/nutty-ninjas\/detail?$/, 'Facebook share button is correct');
            });
        
        // check Twitter share button
        this.click('.icon-twitter');
        this.waitForPopup(/^https:\/\/twitter\.com\/intent\/tweet\?.*?$/)
            .withPopup(/^https:\/\/twitter\.com\/intent\/tweet\?.*?$/, function() {
               test.assertUrlMatch(/^.*\/game\/nutty-ninjas\/detail?$/, 'Twitter share button is correct'); 
            }); 

    }).run(function() {
        test.done();
    });
});