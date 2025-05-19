# Resources Hub Project File Extractor

## Overview

This package provides a complete set of files for the Resources Hub application and a Node.js script to extract them from a YAML configuration file.

## Files Included

### 1. YAML Configuration (`resources-hub-files.yaml`)
Contains all necessary files for the React application:
- **Source Files**: React components, styles, and configuration
- **Configuration**: Package.json, Tailwind config, ESLint, Prettier
- **Documentation**: README, environment template
- **Build Files**: HTML template, manifest, gitignore

### 2. Extractor Script (`extractor.js`)
Node.js script that reads the YAML file and creates the complete project structure.

## Quick Setup

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn package manager

### Step 1: Setup the Extractor
```bash
# Create a new directory for the extractor
mkdir resources-hub-setup
cd resources-hub-setup

# Save the YAML file as 'resources-hub-files.yaml'
# Save the extractor script as 'extractor.js'
# Save the package.json as 'package.json'

# Install dependencies
npm install
```

### Step 2: Extract the Project
```bash
# Extract to current directory
node extractor.js resources-hub-files.yaml ./resources-hub

# Or specify custom output directory
node extractor.js resources-hub-files.yaml ~/Projects/my-resources-hub
```

### Step 3: Setup the Extracted Project
```bash
# Navigate to the extracted project
cd resources-hub

# Install project dependencies
npm install

# Start the development server
npm start
```

## Extractor Usage

### Basic Usage
```bash
node extractor.js <yaml-file> [output-directory]
```

### Examples
```bash
# Extract to default directory (./extracted-project)
node extractor.js resources-hub-files.yaml

# Extract to specific directory
node extractor.js resources-hub-files.yaml ./my-project

# Extract to home directory
node extractor.js resources-hub-files.yaml ~/Projects/resources-hub
```

### Command Line Options
```bash
# Show help
node extractor.js --help

# Show version
node extractor.js --version
```

## Project Structure After Extraction

```
resources-hub/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   └── setupTests.js
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── jsconfig.json
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

## Extractor Features

### ✅ Comprehensive Error Handling
- Validates YAML structure
- Checks file permissions
- Reports extraction progress
- Summarizes results

### ✅ Smart Directory Creation
- Creates nested directories automatically
- Handles complex file paths
- Preserves project structure

### ✅ Progress Reporting
- Real-time extraction feedback
- Detailed summary report
- Error logging and reporting

### ✅ Project Validation
- Checks for required files
- Warns about missing dependencies
- Provides setup instructions

## Customizing the YAML File

The YAML file structure is simple:
```yaml
"file/path/name.ext": |
  File content goes here
  Multiple lines are supported
  
"another/file.js": |
  // JavaScript content
  console.log('Hello World');
```

### Adding New Files
1. Add a new key with the file path
2. Add the file content after the `|` character
3. Maintain proper indentation (2 spaces)

### Modifying Existing Files
1. Find the file path key in the YAML
2. Update the content while preserving indentation
3. Test extraction after changes

## Troubleshooting

### Common Issues

**"yaml module not found"**
```bash
# Install the yaml dependency
npm install yaml
```

**"Permission denied"**
```bash
# Ensure directory is writable
chmod 755 ./output-directory
```

**"Invalid YAML structure"**
- Check YAML indentation (use spaces, not tabs)
- Validate YAML syntax with an online validator
- Ensure all file paths are properly quoted

### Debugging

Enable verbose output by modifying the extractor:
```javascript
// Add this line near the top of extractor.js
const DEBUG = true;
```

### Getting Help

1. Check the console output for detailed error messages
2. Verify the YAML file syntax
3. Ensure you have write permissions to the output directory
4. Check Node.js version compatibility (v16+)

## Development

### Modifying the Extractor
The extractor script is modular and can be extended:
- `extractFiles()` - Main extraction logic
- `writeFile()` - Individual file writing
- `validateProject()` - Post-extraction validation
- `displayResults()` - Result reporting

### Adding Features
Common enhancements:
- File compression/decompression
- Template variable substitution
- Multi-format support (JSON, TOML)
- Interactive mode
- Git integration

## License

MIT License - Feel free to modify and distribute.

## Support

For issues or questions:
1. Check this documentation
2. Review the console output for errors
3. Verify your Node.js version and dependencies
4. Create an issue on the project repository

---

**Happy coding!**