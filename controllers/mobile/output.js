(function () {

  var username = 'cvan';
  var controllerRef = new Firebase('https://galaxy-controller.firebaseio.com/' + username);

  var state = {};

  controllerRef.on('value', function (snapshot) {
    var changedPost = snapshot.val();
    state = changedPost;
    update();
  }, function (err) {
    console.log('The read failed: ' + err.code);
  });

  var accelerate = document.getElementById('accelerate');
  var alpha = document.getElementById('alpha');
  var beta = document.getElementById('beta');
  var gamma = document.getElementById('gamma');
  var turn = document.getElementById('turn');
  var dir = document.getElementById('dir');

  function update() {
    accelerate.innerHTML = state.accelerate;
    alpha.innerHTML = state.alpha;
    beta.innerHTML = state.beta;
    gamma.innerHTML = state.gamma;
    dir.innerHTML = state.dir;
    turn.innerHTML = state.turn;
  }

})();
