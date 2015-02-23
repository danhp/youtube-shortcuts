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
        default:
            break;
    }
}

function focusPlayer(){
    // Focus the player
}
