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
  var g = document.getElementById('g');
  var turn = document.getElementById('turn');

  function update() {
    accelerate.innerHTML = state.accelerate;
    g.innerHTML = state.g;
    turn.innerHTML = state.turn;
  }

  update();

})();
