document.getElementById('fetch').addEventListener('click', function () {
	runRoutine();
});

document.getElementById('username').addEventListener('keypress', function(e) {
	var key = e.which || e.keyCode;
    if (key === 13) { 
		runRoutine();
    }
});

document.getElementById('userid').addEventListener('keypress', function(e) {
	var key = e.which || e.keyCode;
    if (key === 13) { 
		runRoutine();
    }
});

function runRoutine() {
    var usernameTB = document.getElementById('username');
	var useridTB = document.getElementById('userid');
	clearError();
	if(usernameTB.value.length > 0 && useridTB.value.length > 0) 
		setError("One of the textboxes must be empty.<br><b>Fetch User ID</b>: Place username in the username box, leave user id box empty.<br><b>Fetch Username</b>: Place user id in the user id box, leave username box empty.");
	else if(usernameTB.value.length > 0)
		request(usernameTB, useridTB, 3, fetchUserId, failedRequest);
	else
		request(useridTB, usernameTB, 5, fetchUsername, failedRequest);
}

function fetchUserId(targetTB, json, username) {
	if("error" in json)
		badRequest("username", username)
	else
		targetTB.value = json['_id'];
}

function fetchUsername(targetTB, json, userid) {
	if("error" in json)
		badRequest("user id", userid)
	else
		targetTB.value = json['name'];
}

function failedRequest() {
	setError("The request you attempted failed! Is Twitch API OK?");
}

function badRequest(type, resource) {
	setError("The " + type + " '" + resource + "' was not valid!");
}

function request(tb, targetTB, apiVersion, callbackSuccess, callbackFailure) {
	var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && (req.status == 200 || req.status == 404 || req.status == 400 || req.status == 422))
            callbackSuccess(targetTB, JSON.parse(req.responseText), tb.value);
		else if(req.readyState == 4)
			callbackFailure();
    }
	
    req.open("GET", "https://api.twitch.tv/kraken/users/" + tb.value, true);
	req.setRequestHeader("Accept", "application/vnd.twitchtv.v" + apiVersion + "+json");
	req.setRequestHeader("Client-ID", "abe7gtyxbr7wfcdftwyi9i5kej3jnq");
    req.send(null);
}

function setError(errorMsg) {
	document.getElementById("error").innerHTML = errorMsg;
	setTimeout(clearError, 10000);
}

function clearError() {
	document.getElementById("error").innerHTML = "";
}