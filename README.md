# Twitch Username and User ID Translator

A Chrome/Firefox extension that allows you to quickly translate between Twitch usernames and user IDs. Useful for developers working with Twitch's API.

## Installation

### Chrome Extension

Install from the Chrome Web Store: [Twitch Username and User ID Translator](https://chromewebstore.google.com/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon)

### Firefox Extension

Install from Firefox Add-ons: [Twitch Username and User ID Translator](https://addons.mozilla.org/en-US/firefox/addon/twitch-username-and-user-id/)

## Features

- 🔄 **Bidirectional Translation**: Convert usernames to IDs and IDs to usernames
- 🎯 **Auto-Detection**: Automatically detects whether you entered a username or ID
- 📋 **One-Click Copy**: Copy results to clipboard with a single click
- ⚡ **Fast & Lightweight**: Instant lookups with minimal resource usage
- 🔒 **Privacy-Focused**: No analytics, advertising, or tracking
- 🎨 **Clean Interface**: Simple, intuitive popup design

## Usage

1. Click the extension icon in your browser toolbar
2. Enter a Twitch username or user ID
3. Press Enter or click **Translate**
4. Click **Copy** to copy the result to your clipboard

Simple as that! No configuration needed.

## Development

See [SETUP.md](SETUP.md) for detailed development setup instructions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/swiftyspiffy/Twitch-Username-and-User-ID-Translator.git
cd Twitch-Username-and-User-ID-Translator

# Copy config template
cp config.example.js config.js

# Edit config.js with your credentials
npm install
npm run check

# Then load the extension in Chrome at chrome://extensions/
```

### Project Structure

```
├── config.js              # Configuration with API credentials (gitignored)
├── execute.js             # API communication and result cache
├── form.html              # Extension popup markup
├── input.js               # Input detection and validation
├── main.js                # Popup behavior
├── styles.css             # Popup design
├── manifest.json          # Extension manifest
├── test/                  # Node test suite
└── SETUP.md               # Development setup guide
```

## Technology

- **Modern JavaScript**: Native modules, async/await, and the Fetch API
- **Manifest V3**: Current browser-extension architecture
- **Custom API**: Lookup backend at usernametouserid.spiffy.dev
- **HMAC-SHA256 Authentication**: Signed API requests using Web Crypto
- **Accessible UI**: Semantic form controls, keyboard support, and live status updates
- **5-Minute Caching**: Reduces API calls for better performance
- **Zero Runtime Dependencies**: Plain HTML, CSS, and JavaScript

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Reporting Issues

If you encounter a bug or have a feature request, please [open an issue](https://github.com/swiftyspiffy/Twitch-Username-and-User-ID-Translator/issues) on GitHub.

## Contributors

- Cole ([@swiftyspiffy](http://twitter.com/swiftyspiffy))
- René Preuß ([ghostzero](https://github.com/ghostzero))

## License

MIT License. © 2021-2026 Cole

See [LICENSE](LICENSE) for full details.

## Privacy

This extension has no analytics or tracking. The username or user ID you enter is sent to the lookup backend to perform the conversion. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/twitch-username-and-user-id/)
- [Twitch Developer Console](https://dev.twitch.tv/console)
- [Twitch API Documentation](https://dev.twitch.tv/docs/api/)
