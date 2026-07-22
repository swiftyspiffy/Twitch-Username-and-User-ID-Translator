# Privacy Policy

**Effective date:** July 22, 2026

## Overview

The Twitch Username and User ID Translator extension converts Twitch usernames and user IDs. It does not include analytics, advertising, tracking, or user accounts.

## Data Processed

When you submit a lookup, the extension sends the username or user ID you entered to `https://usernametouserid.spiffy.dev`. The service uses that value to perform the requested Twitch account lookup and returns the matching username or user ID.

The extension does not send your browsing history, page content, Twitch login credentials, email address, or other personal information.

## Storage and Retention

The extension does not request browser storage permission and does not persist lookup history.

Successful lookup results are cached in the popup's memory for up to five minutes to avoid duplicate requests. This cache is discarded when the popup process closes and is never written to disk by the extension.

The lookup service may retain standard server access logs for operational security and reliability. Those logs can include request metadata such as IP address, timestamp, and user agent, subject to the service operator's retention practices.

## Third-Party Services

The lookup backend communicates with Twitch to resolve the submitted username or user ID. Twitch's handling of information is governed by the [Twitch Privacy Notice](https://www.twitch.tv/p/legal/privacy-notice/).

## Browser Permissions

The extension does not request optional browser permissions. Clipboard access is only used after you click **Copy** and is provided through the browser's extension-page capabilities.

## Security

Requests to the lookup service use HTTPS. The extension signs requests so the service can reject unauthorized or malformed traffic. No client-side application can make an embedded signing value completely secret, so the backend must continue to enforce rate limits and request validation.

## Changes

Material changes to this policy will be reflected in the effective date above.

## Contact

Questions can be submitted through the project's [GitHub issue tracker](https://github.com/swiftyspiffy/Twitch-Username-and-User-ID-Translator/issues).
