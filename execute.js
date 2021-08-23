const debug = true;

const hardcodedClientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
const hardcodedRefreshToken = 'w7lwaxc73n49y6etcp2w3o4uipbvcudiqse6zngiybmkstawl9'; // this refresh token with no scopes maps to user 'username_userid_ext', a dedicated user made for use with this extension

var storage = chrome.storage.local;

// getUserId(string, function(string), function(string))
function getUserIdV2(username, callbackSuccess, callbackFailure) {
    getCredentials(
        function(credentials) {
            helixGetUsers(
                credentials, 
                function(userid) {
                    // GetUsers success, update UI
                    callbackSuccess(userid);
                },
                function(message) {
                    // GetUsers failed, update UI
                    callbackFailure(message);
                },
                username
            );
        },
        function(message) {
            // getting credentials failed, update UI
            callbackFailure(message);
        }
    );
}

// getUsername(string, function(string), function(string))
function getUsernameV2(userid, callbackSuccess, callbackFailure) {
    getCredentials(
        function(credentials) {
            helixGetUsers(
                credentials, 
                function(username) {
                    // GetUsers success, update UI
                    callbackSuccess(username);
                },
                function(message) {
                    // GetUsers failed, update UI
                    callbackFailure(message);
                },
                undefined,
                userid
            );
        },
        function(message) {
            // getting credentials failed, update UI
            callbackFailure(message);
        }
    );
}

function helixGetUsers(credentials, callbackSuccess, callbackFailure, username = undefined, userid = undefined) {
    var getUsersUrl = 'https://api.twitch.tv/helix/users';
    if(username == undefined) {
        getUsersUrl += '?id=' + userid;
    } else {
        getUsersUrl += '?login=' + username;
    }
    dbg("helixGetUsers", getUsersUrl);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let json = JSON.parse(req.responseText);
            if (json['data'].length > 0) {
                if(username == undefined) {
                    // return the username
                    dbg("helixGetUsers", "get username success: " + json);
                    callbackSuccess(json['data'][0]['login']);
                } else {
                    // return the userid
                    dbg("helixGetUsers", "get user id success: " + json);
                    callbackSuccess(json['data'][0]['id']);
                }
            } else {
                dbg("helixGetUsers", "user not found");
                callbackFailure("user not found")
            }
        } else if (req.readyState === 4) {
            dbg("helixGetUsers", "get users request failed: " + req.responseText);
            callbackFailure("get users request failed")
        }
    };

    req.open("GET", getUsersUrl, true);
    req.setRequestHeader("Authorization", "Bearer " + credentials['token']);
    req.setRequestHeader("Client-Id", credentials['client_id']);
    req.send(null);
}

function getCredentials(callbackSuccess, callbackFailure) {
    storage.get('mode', function (result) {
        var mode = "user";
        if(result != undefined && result.mode != undefined) {
            mode = result.mode;
        }
        dbg("getCredentials", "mode: " + mode);
        switch(mode) {
            case "app":
                getCredentailsFromCustomApp(
                    function(credentials) {
                        // credentials call successful, return array(client_id, token)
                        dbg("getCredentials", "app success: " + credentials);
                        callbackSuccess(credentials);
                    },
                    function(message) {
                        // credentails call failed, return string("error message")
                        dbg("getCredentials", "app failure: " + message);
                        callbackFailure(message);
                    }
                );
                break;
            case "user":
            default:
                getCredentialsFromUser(
                    function(credentials) {
                        // credentials call successful, return array(client_id, token)
                        dbg("getCredentials", "user success: " + credentials);
                        callbackSuccess(credentials);
                    },
                    function(message) {
                        // credentails call failed, return string("error message")
                        dbg("getCredentials", "user failure: " + message);
                        callbackFailure(message);
                    }
                );
                break;
        }
    });
}

function getCredentialsFromUser(callbackSuccess, callbackFailure) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let json = JSON.parse(req.responseText);
            if(json['success'] == true) {
                // twitchtokengenerator's API indicates request success via 'success', not status codes
                dbg("getCredentialsFromUser", "success: " + json);
                callbackSuccess({client_id: hardcodedClientId, token: json['token']});
            } else {
                dbg("getCredentialsFromUser", "error getting access token: " + json["message"]);
                callbackFailure("error getting access token: " + json['message']);
            }
        } else if (req.readyState === 4) {
            // this would indicate a server side error on twitchtokengenerator's side
            dbg("getCredentialsFromUser", "failed to fetch user credentials");
            callbackFailure("failed to fetch user credentials");
        }
    };

    req.open("GET", "https://twitchtokengenerator.com/api/refresh/" + hardcodedRefreshToken, true);
    req.send(null);
}

function getCredentailsFromCustomApp(callbackSuccess, callbackFailure) {
    getCustomAppStorage(
        function(customapp_storage) {
            var clientId = customapp_storage['client_id'];
            var clientSecret = customapp_storage['client_secret'];
            dbg("getCredentialsFromCustomApp", "clientId: " + clientId);
            dbg("getCredentialsFromCustomApp", "clientSecret: " + clientSecret);
            getCredentialsFromCustomAppCredentials(
                clientId,
                clientSecret,
                function(token) {
                    dbg("getCredentialsFromCustomApp", "success");
                    var result = {client_id: clientId, token: token};
                    dbg("getCredentialsfromCustomApp", result);
                    callbackSuccess(result);
                },
                function(message) {
                    dbg("getCredentialsFromCustomApp", "failed: " + message);
                    callbackFailure(message);
                }
            );
        },
        function(message) {
            dbg("getCredentialsFromCustomApp", "failed: " + message);
            callbackFailure(message);
        }
    )
}

function getCredentialsFromCustomAppCredentials(clientId, clientSecret, callbackSuccess, callbackFailure) {
    var url = 'https://id.twitch.tv/oauth2/token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials&scope=';
    dbg("getCredentialsFromCustomAppCredentials", url);
    dbg("getCredentialsFromCustomAppCredentials", "clientId: " + clientId);
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            dbg("getAccessFromCustomAppCredentials", "successful call");
            let json = JSON.parse(req.responseText);
            dbg("getAccessFromCustomAppCredentials", json);
            callbackSuccess(json['access_token']);
        } else if (req.readyState === 4) {
            dbg("getAccessFromCustomAppCredentials", "app client credential flow failed");
            callbackFailure("app client credential flow failed")
        }
    };

    req.open("POST", url, true);
    req.send(null);
}

function getCustomAppStorage(callbackSuccess, callbackFailure) {
    storage.get('custom_clientid', function (storage_clientid) {
        if (storage_clientid != undefined && storage_clientid.custom_clientid != undefined) {
            storage.get('custom_clientsecret', function (storage_clientsecret) {
                if (storage_clientsecret != undefined && storage_clientsecret.custom_clientsecret != undefined) {
                    dbg("getCustomAppStorage", "success");
                    // both async storage get calls succeeded, return array(client_id, client_secret)
                    var result = { client_id: storage_clientid.custom_clientid, client_secret: storage_clientsecret.custom_clientsecret };
                    dbg("getCustomAppStorage", result);
                    callbackSuccess(result);
                } else {
                    dbg("getCustomAppStorage", "failed to get clientsecret from storage");
                    callbackFailure("failed to get clientsecret from storage");
                }
            });
        } else {
            dbg("getCustomAppStorage", "failed to get clientid from storage");
            callbackFailure("failed to get clientid from storage");
        }
    });
}

function dbg(section, msg) {
    if(debug) {
        console.log("[" + section + "] " + msg);
    }
}