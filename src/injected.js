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

        if (event.keyCode == o.like &&
                    event.metaKey == o.metalike &&
                    event.ctrlKey == o.ctrllike &&
                    event.altKey == o.altlike &&
                    event.shiftKey == o.shiftlike) {
            pressLike();
            return;
        }

        if (event.keyCode == o.dislike &&
                    event.metaKey == o.metadislike &&
                    event.ctrlKey == o.ctrldislike &&
                    event.altKey == o.altdislike &&
                    event.shiftKey == o.shiftdislike) {
            pressDislike();
            return;
        }

        if (event.keyCode == o.subscribe &&
                    event.metaKey == o.metasubscribe &&
                    event.ctrlKey == o.ctrlsubscribe &&
                    event.altKey == o.altsubscribe &&
                    event.shiftKey == o.shiftsubscribe ) {
            pressSubscribe();
            return;
        }
    });
}

function goToSubs() {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
}

function goToUser() {
    var link = document.querySelectorAll('.yt-user-photo')[0];
    if (typeof link !== "undefined") {
        // Go to user page from the video page.
        window.location.href = link.href;
    } else {
        // Go to user from list entry
        var userList = document.querySelectorAll('.yt-lockup-byline a');
        window.location.href = userList[idx].href;
    }
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

// LIST NAVIGATION
var selector = "li div div div h3 a:nth(*)";
var selector_all = selector.replace(':nth(*)', '');
var previousSelection = null;

var idx = -1;

var select = function() {
    var link = $(selector.replace('*', idx));
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
    if (idx < $(selector_all).length-1) {
        idx++;
        select();
        if (idx == $(selector_all).length-2) {
            $(".yt-uix-load-more").click();
        }
    }
});

key('k', function() {
    if (idx > 0) {
        idx--;
        select();
    }
});

// NAV BAR SHORTCUTS
var tab_selector = ".yt-uix-button-epic-nav-item:nth(*)";
var tab_selector_all = tab_selector.replace(':nth(*)', '');

computeIndex();
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
    if (localStorage.tidx < $(tab_selector_all).length - 1) {
        var link = $(tab_selector.replace('*', localStorage.tidx));
        location.href = link.attr('href');
    }
});

key('[', function() {
    if (localStorage.tidx > 0) {
        localStorage.tidx--;
        var link = $(tab_selector.replace('*', localStorage.tidx));
        location.href = link.attr('href');
    }
});

// VIDEO PAGE SHORTCUTS
function pressLike() {
    var button = $('.like-button-renderer-like-button');
    click(button);
}
function pressDislike() {
    var button = $('.like-button-renderer-dislike-button');
    click(button);
}
function click(button) {
    if (button[0].classList.contains('hid')) {
        button[1].click();
    } else {
        button[0].click();
    }
}

function pressSubscribe() {
    var buttons = $('.yt-uix-subscription-button');
    if (buttons.length == 1) {
        $('.yt-uix-subscription-button')[0].click();
    }
}

// LINK OPENING SHORTCUTS
// In case selection isn't in focus.
key('return', function() {
    if (idx <= -1) return;
    var link = $(selector.replace('*', idx));
    location.href = link.attr('href');
});

// Open link in a new tab
key('o', function() {
    if (idx <= -1) return;
    var link = $(selector.replace('*', idx));
    var test = link.attr('href');
    if (typeof test !== "undefined"){
        window.open(test);
    }
});
