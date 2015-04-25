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

// JK NAVIGATION
var selector_all = null;
var selector = "li div div h3 a:nth(*)";
var previousSelection = null;

if (localStorage.idx) {
    localStorage.idx = 0;
}

function setup() {
    selector_all = selector.replace(':nth(*)', '');
    selector = selector;
    select();
}

function active_selection(idx) {
    return selector.replace('*', idx);
}

var select = function() {
    var link = $(active_selection(localStorage.idx));
    console.log(link);
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

setup();

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
