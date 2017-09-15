document.getElementById('username').addEventListener('keypress', function(e) {
	var key = e.which || e.keyCode;
    if (key === 13) { 
		runRoutine("username");
    }
});

document.getElementById('userid').addEventListener('keypress', function(e) {
	var key = e.which || e.keyCode;
    if (key === 13) { 
		runRoutine("userid");
    }
});

function runRoutine(from) {
    var usernameTB = document.getElementById('username');
	var useridTB = document.getElementById('userid');
	clearError();
	if(from == "username") {
		getUserId(fetchUserId, failedRequest);
	} else if(from == "userid") {
		getUsername(fetchUsername, failedRequest);
	}
}

function fetchUserId(targetTB, json, username) {
	if("error" in json) {
		badRequest("username", username);
	} else {
		targetTB.value = json['data'][0]['id'];
		setSuccess("User ID retrieved successfully.");
	}
}

function fetchUsername(targetTB, json, userid) {
	if("error" in json) {
		badRequest("user id", userid);
	} else {
		targetTB.value = json['data'][0]['login'];
		setSuccess("Username retrieved successfully.");
	}
}

function failedRequest() {
	setError("The request you attempted failed! Is Twitch API OK?");
}

function badRequest(type, resource) {
	setError("The " + type + " '" + resource + "' was not valid!");
}

function getUserId(fetchUserId, failedRequest) {
	var input = document.getElementById('username');
	var output = document.getElementById('userid');
	
	output.value = "";
	
	var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
			var json = JSON.parse(req.responseText);
			if(json['data'].length > 0) {
				fetchUserId(output, json, input.value);
			} else {
				badRequest("username", input.value);
			}
		} else if(req.readyState == 4) {
			failedRequest();
		}
    }
	
    req.open("GET", "https://api.twitch.tv/helix/users?login=" + input.value, true);
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Client-ID", "abe7gtyxbr7wfcdftwyi9i5kej3jnq");
    req.send(null);
}

function getUsername(fetchUsername, failedRequest) {
	var input = document.getElementById('userid');
	var output = document.getElementById('username');
	
	output.value = "";
	
	var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
			var json = JSON.parse(req.responseText);
			if(json['data'].length > 0) {
				fetchUsername(output, json, input.value);
			} else {
				badRequest("user id", input.value);
			}
		} else if(req.readyState == 4) {
			failedRequest();
		}
    }
	
    req.open("GET", "https://api.twitch.tv/helix/users?id=" + input.value, true);
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Client-ID", "abe7gtyxbr7wfcdftwyi9i5kej3jnq");
    req.send(null);
}

function setSuccess(successMsg) {
	document.getElementById("success").innerHTML = successMsg;
	setTimeout(clearSuccess, 10000);
}

function clearSuccess() {
	document.getElementById("success").innerHTML = "";
}

function setError(errorMsg) {
	document.getElementById("error").innerHTML = errorMsg;
	setTimeout(clearError, 10000);
}

function clearError() {
	document.getElementById("error").innerHTML = "";
}