(function () {

var $doc = $(document);
var $body = $(document.body);
var $main = $('main');

var utils = {};

utils.escape = function (string) {
  if (!string) {
    return string;
  }
  return string.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/'/g, '&#39;')
               .replace(/"/g, '&#34;');
};

var RE_TAGS = /input|keygen|meter|option|output|progress|select|textarea/i;

utils.fieldFocused = function (string) {
  function fieldFocused(e) {
    return RE_TAGS.test(e.target.nodeName);
  }
};


function Modal(opts) {
  // Create properties for `id`, `title`, and `content`.
  Object.keys(opts).forEach(function (key) {
    this[key] = opts[key];
  }, this);
}

Modal.closeAll = function () {
  // Close any open modal.
  $('.md-show').removeClass('md-show');
  $('.overlayed').removeClass('overlayed');
};

Modal.injectOverlay = function () {
  // Inject the overlay we use for overlaying it behind modals.
  // TODO: Disable `overflow-y` on `body` when a modal is opened.
  if (!document.querySelector('.md-overlay')) {
    $('<div class="md-overlay"></div>').appendTo($body);
  }
};

Modal.prototype.html = function () {
  return (
    '<div class="md-modal md-effect-1" id="modal-' + this.id + '">' +
      '<div class="md-content">' +
        '<h3>' + utils.escape(this.title) + '</h3> ' +
        '<a class="md-close" title="Close"><span><div>Close</div></span></a>' +
        '<div>' + this.content + '</div>' +
      '</div>' +
    '</div>'
  );
};

Modal.prototype.inject = function () {
  Modal.injectOverlay();

  var $modal = $(this.html());
  $modal.appendTo($body);
  $body.addClass('overlayed');
  return $modal[0];
};


function User(opts) {
  this.data = opts;

  // Note: even if the user manipulates these values, user would be denied by
  // the server to make API calls.
  this.authenticated = false;
}

User.prototype.authenticate = function () {
  // TODO: Talk to API to make sure data is sane.
  console.log('User.authenticate');
  user.authenticated = true;
};

User.prototype.save = function () {
  console.log('User.save');
  localStorage.galaxy_user = JSON.stringify(this.data);
};


var authForm = (
  '<form class="auth-form">' +
    '<label for="username">Username</label>' +
    '<input type="text" id="username" name="username" placeholder="Choose a username">' +
  '</form>'
);


function authenticate() {
  console.log('galaxy.authenticate');

  if (localStorage.galaxy_user) {
    user = new User(JSON.parse(localStorage.galaxy_user));
    user.authenticate();
    return;
  }

  var authModal = new Modal({
    id: 'auth',
    title: 'Sign in',
    content: authForm
  }).inject();

  setTimeout(function () {
    // `setTimeout` for the fancy effect.
    authModal.classList.add('md-show');
  }, 150);
}


$body.on('click', '.md-close, .md-overlay', function (e) {
  e.stopPropagation();
  Modal.closeAll();
}).on('keyup', function (e) {
  if (utils.fieldFocused(e)) {
    return;
  }
  if (e.keyCode === 27) {
    Modal.closeAll();
  }
}).on('submit', '.auth-form', function (e) {
  e.preventDefault();

  // Create a new user and save locally.
  user = new User({
    username: e.target.elements[0].value,
  });
  user.authenticate();
  user.save();
});


if (!('game' in window)) {
  window.galaxy = {
    authenticate: authenticate
  };
}

})();
