document.addEventListener("keydown", checkShortcuts);

function checkShortcuts(event) {
    var focus = document.activeElement;
    if (focus.nodeName == "INPUT" || focus.nodeName == "TEXTAREA") {
        return;
    }

    chrome.storage.sync.get(null, function(o) {
        if (event.keyCode == 27) {
            unfocus();
            return;
        }

        if (event.keyCode == o.subbox &&
                    event.metaKey == o.metasubbox &&
                    event.ctrlKey == o.ctrlsubbox &&
                    event.altKey == o.altsubbox &&
                    event.shiftKey == o.shiftsubbox) {
            goToSubs();
            return;
        }

        if (event.keyCode == o.focus &&
                    event.metaKey == o.metafocus &&
                    event.ctrlKey == o.ctrlfocus &&
                    event.altKey == o.altfocus &&
                    event.shiftKey == o.shiftfocus) {
            focusPlayer();
            return;
        }

        if (event.keyCode == o.user &&
                    event.metaKey == o.metauser &&
                    event.ctrlKey == o.ctrluser &&
                    event.altKey == o.altuser &&
                    event.shiftKey == o.shiftuser) {
            goToUser();
            return;
        }
    });
}

function goToSubs() {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
}

function focusPlayer() {
    document.activeElement.blur();
    var mp = document.getElementById("movie_player");
    mp.focus();
}

function unfocus() {
    document.activeElement.blur();
    var b = document.getElementById("movie_player");
    b.blur();
}

function goToUser() {
    window.location.href = document.querySelectorAll('.yt-user-photo')[0].href;
}

// LIST NAVIGATION
var selector = "li div div h3 a:nth(*)";
var selector_all = selector.replace(':nth(*)', '');
var previousSelection = null;

if (localStorage.idx) {
    localStorage.idx = -1;
}

var select = function() {
    var link = $(selector.replace('*', localStorage.idx));
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

key('j', function() {
    if (localStorage.idx < $(selector_all).length-1) {
        localStorage.idx++;
        select();
    }
});

key('k', function() {
    if (localStorage.idx > 0) {
        localStorage.idx--;
        select();
    }
});

// NAV BAR SHORTCUTS
var tab_selector = ".yt-uix-button-epic-nav-item:nth(*)";
var tab_selector_all = tab_selector.replace(':nth(*)', '');

function computeIndex() {
    var s = ".appbar-nav-menu";
    var i = 0;
    $(s).children().children().each(function() {
        if ($(this)[0].localName == "h2") {
            localStorage.tidx = i;
        } else {
            i++;
        }
    });
}
key(']', function() {
    computeIndex();
    if (localStorage.tidx < $(tab_selector_all).length - 1) {
        var link = $(tab_selector.replace('*', localStorage.tidx));
        location.href = link.attr('href');
    }
});

key('[', function() {
    computeIndex();
    if (localStorage.tidx > 0) {
        localStorage.tidx--;
        var link = $(tab_selector.replace('*', localStorage.tidx));
        location.href = link.attr('href');
    }
});

// In case selection isn't in focus.
key('return', function() {
    var link = $(selector.replace('*', localStorage.idx));
    location.href = link.attr('href');
});
