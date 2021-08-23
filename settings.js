let uiLink = document.getElementById('ui_toggle_link');
let mainUI = document.getElementById('main_ui');
let settingsUI = document.getElementById('settings_ui');
let appClientId = document.getElementById('app_clientid');
let appClientSecret = document.getElementById('app_clientsecret');

var storage = chrome.storage.local;

uiLink.addEventListener('click', function (e) {
    if(uiLink.innerHTML == "settings") {
        toggleToSettings();
    } else {
        toggleToMainUI();
    }
});

document.querySelectorAll('input[name="execution_mode"]').forEach((elem) => {
    elem.addEventListener("click", function(event){
        var mode = event.target.value;
        handleMode(mode);
    });
});

appClientId.addEventListener("change", function(e){
    storage.set({'custom_clientid': appClientId.value});
});

appClientSecret.addEventListener("change", function(e){
    storage.set({'custom_clientsecret': appClientSecret.value});
});

document.getElementById("description_user").onclick = descriptionUser;
document.getElementById("description_app").onclick = descriptionApp;

function handleMode(mode) {
    switch(mode) {
        
        case "app":
            toggleToCustom();
            break;
        case "user":
        default:
            toggleToBuiltIn();
            break;
    }
}

function toggleToSettings() {
    storage.get('mode', function (result) {
        handleMode(result.mode);
    });
    uiLink.innerHTML = "back";
    mainUI.setAttribute("style", "display: none;");
    settingsUI.setAttribute("style", "");
}

function toggleToMainUI() {
    uiLink.innerHTML = "settings"
    mainUI.setAttribute("style", "");
    settingsUI.setAttribute("style", "display: none;");
}

function toggleToBuiltIn() {
    storage.set({'mode': 'user'});
    document.getElementById('user').checked = true;
    var all = document.getElementsByClassName('custom_settings');
    for (var i = 0; i < all.length; i++) {
        all[i].setAttribute('style', 'display: none;');
    }
}

function toggleToCustom() {
    storage.set({'mode': 'app'});
    document.getElementById('app').checked = true;
    storage.get('custom_clientid', function (result) {
        if (result != undefined && result.custom_clientid != undefined) {
            appClientId.value = result.custom_clientid;
        }
    });
    storage.get('custom_clientsecret', function (result) {
        if (result != undefined && result.custom_clientsecret != undefined) {
            appClientSecret.value = result.custom_clientsecret;
        }
    });
    var all = document.getElementsByClassName('custom_settings');
    for (var i = 0; i < all.length; i++) {
        all[i].setAttribute('style', '');
    }
}

function descriptionUser() {
    alert("The built-in user execution mode is intended to maintain a frictionless user experience, now compatible with Twitch's Helix API. A twitch account has been created for use with this extension. A refresh token has been hardcoded in this extension, and refresh requests are sent to twitchtokengenerator.com to get new access tokens as needed.");
}

function descriptionApp() {
    alert("The custom app execution mode allows the user to provide a client id and client secret obtained from the TwitchDev dashboard (dev.twitch.tv). These credentials will be used to generate an app access token that will then be used to call Twitch's Helix API.");
}