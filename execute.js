import { config, getApiSecret } from './config.js';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_LIMIT = 100;
const REQUEST_TIMEOUT_MS = 12_000;
const conversionCache = new Map();

export async function convertTwitchIdentifier(input) {
    const cachedResult = getCachedResult(input);

    if (cachedResult) {
        debug(`Cache hit for ${input}`);
        return cachedResult;
    }

    const { signature, timestamp } = await createSignature(input);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(config.api.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
                'X-Timestamp': String(timestamp)
            },
            body: JSON.stringify({ input }),
            signal: controller.signal
        });
        const payload = await parseResponse(response);

        if (!response.ok || !payload.success) {
            throw new Error(payload.message || getHttpErrorMessage(response.status));
        }

        if (!isConversionResult(payload.data)) {
            throw new Error('The server returned an invalid response.');
        }

        cacheResult(input, payload.data);
        return payload.data;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('The lookup timed out. Check your connection and try again.');
        }

        if (error instanceof TypeError) {
            throw new Error('Could not reach the lookup service. Check your connection.');
        }

        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
}

async function parseResponse(response) {
    try {
        return await response.json();
    } catch {
        return {};
    }
}

function isConversionResult(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        typeof value.output === 'string' &&
        ['username', 'userid'].includes(value.output_type)
    );
}

function getHttpErrorMessage(status) {
    if (status === 404) {
        return 'No matching Twitch account was found.';
    }

    if (status === 429) {
        return 'Too many lookups. Wait a moment and try again.';
    }

    return 'The lookup service returned an error. Try again.';
}

async function createSignature(input) {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}${config.api.signingPath}${input}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(getApiSecret()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));

    return {
        signature: Array.from(new Uint8Array(signature), (byte) =>
            byte.toString(16).padStart(2, '0')
        ).join(''),
        timestamp
    };
}

function getCachedResult(input) {
    const cacheKey = input.toLowerCase();
    const entry = conversionCache.get(cacheKey);

    if (!entry) {
        return null;
    }

    if (Date.now() - entry.createdAt >= CACHE_TTL_MS) {
        conversionCache.delete(cacheKey);
        return null;
    }

    return entry.result;
}

function cacheResult(input, result) {
    const cacheKey = input.toLowerCase();

    conversionCache.delete(cacheKey);
    conversionCache.set(cacheKey, { result, createdAt: Date.now() });

    if (conversionCache.size > CACHE_LIMIT) {
        const oldestKey = conversionCache.keys().next().value;
        conversionCache.delete(oldestKey);
    }
}

function debug(message) {
    if (config.debug) {
        console.debug(`[Twitch Username ↔ User ID] ${message}`);
    }
}
