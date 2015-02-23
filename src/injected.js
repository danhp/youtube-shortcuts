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

function focusPlayer() {
    var mp = document.getElementById("movie_player");
    mp.focus();
}

function unfocusPlayer() {
    var b = document.getElementById("movie_player");
    b.blur();
}
