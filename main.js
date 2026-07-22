import { convertTwitchIdentifier } from './execute.js';
import {
    INPUT_TYPE,
    detectInputType,
    getInputTypeLabel,
    getOutputTypeLabel,
    normalizeInput,
    validateInput
} from './input.js';

const elements = {
    form: document.querySelector('#lookup-form'),
    input: document.querySelector('#query'),
    clearButton: document.querySelector('#clear-button'),
    typeToggle: document.querySelector('#type-toggle'),
    detectedType: document.querySelector('#detected-type'),
    submitButton: document.querySelector('#submit-button'),
    submitLabel: document.querySelector('.submit-label'),
    submitSpinner: document.querySelector('.submit-spinner'),
    result: document.querySelector('#result'),
    resultLabel: document.querySelector('#result-label'),
    response: document.querySelector('#response'),
    copyButton: document.querySelector('#copy-button'),
    copyLabel: document.querySelector('#copy-label'),
    status: document.querySelector('#status')
};

const state = {
    inputType: INPUT_TYPE.USERNAME,
    requestId: 0,
    copyResetTimer: null
};

elements.form.addEventListener('submit', handleSubmit);
elements.input.addEventListener('input', handleInput);
elements.clearButton.addEventListener('click', clearInput);
elements.typeToggle.addEventListener('click', toggleInputType);
elements.copyButton.addEventListener('click', copyResult);

setInputType(detectInputType(elements.input.value));
elements.input.focus();

function handleInput() {
    state.requestId += 1;
    setLoading(false);
    setInputType(detectInputType(elements.input.value));
    elements.clearButton.hidden = elements.input.value.length === 0;
    clearResult();
    clearStatus();
}

function clearInput() {
    elements.input.value = '';
    elements.input.dispatchEvent(new Event('input'));
    elements.input.focus();
}

function toggleInputType() {
    state.requestId += 1;
    setLoading(false);
    setInputType(
        state.inputType === INPUT_TYPE.USERNAME ? INPUT_TYPE.USER_ID : INPUT_TYPE.USERNAME
    );
    clearResult();
    clearStatus();
    elements.input.focus();

    if (normalizeInput(elements.input.value)) {
        window.setTimeout(() => elements.form.requestSubmit(), 0);
    }
}

function setInputType(inputType) {
    state.inputType = inputType;
    const inputLabel = getInputTypeLabel(inputType);
    const alternateLabel = getInputTypeLabel(
        inputType === INPUT_TYPE.USERNAME ? INPUT_TYPE.USER_ID : INPUT_TYPE.USERNAME
    );

    elements.detectedType.textContent = inputLabel;
    elements.typeToggle.setAttribute(
        'aria-label',
        `Detected as ${inputLabel}. Click to switch to ${alternateLabel}.`
    );
}

async function handleSubmit(event) {
    event.preventDefault();

    const input = normalizeInput(elements.input.value);
    const validationMessage = validateInput(input, state.inputType);

    if (validationMessage) {
        showStatus(validationMessage, 'error');
        elements.input.focus();
        return;
    }

    elements.input.value = input;
    elements.clearButton.hidden = false;
    clearResult();
    clearStatus();
    setLoading(true);

    const requestId = ++state.requestId;

    try {
        const result = await convertTwitchIdentifier(input);

        if (requestId !== state.requestId) {
            return;
        }

        showResult(result.output, result.output_type);
    } catch (error) {
        if (requestId !== state.requestId) {
            return;
        }

        const message = error instanceof Error ? error.message : 'The lookup failed. Try again.';
        showStatus(message, 'error');
    } finally {
        if (requestId === state.requestId) {
            setLoading(false);
        }
    }
}

function setLoading(isLoading) {
    elements.submitButton.disabled = isLoading;
    elements.submitLabel.hidden = isLoading;
    elements.submitSpinner.hidden = !isLoading;
    elements.submitButton.setAttribute('aria-busy', String(isLoading));
    elements.submitButton.setAttribute(
        'aria-label',
        isLoading ? 'Lookup in progress' : 'Translate'
    );
}

function showResult(value, outputType) {
    elements.resultLabel.textContent = getOutputTypeLabel(outputType);
    elements.response.textContent = value;
    elements.result.hidden = false;
}

function clearResult() {
    elements.result.hidden = true;
    elements.response.textContent = '';
    resetCopyButton();
}

async function copyResult() {
    const value = elements.response.textContent;

    if (!value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(value);
        window.clearTimeout(state.copyResetTimer);
        elements.copyLabel.textContent = 'Copied';
        elements.copyButton.classList.add('copied');
        showStatus('Copied to clipboard.', 'success');
        state.copyResetTimer = window.setTimeout(resetCopyButton, 1800);
    } catch {
        showStatus('Could not copy the result. Select it and copy manually.', 'error');
    }
}

function resetCopyButton() {
    window.clearTimeout(state.copyResetTimer);
    elements.copyLabel.textContent = 'Copy';
    elements.copyButton.classList.remove('copied');
}

function showStatus(message, type) {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
    elements.status.setAttribute('role', type === 'error' ? 'alert' : 'status');
    elements.status.hidden = false;
}

function clearStatus() {
    elements.status.textContent = '';
    elements.status.className = 'status';
    elements.status.setAttribute('role', 'status');
    elements.status.hidden = true;
}
