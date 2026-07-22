// Copy this file to config.js and replace the placeholder signing-key parts.
export const config = Object.freeze({
    debug: false,
    api: {
        endpoint: 'https://usernametouserid.spiffy.dev/api/extension/convert',
        signingPath: '/api/extension/convert',
        keyParts: [
            'YOUR_OBFUSCATED_PART_1_HERE',
            'YOUR_OBFUSCATED_PART_2_HERE',
            'YOUR_OBFUSCATED_PART_3_HERE'
        ]
    }
});

export function getApiSecret() {
    return config.api.keyParts
        .map((part) => atob(part))
        .join('')
        .split('')
        .map((character) => String.fromCharCode(character.charCodeAt(0) - 1))
        .join('');
}
