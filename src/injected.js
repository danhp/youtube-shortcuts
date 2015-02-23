document.onkeydown = checkShortcuts;

function checkShortcuts(event) {
    var focus = document.activeElement;
    if (focus.nodeName == "INPUT" || focus.nodeName == "TEXTAREA") {
        return;
    }

    switch(event.keyCode){
        case 190:
            focusPlayer();
            break;
        case 27:
            unfocusPlayer();
            break;
        default:
            break;
    }
}

function focusPlayer() {
    var mp = document.getElementById("movie_player");
    mp.focus();
}

function unfocusPlayer() {
    var b = document.getElementById("movie_player");
    b.blur();
}
