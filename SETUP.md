# Development Setup Guide

## Initial Setup

### 1. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd Twitch-Username-and-User-ID-Translator

# Copy the example config file
cp config.example.js config.js
```

### 2. Configure API Settings

Set the API endpoint and signing-key parts in `config.js`. You can also enable debug logging:

Edit `config.js`:

```javascript
export const config = Object.freeze({
    debug: true
    // ... rest of config
});
```

Do not commit `config.js`; it is intentionally ignored by Git.

### 3. Install Development Tools

```bash
npm install
npm run check
```

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the extension directory
5. The extension should now appear in your browser

### 5. Manual Testing

- Click the extension icon to open the popup
- Test username → user ID conversion (try "swiftyspiffy")
- Test user ID → username conversion (try "40876073")
- Check browser console for debug logs (if `config.debug` is `true`)
- Verify caching by converting the same username twice (second should be instant)

## File Structure

```
.
├── config.js              # Configuration with API settings (gitignored)
├── config.example.js      # Configuration template
├── execute.js            # API communication with HMAC auth
├── form.html             # Popup HTML
├── icon.png              # Extension icon
├── input.js              # Input detection and validation
├── main.js               # Main UI logic
├── manifest.json         # Extension manifest
├── styles.css            # Styles
├── test/                  # Automated tests
└── SETUP.md              # This file
```

## Development Workflow

1. Make changes to the code.
2. Run `npm run check`.
3. Go to `chrome://extensions/` and reload the unpacked extension.
4. Test username, user ID, invalid-input, error, and copy states.

## Security Notes

⚠️ **Important**: Never commit `config.js` to version control. It contains sensitive credentials.

The `.gitignore` file is configured to exclude:

- `config.js`
- `node_modules/`
- Build artifacts
- IDE-specific files

## Production Build

For production deployment:

1. Set `debug: false` in `config.js`
2. Test thoroughly
3. Package the extension:
    - Go to `chrome://extensions/`
    - Click "Pack extension"
    - Select the extension directory
    - This creates a `.crx` file and `.pem` key

## Getting Help

- Check existing issues on GitHub
- Review the Twitch API documentation: https://dev.twitch.tv/docs/api/
- Chrome Extension documentation: https://developer.chrome.com/docs/extensions/
