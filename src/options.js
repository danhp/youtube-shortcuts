var version = '1.2.0';
var focusKeyEvent;
var subboxKeyEvent;
var userKeyEvent;

function update() {
    localStorage.version = version;
}

window.addEventListener('load', function(event){
    init();
}, false);

function init() {
    document.getElementById('focus').addEventListener('keydown', function(e) {
        focusKeyEvent = e;
        updateKeyChoice('focus', e);
    });

    document.getElementById('subbox').addEventListener('keydown', function(e) {
        subboxKeyEvent = e;
        updateKeyChoice('subbox', e);
    });

    document.getElementById('user').addEventListener('keydown', function(e) {
        userKeyEvent = e;
        updateKeyChoice('user', e);
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
    initKey('subbox');
    initKey('user');
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

            result += translate(code);

            document.getElementById(key).value = result;
        } else {
            document.getElementById(key).value = 'disabled';
        }
    });
}

function updateKeyChoice(key, event) {
    var result = '';
    if(event.metaKey) result += 'Cmd + ';
    if(event.ctrlKey) result += 'Ctrl + ';
    if(event.altKey) result += 'Alt + ';
    if(event.shiftKey) result += 'Shift + ';

    result += translate(event.keyCode);

    event.target.value = result;
    event.preventDefault();
}

function translate(code) {
    var result = '';

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
    } else if(code !=91 && code !=93 && !(code >=16 && code <=19)) {
        result += '[' + code + ']';
    }

    return result;
}

function saveKeys() {
    var e = focusKeyEvent;

    if (e) {
        chrome.storage.sync.set({'focus': e.keyCode});
        chrome.storage.sync.set({'metafocus': e.metaKey});
        chrome.storage.sync.set({'ctrlfocus': e.ctrlKey});
        chrome.storage.sync.set({'altfocus': e.altKey});
        chrome.storage.sync.set({'shiftfocus': e.shiftKey});
    }

    e = subboxKeyEvent;

    if (e) {
        chrome.storage.sync.set({'subbox': e.keyCode});
        chrome.storage.sync.set({'metasubbox': e.metaKey});
        chrome.storage.sync.set({'ctrlsubbox': e.ctrlKey});
        chrome.storage.sync.set({'altsubbox': e.altKey});
        chrome.storage.sync.set({'shiftsubbox': e.shiftKey});
    }

    e = userKeyEvent;

    if (e) {
        chrome.storage.sync.set({'user': e.keyCode});
        chrome.storage.sync.set({'metauser': e.metaKey});
        chrome.storage.sync.set({'ctrluser': e.ctrlKey});
        chrome.storage.sync.set({'altuser': e.altKey});
        chrome.storage.sync.set({'shiftuser': e.shiftKey});
    }
}

function resetKeys() {
    chrome.storage.sync.set({'focus': 190});
    chrome.storage.sync.set({'metafocus': false});
    chrome.storage.sync.set({'ctrlfocus': false});
    chrome.storage.sync.set({'altfocus': false});
    chrome.storage.sync.set({'shiftfocus': false});

    chrome.storage.sync.set({'subbox': 72});
    chrome.storage.sync.set({'metasubbox': false});
    chrome.storage.sync.set({'ctrlsubbox': false});
    chrome.storage.sync.set({'altsubbox': false});
    chrome.storage.sync.set({'shiftsubbox': false});

    chrome.storage.sync.set({'user': 85});
    chrome.storage.sync.set({'metauser': false});
    chrome.storage.sync.set({'ctrluser': false});
    chrome.storage.sync.set({'altuser': false});
    chrome.storage.sync.set({'shiftuser': false});

    initKey('focus');
    initKey('subbox');
    initKey('user');
}
