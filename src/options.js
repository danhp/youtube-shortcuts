var version = '0.1';
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
    var ctrl = localStorage['ctrl' + key];
    var alt = localStorage['alt' + key];
    var meta = localStorage['meta' + key];
    var shift = localStorage['shift' + key];
    var code = localStorage[key];

    if(ctrl && alt && shift && code) {
        var result = '';
        if(meta==='true') result += 'Cmd + ';
        if(ctrl==='true') result += 'Ctrl + ';
        if(alt==='true') result += 'Alt + ';
        if(shift==='true') result += 'Shift + ';
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
        } else {
            result += '[' + code + ']';
        }
        document.getElementById(key).value = result;
    } else {
        document.getElementById(key).value = 'disabled';
    }
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
    } else {
        result += '[' + event.keyCode + ']';
    }

    event.target.value = result;
    event.preventDefault();
}

function saveKeys() {
    var e = tempEvent;

    localStorage.focus = e.keyCode;
    localStorage.metafocus = e.metaKey;
    localStorage.ctrlfocus = e.ctrlKey;
    localStorage.altfocus = e.altKey;
    localStorage.shiftfocus = e.shiftKey;
}

function resetKeys() {
    localStorage.focus = 190;
    localStorage.metafocus = false;
    localStorage.ctrlfocus = false;
    localStorage.altfocus = false;
    localStorage.shiftfocus = false;

    initKey('focus');
}
