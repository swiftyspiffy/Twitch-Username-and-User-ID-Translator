const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const INPUT_TYPE = Object.freeze({
    USERNAME: 'username',
    USER_ID: 'userid'
});

export function normalizeInput(value) {
    return value.trim();
}

export function detectInputType(value) {
    const input = normalizeInput(value);
    return input.length > 0 && /^\d+$/.test(input) ? INPUT_TYPE.USER_ID : INPUT_TYPE.USERNAME;
}

export function validateInput(value, inputType) {
    if (!value) {
        return 'Enter a Twitch username or user ID.';
    }

    if (inputType === INPUT_TYPE.USER_ID && !/^\d+$/.test(value)) {
        return 'User IDs can only contain numbers.';
    }

    if (inputType === INPUT_TYPE.USERNAME && !USERNAME_PATTERN.test(value)) {
        return 'Usernames can only use letters, numbers, and underscores.';
    }

    if (inputType === INPUT_TYPE.USERNAME && value.length > 25) {
        return 'Twitch usernames can be up to 25 characters.';
    }

    return '';
}

export function getInputTypeLabel(inputType) {
    return inputType === INPUT_TYPE.USER_ID ? 'User ID' : 'Username';
}

export function getOutputTypeLabel(outputType) {
    return outputType === INPUT_TYPE.USER_ID ? 'User ID' : 'Username';
}
