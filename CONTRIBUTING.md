# Contributing to Twitch Username and User ID Translator

Thank you for considering contributing to this project! This document outlines the process for contributing.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser version** and operating system
- **Extension version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description** of the enhancement
- **Use cases** - explain why this would be useful
- **Mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Set up development environment** (see [SETUP.md](SETUP.md))
3. **Make your changes**:
    - Follow the existing code style
    - Add comments for complex logic
    - Update documentation if needed
4. **Test your changes** thoroughly in both Chrome and Firefox (if applicable)
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

## Development Guidelines

### Code Style

- Use **modern JavaScript** (ES6+)
- Use **const** and **let**, never **var**
- Use **async/await** for asynchronous code
- Use **fetch API** instead of XMLHttpRequest
- Keep functions small and focused
- Use meaningful variable names

### Example Code Style

```javascript
/**
 * Fetch user information from Twitch API
 * @param {string} username - The Twitch username
 * @returns {Promise<Object>} User data object
 */
async function fetchUserData(username) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}
```

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:

```
Add user ID validation before API call

Fix clipboard copy functionality on Firefox
Closes #123

Update README with new features
```

### Testing

Before submitting a pull request:

1. **Test in Chrome**: Load the extension and test all functionality
2. **Test in Firefox**: If applicable, verify Firefox compatibility
3. **Test both directions**: Try username → user ID and user ID → username
4. **Check console**: Ensure no console errors appear
5. **Test edge cases**: Empty inputs, invalid usernames, network errors

## Project Structure

See [README.md](README.md#project-structure) for an overview of the codebase.

### Key Files

- **execute.js**: API communication and credential management
- **main.js**: Main UI logic and event handling
- **input.js**: Input detection, validation, and labels
- **form.html**: Extension popup structure
- **styles.css**: All styles

## Code Review Process

1. A maintainer will review your pull request
2. They may suggest changes or ask questions
3. Make requested changes and push updates to your branch
4. Once approved, a maintainer will merge your PR

## Additional Notes

### Credentials

- **Never commit** `config.js` (it's gitignored)
- Always use `config.example.js` as a template
- Keep credentials secure and never share them publicly

### Privacy

- This extension does **not collect user data**
- Do not add analytics or tracking without discussion
- Respect user privacy in all contributions

### Dependencies

- Currently, the extension has **zero dependencies**
- Adding external libraries requires strong justification
- Prefer vanilla JavaScript when possible

## Questions?

Feel free to open an issue with the "question" label if you need clarification on anything!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
