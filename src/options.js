var version = '1.0.0';
var tempEvent;

function update() {
    localStorage.version = version;
}

window.addEventListener('load', function(event){
    init();
}, false);

function init() {
    document.getElementById('focus').addEventListener('keydown', function(e) {
        updateKeyChoice(e);
    });

    document.getElementById('save').addEventListener('click', function() {
        saveKeys();

        var successMessage = document.getElementById('success_message');
        var successTimeout = null;
        clearTimeout(successTimeout);
        successMessage.classList.add('visible');
        successTimeout = setTimeout(function() {
            successMessage.classList.remove('visible');
        }, 3000);
    });

    document.getElementById('reset').addEventListener('click', function() {
        resetKeys();
    });


    if (!localStorage.version) {
        localStorage.version = version;
        resetKeys();
        update();
    }

    if (localStorage.version < version) {
        update();
    }

    initKey('focus');
}

function initKey(key) {
    chrome.storage.sync.get(null, function(o) {
        var meta = o['meta' + key];
        var ctrl = o['ctrl' + key];
        var alt = o['alt' + key];
        var shift = o['shift' + key];
        var code = o[key];

        if(ctrl || alt || meta || shift || code) {
            var result = '';
            if(meta===true) result += 'Cmd + ';
            if(ctrl===true) result += 'Ctrl + ';
            if(alt===true) result += 'Alt + ';
            if(shift===true) result += 'Shift + ';
            if(code>=48 && code<=90) {
                result += String.fromCharCode(code);
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
            } else if(event.keyCode!=91 && event.keyCode!=93 && !(event.keyCode>=16 && event.keyCode<=19)) {
                result += '[' + code + ']';
            }
            document.getElementById(key).value = result;
        } else {
            document.getElementById(key).value = 'disabled';
        }
    });
}

function updateKeyChoice(event) {
    tempEvent = event;

    var result = '';
    if(event.metaKey) result += 'Cmd + ';
    if(event.ctrlKey) result += 'Ctrl + ';
    if(event.altKey) result += 'Alt + ';
    if(event.shiftKey) result += 'Shift + ';
    if(event.keyCode>=48 && event.keyCode<=90) {
        result += String.fromCharCode(event.keyCode);
    } else if(event.keyCode==37) {
        result += 'Left';
    } else if(event.keyCode==38) {
        result += 'Up';
    } else if(event.keyCode==39) {
        result += 'Right';
    } else if(event.keyCode==40) {
        result += 'Down';
    } else if(event.keyCode==188) {
        result += ',';
    } else if(event.keyCode==190) {
        result += '.';
    } else if(event.keyCode==191) {
        result += '/';
    } else if(event.keyCode==186) {
        result += ';';
    } else if(event.keyCode==222) {
        result += '\'';
    } else if(event.keyCode==219) {
        result += '[';
    } else if(event.keyCode==221) {
        result += ']';
    } else if(event.keyCode==220) {
        result += '\\';
    } else if(event.keyCode==192) {
        result += '`';
    } else if(event.keyCode==27) {
        result += 'Esc';
    } else if(event.keyCode==32) {
        result += 'Space';
    } else if(event.keyCode==13) {
        result += 'Enter';
    } else if(event.keyCode==8) {
        result += 'Backspace';
    } else if(event.keyCode==9) {
        result += 'Tab';
    } else if(event.keyCode==20) {
        result += 'Caps Lock';
    } else if(event.keyCode==187) {
        result += '=';
    } else if(event.keyCode==189) {
        result += '-';
    } else if(event.keyCode!=91 && event.keyCode!=93 && !(event.keyCode>=16 && event.keyCode<=19)) {
        result += '[' + event.keyCode + ']';
    }

    event.target.value = result;
    event.preventDefault();
}

function saveKeys() {
    var e = tempEvent;

    chrome.storage.sync.set({'focus': e.keyCode});
    chrome.storage.sync.set({'metafocus': e.metaKey});
    chrome.storage.sync.set({'ctrlfocus': e.ctrlKey});
    chrome.storage.sync.set({'altfocus': e.altKey});
    chrome.storage.sync.set({'shiftfocus': e.shiftKey});
}

function resetKeys() {
    chrome.storage.sync.set({'focus': 190});
    chrome.storage.sync.set({'metafocus': false});
    chrome.storage.sync.set({'ctrlfocus': false});
    chrome.storage.sync.set({'altfocus': false});
    chrome.storage.sync.set({'shiftfocus': false});

    initKey('focus');
}
