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
        runRoutineV2(queryInput.value, detected);
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
		runRoutineV2(queryInput.value, detected);
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

function runRoutineV2(input, type) {
    clearError();

    if(input.length <= 0) {
        setError("Please provide an username or user id!");
        return;
    }

    console.log("input: " + input);
    if (type === TYPE_USERNAME) {
        getUserIdV2(input, fetchUserIdV2, failedRequest);
    } else if (type === TYPE_USER_ID) {
        getUsernameV2(input, fetchUsernameV2, failedRequest);
    }
}

function fetchUserIdV2(userid) {
	queryOutput.innerText = userid;
    setSuccess("User ID retrieved successfully.");
	resultDiv.style.display = "";
}

function fetchUsernameV2(username) {
    queryOutput.innerHTML = username;
    setSuccess("Username retrieved successfully.");
	resultDiv.style.display = "";
}

function failedRequest() {
    setError("The request you attempted failed! " + detected + " " + queryInput.value + " doesn't exist.");
	resultDiv.style.display = "none";
	clearSuccess();
}

function badRequest(type, resource) {
    setError("The " + type + " '" + resource + "' was not valid!");
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