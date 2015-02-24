document.onkeydown = checkShortcuts;

function checkShortcuts(event) {
    var focus = document.activeElement;
    if (focus.nodeName == "INPUT" || focus.nodeName == "TEXTAREA") {
        return;
    }

    chrome.storage.sync.get(null, function(o) {
        if (event.keyCode == 27) {
            unfocusPlayer();
            return;
        }

        if (event.keyCode == o.subbox
                    && event.metaKey == o.metasubbox
                    && event.ctrlKey == o.ctrlsubbox
                    && event.altKey == o.altsubbox
                    && event.shiftKey == o.shiftsubbox) {
            goToSubs();
            return;
        }

        if (event.keyCode == o.focus
                    && event.metaKey == o.metafocus
                    && event.ctrlKey == o.ctrlfocus
                    && event.altKey == o.altfocus
                    && event.shiftKey == o.shiftfocus){
            focusPlayer();
            return;
        }
    });
}

function goToSubs() {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
}
function focusPlayer() {
    var mp = document.getElementById("movie_player");
    mp.focus();
}

function unfocusPlayer() {
    var b = document.getElementById("movie_player");
    b.blur();
}
