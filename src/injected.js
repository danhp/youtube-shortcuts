document.addEventListener("keydown", checkShortcuts);

const options = ['focus', 'subbox', 'user', 'like', 'dislike', 'subscribe', 'playlist', 'info',
    'listDown', 'listUp', 'tabLeft', 'tabRight', 'dismissList', 'dismissVideo'];

// LIST NAVIGATION HELPER
const selector = "div#dismissable ytd-thumbnail:not(.ytd-compact-video-renderer) a:nth(*)";
const selector_all = selector.replace(':nth(*)', '');

var previousSelection = null;
var idx = -1;


function checkShortcuts(event) {
  var focus = document.activeElement;
  if (focus.nodeName == "INPUT" || focus.nodeName == "TEXTAREA")
    return;

  chrome.storage.sync.get(null, o => {
    if (event.key == 'Escape') {
      unfocus();
      return;
    }

    var i = 0;
    for (i = 0; i < options.length; i++) {
      if (event.keyCode == o[options[i]] &&
          event.metaKey == o["meta" + options[i]] &&
          event.ctrlKey == o["ctrl" + options[i]] &&
          event.altKey == o["meta" + options[i]] &&
          event.shiftKey == o["shift" + options[i]]) {
        functions[options[i]]();
        break;
      }
    }
  });
}

var functions = {
  subbox() {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  },
  user() {
    const link = document.querySelectorAll('div#top-row ytd-video-owner-renderer a')[0];
    if (link.href) {
      // Go to user page from the video page.
      window.location.href = link.href + '/videos';
    } else {
      // Go to user from list entry
      var userList = document.querySelectorAll('#byline a');
      window.location.href = userList[idx].href + '/videos';
    }
  },
  focus() {
    document.activeElement.blur();
    const mp = document.getElementById("movie_player");
    if (mp) {
      mp.focus();
      window.scrollTo(0,0);
    }
  },

  // VIDEO PAGE SHORTCUTS
  like() {
    const buttons = $('div#top-level-buttons ytd-toggle-button-renderer').children();
    buttons[0].click();
  },
  dislike() {
    const buttons = $('div#top-level-buttons ytd-toggle-button-renderer').children();
    buttons[1].click();
  },
  subscribe() {
    const button = $('paper-button.ytd-subscribe-button-renderer');
    button[0].click();
  },
  playlist() {
    const buttons = $('div#top-level-buttons ytd-button-renderer').children();
    buttons[0].click();
  },
  info() {
    $('#more').is(':hidden') ? $('#less')[0].click() : $('#more')[0].click();
  },

  // List navigation shortcuts
  listDown() {
    if (idx < $(selector_all).length - 1) {
      idx++;
      select(true);

      if (idx == $(selector_all).length - 2)
        $(".yt-uix-load-more").click();
    }
  },
  listUp() {
    if (idx > 0) {
      idx--;
      select(false);
    }
  },
  tabLeft() {
    if (localStorage.tidx < $(tab_selector_all).length - 1) {
      var link = $(tab_selector.replace('*', localStorage.tidx));
      location.href = link.attr('href');
    }
  },
  tabRight() {
    if (localStorage.tidx > 0) {
      localStorage.tidx--;
      var link = $(tab_selector.replace('*', localStorage.tidx));
      location.href = link.attr('href');
    }
  },
  dismissList() {
    $(".ytd-thumbnail-overlay-resume-playback-renderer").closest('ytd-grid-video-renderer').fadeOut();
  },
  dismissVideo() {
    var selector = ".dismiss-menu-choice:nth(*)"
      $(selector.replace('*', idx)).click();
  }
}

function unfocus() {
  document.activeElement.blur();
  var b = document.getElementById("movie_player");
  b.blur();
}

