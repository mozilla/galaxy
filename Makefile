DIR=src/functional-test/

test:
	casperjs test $(DIR)homepage.js
	casperjs test $(DIR)game-detail-page.js