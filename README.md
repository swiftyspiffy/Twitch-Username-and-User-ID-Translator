# Twitch Username and UserID Translator Chrome Extension

#### Update August 2021
In the coming months, Twitch will be disabling the v5 third party API, which is what this extension uses to avoid needing the user to provide additional information. As such, I have staged a change that remova v5 code in favor of Helix. This change enables two "execution" modes, a User and a Custom App. 

The User mode uses an access token generated automatically from TwitchTokenGenerator.com for an account created just for this extension. This creates a friction-less experience for most users, but requires a dependency on both the Twitch account and TwitchTokenGenerator.com's API being available.

The second mode, Custom App, allows the user to provide a TwitchDev application's client id and client secret. The extension uses these two values to generate an App Access token using the Twitch API entirely. 

By default, the User mode is enabled to allow for seemless extension usage. To use the Custom App mode, click the 'settings' link label and change the mode, and insert the client id and client secret obtained from https://dev.twitch.tv .

## Overview
This is a small Chrome extension that allows you to quickly translate between Twitch usernames and userids. This is really useful for developing against Twitch resources.

### Chrome Extension
You can install the Chrome extension here: https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon

### Firefox Extension
You can install the Firefox extension here: https://addons.mozilla.org/en-US/firefox/addon/twitch-username-and-user-id/

## Contributors
 * Cole ([@swiftyspiffy](http://twitter.com/swiftyspiffy))
 * René Preuß ([ghostzero](https://github.com/ghostzero))
 
## License
MIT License. &copy; 2021 Cole
