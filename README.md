# Phil It In 🚀

A Chrome extension that automatically fills out web forms with random but realistic information. Perfect for testing, development, or filling out forms quickly.

## Features

- 🎯 **Smart Field Detection**: Automatically detects field types based on names, IDs, placeholders, and labels
- 👤 **Realistic Data**: Generates authentic-looking names, emails, addresses, phone numbers, and more
- ⚡ **One-Click Fill**: Fill all forms on a page with a single click
- 🔒 **Privacy Safe**: All data is generated client-side, nothing is sent to external servers
- 🎨 **Beautiful UI**: Modern and intuitive popup interface
- 🔍 **Smart Exclusion**: Automatically skips search bars and navigation elements
- 🚫 **No Auto-Submit**: Fills forms without submitting them automatically

## Supported Field Types

- **Personal Information**: First name, last name, full name
- **Contact**: Email addresses, phone numbers
- **Address**: Street address, city, state, zip code, country
- **Financial**: Credit card numbers (fake), CVV, expiry dates
- **Dates**: Date of birth, general dates
- **Other**: Company names, websites, SSN (fake), passwords

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/philitin.git
   cd philitin
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked"

5. Select the `philitin` folder

6. The extension icon should appear in your toolbar

## Usage

1. Navigate to any webpage with forms
2. Click the extension icon in your Chrome toolbar
3. Click "Fill All Forms" button
4. Watch as all form fields are automatically filled with realistic data!

**Note**: The extension will automatically skip search bars and will not submit forms automatically. You can review and manually submit filled forms when ready.

## File Structure

```
philitin/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── content.js            # Content script (runs on web pages)
├── data-generator.js     # Realistic data generation logic
├── background.js        # Background service worker
└── README.md             # This file
```

## Icons

For full functionality, you'll need to add icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create simple icons or use placeholder images. The extension will work without them, but Chrome may show a default icon.

## Privacy & Security

- All data generation happens locally in your browser
- No data is sent to external servers
- Generated credit card numbers and SSNs are fake and should never be used for real transactions
- Always review filled data before submitting forms
- Search bars and navigation elements are automatically excluded from filling

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the webpage you're testing on

### Building

No build process required! This is a vanilla JavaScript Chrome extension that works directly from source.

### Packaging for Chrome Web Store

To create a package for Chrome Web Store submission:

```bash
npm run package
```

This will create a ZIP file (`philitin-v1.0.0.zip`) ready for upload to the Chrome Web Store.

**See [PUBLISHING.md](./PUBLISHING.md) for detailed publishing instructions.**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Extension not working?
- Make sure you've reloaded the extension after making changes
- Check the browser console (F12) for any errors
- Ensure you're on a regular webpage (not chrome:// pages)

### Forms not filling?
- Make sure the page has finished loading
- Check that fields are standard HTML form elements
- Some websites with custom form implementations may not be detected

## License

This project is provided as-is for educational and development purposes.

## Acknowledgments

- Built with vanilla JavaScript
- Manifest V3 compatible
- No external dependencies
