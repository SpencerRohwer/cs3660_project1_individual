#!/usr/bin/env node

/**
 * Resources Hub Project File Extractor
 * 
 * This script extracts files from a YAML configuration file and writes them
 * to the filesystem, creating the complete project structure.
 * 
 * Usage:
 *   node extractor.js [yaml-file] [output-directory]
 *   
 * Example:
 *   node extractor.js resources-hub-files.yaml ./my-project
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

class ProjectExtractor {
  constructor(yamlFile, outputDir = './extracted-project') {
    this.yamlFile = yamlFile;
    this.outputDir = path.resolve(outputDir);
    this.extractedFiles = [];
    this.errors = [];
  }

  /**
   * Extract all files from the YAML configuration
   */
  async extractFiles() {
    try {
      console.log('🚀 Starting Resources Hub project extraction...\n');
      
      // Read and parse YAML file
      const yamlContent = await this.readYamlFile();
      const projectFiles = yaml.parse(yamlContent);
      
      // Validate YAML structure
      if (!projectFiles || typeof projectFiles !== 'object') {
        throw new Error('Invalid YAML structure. Expected object with file paths as keys.');
      }

      // Create output directory
      await this.ensureDirectory(this.outputDir);
      
      // Extract each file
      const fileCount = Object.keys(projectFiles).length;
      console.log(`📁 Extracting ${fileCount} files to ${this.outputDir}\n`);
      
      for (const [filePath, content] of Object.entries(projectFiles)) {
        await this.writeFile(filePath, content);
      }
      
      // Display results
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Extraction failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Read and validate the YAML file
   */
  async readYamlFile() {
    try {
      const yamlPath = path.resolve(this.yamlFile);
      
      if (!fs.existsSync(yamlPath)) {
        throw new Error(`YAML file not found: ${yamlPath}`);
      }
      
      const content = fs.readFileSync(yamlPath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`Failed to read YAML file: ${error.message}`);
    }
  }

  /**
   * Write a single file to the filesystem
   */
  async writeFile(filePath, content) {
    try {
      const fullPath = path.join(this.outputDir, filePath);
      const dir = path.dirname(fullPath);
      
      // Ensure directory exists
      await this.ensureDirectory(dir);
      
      // Write file content
      fs.writeFileSync(fullPath, content, 'utf8');
      
      // Track successful extraction
      this.extractedFiles.push(filePath);
      console.log(`✅ ${filePath}`);
      
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.error(`❌ ${filePath} - ${error.message}`);
    }
  }

  /**
   * Ensure directory exists, create if necessary
   */
  async ensureDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Display extraction results
   */
  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXTRACTION SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`✅ Successfully extracted: ${this.extractedFiles.length} files`);
    
    if (this.errors.length > 0) {
      console.log(`❌ Failed to extract: ${this.errors.length} files`);
      console.log('\nErrors:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }
    
    console.log(`\n📁 Project extracted to: ${this.outputDir}`);
    console.log('\n🚀 Next steps:');
    console.log('  1. cd ' + path.relative(process.cwd(), this.outputDir));
    console.log('  2. npm install');
    console.log('  3. npm start');
    console.log('\n✨ Happy coding! ✨');
  }

  /**
   * Generate a project structure tree
   */
  generateProjectTree() {
    const tree = [];
    const sortedFiles = this.extractedFiles.sort();
    
    for (const filePath of sortedFiles) {
      const parts = filePath.split('/');
      const depth = parts.length - 1;
      const indent = '  '.repeat(depth);
      const fileName = parts[parts.length - 1];
      
      if (depth === 0) {
        tree.push(`${fileName}`);
      } else {
        tree.push(`${indent}├── ${fileName}`);
      }
    }
    
    return tree.join('\n');
  }

  /**
   * Validate project structure after extraction
   */
  validateProject() {
    const requiredFiles = [
      'package.json',
      'src/App.js',
      'src/index.js',
      'public/index.html'
    ];
    
    const missingFiles = requiredFiles.filter(file => 
      !this.extractedFiles.includes(file)
    );
    
    if (missingFiles.length > 0) {
      console.warn('\n⚠️  Warning: Missing required files:');
      missingFiles.forEach(file => console.warn(`   - ${file}`));
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Resources Hub Project File Extractor

Usage:
  node extractor.js <yaml-file> [output-directory]

Arguments:
  yaml-file        Path to the YAML file containing project files
  output-directory Directory to extract files to (default: ./extracted-project)

Options:
  --help, -h       Show this help message
  --version, -v    Show version information

Examples:
  node extractor.js resources-hub-files.yaml
  node extractor.js files.yaml ./my-resources-hub
  node extractor.js files.yaml ~/Projects/resources-hub

For more information, visit: https://github.com/your-org/resources-hub
    `);
    process.exit(0);
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    console.log('Resources Hub Project Extractor v1.0.0');
    process.exit(0);
  }
  
  return {
    yamlFile: args[0],
    outputDir: args[1] || './extracted-project'
  };
}

/**
 * Check for required dependencies
 */
function checkDependencies() {
  try {
    require('yaml');
  } catch (error) {
    console.error('❌ Missing required dependency: yaml');
    console.log('\nPlease install the yaml package:');
    console.log('  npm install yaml');
    console.log('  # or');
    console.log('  yarn add yaml');
    process.exit(1);
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check dependencies
    checkDependencies();
    
    // Parse command line arguments
    const { yamlFile, outputDir } = parseArguments();
    
    // Validate input file
    if (!yamlFile) {
      console.error('❌ Error: YAML file path is required');
      console.log('Usage: node extractor.js <yaml-file> [output-directory]');
      process.exit(1);
    }
    
    // Create extractor and run
    const extractor = new ProjectExtractor(yamlFile, outputDir);
    await extractor.extractFiles();
    
    // Validate the extracted project
    extractor.validateProject();
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the extractor
if (require.main === module) {
  main();
}

module.exports = ProjectExtractor;