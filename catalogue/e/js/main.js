(function () {

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

  function updatePlayersLists() {
    console.log('Updating the lists of players for each game');

    var gamesPlayed = JSON.parse(localStorage.galaxy_gamesPlayed || '{}');
    var gamesPlaying = JSON.parse(localStorage.galaxy_gamesPlaying || '{}');

    var gameFaces = JSON.parse(localStorage.galaxy_gameFaces || '{}');

    $('.game[data-game]').each(function () {
      var $this = $(this);
      var slug = $this.data('game');

      // TODO: We should normalise this in `localStorage`, but let's not change
      // format until we know what we want to render on the UI.

      var onlinePlayersObj = gamesPlaying[slug] || {};
      var allPlayersObj = gamesPlayed[slug] || {};

      var onlinePlayers = Object.keys(onlinePlayersObj);
      var offlinePlayers = Object.keys(allPlayersObj).map(function (player) {
        if (!(player in onlinePlayersObj)) {
          return player;
        }
      }).filter(function (player) {
        return typeof player !== 'undefined';
      });

      // Add the "Online" players list.
      // TODO: Make this update in real time using WebSockets.
      if (onlinePlayers.length) {
        var playersHTML = '';
        onlinePlayers.forEach(function (player) {
          playersHTML += '<li>';
          if (player in gameFaces) {
            // TODO: Use real URLs since these are not safe (since from `localStorage`).
            playersHTML += '<div class="gameface" style="background-image:url(' +
              gameFaces[player] + ')"></div>';
          }
          playersHTML += utils.escape(player) + '</li>\n';
        });

        var templateHTML = $('#online-players').html().replace('{players}', playersHTML);
        if ($this.find('.details .online-players').length) {
          // TODO: Instead of replacing the entire section, add/remove the
          // necessary ones. (React is starting to sound like a good idea.)
          $this.find('.details .online-players').replaceWith(templateHTML);
        } else {
          $this.find('.details').append(templateHTML);
        }
      } else if ($this.find('.details .online-players').length) {
        // Again. This is a hack.
        $this.find('.details .online-players').remove();
      }

      // Add the "Offline" players list.
      // TODO: Make this update in real time using WebSockets.
      if (offlinePlayers.length) {
        var playersHTML = '';
        offlinePlayers.forEach(function (player) {
          playersHTML += '<li>';
          if (player in gameFaces) {
            // TODO: Use real URLs since these are not safe (since from `localStorage`).
            playersHTML += '<div class="gameface" style="background-image:url(' +
              gameFaces[player] + ')"></div>';
          }
          playersHTML += utils.escape(player) + '</li>\n';
        });

        var templateHTML = $('#offline-players').html().replace('{players}', playersHTML);
        if ($this.find('.details .offline-players').length) {
          $this.find('.details .offline-players').replaceWith(templateHTML);
        } else {
          $this.find('.details').append(templateHTML);
        }
      } else if ($this.find('.details .offline-players').length) {
        $this.find('.details .offline-players').remove();
      }
    });
  }

  updatePlayersLists();

  // Because the Page Visibility API is 💩, let's use `deviceorientation` for
  // Chrome, `focus` for Firefox. Polyfill coming soon.
  window.addEventListener('deviceorientation', updatePlayersLists);
  window.addEventListener('focus', updatePlayersLists);

})();
