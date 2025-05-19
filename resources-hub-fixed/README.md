# Resources Hub - Web Programming II Project Showcase Platform

## Overview

Resources Hub is a centralized platform for hosting class projects, facilitating team demonstrations, and managing learning materials specifically designed for Web Programming II courses. This application provides students and instructors with an intuitive interface for project showcase, file management, and collaborative learning.

## Features

### Core Functionality
- **Project Gallery**: Browse and discover student projects with search and filtering capabilities
- **File Upload System**: Secure upload and management of project files with drag-and-drop support
- **User Authentication**: Role-based access control for students, instructors, and administrators
- **Version Control**: Track project changes and maintain version history
- **Search & Filter**: Advanced search with technology and metadata filters
- **Reviews & Rating**: Peer review system with star ratings and comments
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Open Application**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run format` - Formats code with Prettier

## Project Structure

```
src/
├── App.js           # Main application component
├── index.js         # React entry point
├── index.css        # Global styles and Tailwind imports
public/
├── index.html       # HTML template
└── ...              # Static assets
```

## Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS with custom utilities
- **Icons**: Lucide React icon library

## Development Guidelines

- Follow React best practices and hooks patterns
- Use Tailwind CSS for all styling
- Maintain component modularity and reusability
- Write descriptive comments for complex logic
- Test components thoroughly before deployment

## Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Static Hosting**
   The `build` folder contains the static files ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/your-org/resources-hub/issues).