// Fixes the index if the elements is hidden.
var select = (down) => {
  var saved = idx;
  var check = true;
  while (check) {
    var link = $(selector.replace('*', idx));
    if ($(link).is(":hidden")) {
      if (down) {
        if (idx >= $(selector_all).length-2) {
          $(".yt-uix-load-more").click();
        }
        idx++;
      } else {
        if (idx >= 1) {
          idx--;
        } else {
          idx = saved + 1;
          return;
        }
      }
    } else {
      check = false
    }
  }

  if (previousSelection) {
    if (link.get()[0] == previousSelection) {
      return;
    }
    $(previousSelection).css('background-color', 'inherit');
  }

  link.css('background-color', '#dce1eb');
  link.focus();
  previousSelection = link.get()[0];
};

// NAV BAR SHORTCUTS HELPER
var tab_selector = ".yt-uix-button-epic-nav-item:nth(*)";
var tab_selector_all = tab_selector.replace(':nth(*)', '');

computeIndex();
function computeIndex() {
  var s = ".appbar-nav-menu";
  var i = 0;
  $(s).children().children().each(() => {
    if ($(this)[0].localName == "h2") {
      localStorage.tidx = i;
      return;
    } else {
      i++;
    }
  });
}

// LINK OPENING SHORTCUTS
// In case selection isn't in focus.
key('return', () => {
  if (idx <= -1) return;

  var link = $(selector.replace('*', idx));
  location.href = link.attr('href');
});

// Open link in a new tab
key('shift+return', e => {
  // Prevent the chrome global default
  document.activeElement.blur();

  if (idx <= -1) return;
  var link = $(selector.replace('*', idx));
  var test = link.attr('href');
  if (test){
    var json = {
      requestType: 'openLinkNewTab',
      linkUrl: test
    };
    chrome.runtime.sendMessage(json);
  }
});

// SHORTCUT MODAL
// Inject the shortcut list.
$.get(chrome.extension.getURL('/popup.html'), (data) => {
  $(data).appendTo('body');
  correctListing();
});

key('shift+/', e => {
  jQuery.facebox({ div: '#shortcuts'  });
});

function correctListing() {
  var key;
  for (var i = 0; i < options.length; i++) {
    key = setKey(options[i]);
  }
}

function setKey(key) {
  chrome.storage.sync.get(null, o => {
    var meta = o['meta' + key];
    var ctrl = o['ctrl' + key];
    var alt = o['alt' + key];
    var shift = o['shift' + key];
    var code = o[key];

    if(ctrl || alt || meta || shift || code) {
      var result = '';
      if(meta) result += 'Cmd ';
      if(ctrl) result += 'Ctrl ';
      if(alt) result += 'Alt ';
      if(shift) result += 'Shift ';
      result += translate(code);
      document.getElementById(key).innerHTML = result;

    } else {
      document.getElementById(key).innerHTML = 'disabled';
    }
  });
}

function translate(code) {
  var result = '';
  if(code>=48 && code<=90) {
    result += String.fromCharCode(code).toLowerCase();
  } else if(code==37) {
    result += 'Left';
  } else if(code==38) {
    result += 'Up';
  } else if(code==39) {
    result += 'Right';
  } else if(code==40) {
    result += 'Down';
  } else if(code==188) {
    result += ',';
  } else if(code==190) {
    result += '.';
  } else if(code==191) {
    result += '/';
  } else if(code==186) {
    result += ';';
  } else if(code==222) {
    result += '\'';
  } else if(code==219) {
    result += '[';
  } else if(code==221) {
    result += ']';
  } else if(code==220) {
    result += '\\';
  } else if(code==192) {
    result += '`';
  } else if(code==27) {
    result += 'Esc';
  } else if(code==32) {
    result += 'Space';
  } else if(code==13) {
    result += 'Enter';
  } else if(code==8) {
    result += 'Backspace';
  } else if(code==9) {
    result += 'Tab';
  } else if(code==20) {
    result += 'Caps Lock';
  } else if(code==187) {
    result += '=';
  } else if(code==189) {
    result += '-';
  } else if(code != 91 && code != 93 && !(code >= 16 && code <= 19)) {
    result += '[' + code + ']';
  }
  return result;
}
