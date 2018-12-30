const CLIENT_ID = 'abe7gtyxbr7wfcdftwyi9i5kej3jnq';

const TYPE_USERNAME = 'Username';
const TYPE_USER_ID = 'User id';

let detected = TYPE_USERNAME;

let resultDiv = document.getElementById("result");
let queryInput = document.getElementById('q');
let queryOutput = document.getElementById('response');
let detectedText = document.getElementById('detected');
let detectedSwitch = document.getElementById('switch');
let copyLink = document.getElementById("copy");
let errorMsg = document.getElementById("error");
let successMsg = document.getElementById("success");
let copiedMsg = document.getElementById("copied");

setDetected(TYPE_USERNAME);

queryInput.addEventListener('keyup', function (e) {
    let key = e.which || e.keyCode;
    if (key === 13) {
        runRoutine(queryInput.value, detected);
    } else {
        runDetection(queryInput.value, (response) => setDetected(response));
    }
});

detectedSwitch.addEventListener('click', function (e) {
    if(detected === TYPE_USERNAME) {
        setDetected(TYPE_USER_ID);
    } else {
        setDetected(TYPE_USERNAME);
    }
	// if they're switch the mode while the textbox has content, there's a good chance they want to re-run it in the new mode
	if(queryInput.value.length > 0) {
		runRoutine(queryInput.value, detected);
	}
});

copyLink.addEventListener('click', function (e) { copyResults(); });

function runDetection(input, callback) {
    if(isNaN(input)) {
        callback(TYPE_USERNAME);
    } else {
        callback(TYPE_USER_ID)
    }
}

function setDetected(newValue) {
    detected = newValue;
    detectedText.innerText = newValue;
}

function runRoutine(input, type) {
    clearError();

    if(input.length <= 0) {
        setError("Please provide an username or user id!");
        return;
    }

    if (type === TYPE_USERNAME) {
        getUserId(fetchUserId, failedRequest);
    } else if (type === TYPE_USER_ID) {
        getUsername(fetchUsername, failedRequest);
    }
}

function fetchUserId(json, username) {
    if ("error" in json) {
        badRequest("username", username);
    } else {
        queryOutput.innerText = json['data'][0]['id'];
        setSuccess("User ID retrieved successfully.");
		resultDiv.style.display = "";
    }
}

function fetchUsername(json, userid) {
    if ("error" in json) {
        badRequest("user id", userid);
    } else {
        queryOutput.innerHTML = json['data'][0]['login'];
        setSuccess("Username retrieved successfully.");
		resultDiv.style.display = "";
    }
}

function failedRequest() {
    setError("The request you attempted failed! " + detected + " " + queryInput.value + " doesn't exist.");
	resultDiv.style.display = "none";
	clearSuccess();
}

function badRequest(type, resource) {
    setError("The " + type + " '" + resource + "' was not valid!");
}

function getUserId(fetchUserId, failedRequest) {
    queryOutput.innerText = "";

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let json = JSON.parse(req.responseText);
            if (json['data'].length > 0) {
                fetchUserId(json, queryInput.value);
            } else {
                badRequest("username", queryInput.value);
            }
        } else if (req.readyState === 4) {
            failedRequest();
        }
    };

    req.open("GET", "https://api.twitch.tv/helix/users?login=" + queryInput.value, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Client-ID", CLIENT_ID);
    req.send(null);
}

function getUsername(fetchUsername, failedRequest) {
    queryOutput.value = "";

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let json = JSON.parse(req.responseText);
            if (json['data'].length > 0) {
                fetchUsername(json, queryInput.value);
            } else {
                badRequest("user id", queryInput.value);
            }
        } else if (req.readyState === 4) {
            failedRequest();
        }
    };

    req.open("GET", "https://api.twitch.tv/helix/users?id=" + queryInput.value, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Client-ID", CLIENT_ID);
    req.send(null);
}

function setSuccess(successMsgCnts) {
    successMsg.innerHTML = successMsgCnts;
    setTimeout(clearSuccess, 10000);
	clearError();
}

function setCopied(requestType) {
	copiedMsg.innerHTML = "Copied " + requestType + "!";
	setTimeout(clearCopied, 5000);
}

function clearCopied() {
	copiedMsg.innerHTML = "";
}

function clearSuccess() {
    successMsg.innerHTML = "";
}

function setError(errorMsgCnts) {
    errorMsg.innerHTML = errorMsgCnts;
    setTimeout(clearError, 10000);
}

function clearError() {
    errorMsg.innerHTML = "";
}

function copyResults() {
	results = queryOutput.innerHTML;
	
	if(detected == TYPE_USERNAME) {
		setCopied("user id");
	} else {
		setCopied("username");
	}
	
	document.oncopy = function(event) {
		event.clipboardData.setData("text", results);
		event.preventDefault();
	};
	document.execCommand("copy", false, null);
}