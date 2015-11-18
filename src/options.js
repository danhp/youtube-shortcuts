var version = '1.2.0';

var options = ['focus', 'subbox', 'user', 'like', 'dislike', 'subscribe', 'playlist', 'info',
               'listDown', 'listUp', 'tabLeft', 'tabRight', 'dismissList', 'dismissVideo'];
var eventList = new Array(options.length);

function update() {
    localStorage.version = version;
}

window.addEventListener('load', function(event){
    init();
}, false);

function init() {
    for (var i = 0; i < eventList.length; i++) {
        (function(i) {
            document.getElementById(options[i]).addEventListener('keydown', function(e) {
                eventList[i] = e;
                updateKeyChoice(e);
            });
        }(i))
    }

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

    for (var i = 0; i < options.length; i++) {
        initKey(options[i]);
    }
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
            if(meta) result += 'Cmd + ';
            if(ctrl) result += 'Ctrl + ';
            if(alt) result += 'Alt + ';
            if(shift) result += 'Shift + ';

            result += translate(code);

            document.getElementById(key).value = result;
        } else {
            document.getElementById(key).value = 'disabled';
        }
    });
}

function updateKeyChoice(event) {
    var result = '';
    if(event.metaKey) result += 'Cmd + ';
    if(event.ctrlKey) result += 'Ctrl + ';
    if(event.altKey) result += 'Alt + ';
    if(event.shiftKey) result += 'Shift + ';

    result += translate(event.keyCode);

    event.target.value = result;
    event.preventDefault();
}

function saveKeys() {
    for (var i = 0; i < options.length; i++) {
        if (eventList[i]) {
            setData(options[i], eventList[i]);
        }
    }
}

function store(key, value) {
    var obj = {};
    obj[key] = value;

    chrome.storage.sync.set(obj)
}

function setData(name, e) {
    store(name, e.keyCode);
    store("meta" + name, e.metaKey);
    store("ctrl" + name, e.ctrlKey);
    store("alt" + name, e.altKey);
    store("shift" + name, e.shiftKey);
}

function setDefault(key, value) {
    store(key, value);
    store("meta" + key, false);
    store("ctrl" + key, false);
    store("alt" + key, false);
    store("shift" + key, false);
}

function resetKeys() {
    setDefault("focus", 190);
    setDefault("subbox", 72);
    setDefault("user", 85);
    setDefault("like", 65);
    setDefault("dislike", 90);
    setDefault("subscribe", 83);
    setDefault("playlist", 80);
    setDefault("info", 79);
    setDefault("listDown", 74);
    setDefault("listUp", 75);
    setDefault("tabLeft", 219);
    setDefault("tabRight", 221);
    setDefault("dismissList", 88);
    setDefault("dismissVideo", 81);

    for (var i = 0; i < options.length; i++) {
        initKey(options[i]);
    }
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

