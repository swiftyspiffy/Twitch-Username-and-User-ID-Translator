import test from 'node:test';
import assert from 'node:assert/strict';

import {
    INPUT_TYPE,
    detectInputType,
    getInputTypeLabel,
    getOutputTypeLabel,
    normalizeInput,
    validateInput
} from '../input.js';

test('normalizes whitespace around input', () => {
    assert.equal(normalizeInput('  swiftyspiffy  '), 'swiftyspiffy');
});

test('detects numeric values as user IDs', () => {
    assert.equal(detectInputType('40876073'), INPUT_TYPE.USER_ID);
    assert.equal(detectInputType('  00123  '), INPUT_TYPE.USER_ID);
});

test('detects other values and blank input as usernames', () => {
    assert.equal(detectInputType('swiftyspiffy'), INPUT_TYPE.USERNAME);
    assert.equal(detectInputType(''), INPUT_TYPE.USERNAME);
});

test('validates both supported input types', () => {
    assert.equal(validateInput('swifty_spiffy', INPUT_TYPE.USERNAME), '');
    assert.equal(validateInput('40876073', INPUT_TYPE.USER_ID), '');
    assert.match(validateInput('swift-spiffy', INPUT_TYPE.USERNAME), /letters, numbers/);
    assert.match(validateInput('abc123', INPUT_TYPE.USER_ID), /only contain numbers/);
    assert.match(validateInput('', INPUT_TYPE.USERNAME), /Enter a Twitch username/);
});

test('returns readable input and output labels', () => {
    assert.equal(getInputTypeLabel(INPUT_TYPE.USERNAME), 'Username');
    assert.equal(getInputTypeLabel(INPUT_TYPE.USER_ID), 'User ID');
    assert.equal(getOutputTypeLabel(INPUT_TYPE.USERNAME), 'Username');
    assert.equal(getOutputTypeLabel(INPUT_TYPE.USER_ID), 'User ID');
});
