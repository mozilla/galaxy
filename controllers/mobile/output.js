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
  var deviceDir = document.getElementById('deviceDir');
  var turn = document.getElementById('turn');
  var turnDir = document.getElementById('turnDir');

  function update() {
    accelerate.innerHTML = state.accelerate;
    alpha.innerHTML = state.alpha;
    beta.innerHTML = state.beta;
    gamma.innerHTML = state.gamma;
    deviceDir.innerHTML = state.deviceDir;
    turn.innerHTML = state.turn;
    turnDir.innerHTML = state.turnDir;
  }

})();
