casper.test.begin('Homepage Test', 1, function suite(test) {
    casper.start("http://0.0.0.0:8675", function() {
        test.assertTitle("Mozilla Galaxy", "Galaxy homepage title is the one expected");
    });

    // TODO: add other elements from mockup

    casper.run(function() {
        test.done();
    });
});