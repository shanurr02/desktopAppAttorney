# Case Funders Desktop Application

A modern Electron desktop application built with React and TypeScript for legal case funding solutions.

## Features

- 🖥️ **Desktop Application**: Built with Electron for cross-platform compatibility
- ⚛️ **React Frontend**: Modern, responsive UI built with React 18
- 🎨 **Tailwind CSS**: Beautiful, utility-first CSS framework
- 🔧 **TypeScript**: Type-safe development experience
- 📱 **Responsive Design**: Works on various screen sizes
- 🎯 **Professional UI**: Clean, modern interface matching the Case Funders brand

## Tech Stack

- **Electron**: Desktop application framework
- **React 18**: Frontend library with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Webpack**: Module bundler
- **Electron Forge**: Build and packaging tool

## Project Structure

```
desktopAppAttorney/
├── src/
│   ├── assets/
│   │   └── logo/
│   │       ├── icon.png      # Application icon
│   │       └── image.png     # Logo image
│   ├── App.tsx              # Main React component
│   ├── renderer.tsx         # React entry point
│   ├── index.ts             # Electron main process
│   ├── index.html           # HTML template
│   ├── index.css            # Global styles
│   ├── types.d.ts           # Type declarations
│   └── preload.ts           # Preload script
├── forge.config.ts          # Electron Forge configuration
├── webpack.*.config.ts      # Webpack configurations
├── tsconfig.json            # TypeScript configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

### Building

Build the application for distribution:
```bash
npm run package
```

Create installers:
```bash
npm run make
```

## Configuration

### Application Icon

The application icon is configured in multiple places:
- `forge.config.ts`: For packaging and distribution
- `src/index.ts`: For the main window icon
- `src/App.tsx`: For the header logo

### Customization

- **Styling**: Modify `src/index.css` and `tailwind.config.js`
- **Components**: Edit `src/App.tsx` and create new components
- **Configuration**: Update `forge.config.ts` for build settings

## Features

- **Header**: Application logo and title
- **Menu Bar**: Standard desktop application menus
- **Main Content**: Welcome message and feature cards
- **Responsive Layout**: Adapts to different screen sizes
- **Modern UI**: Clean, professional design

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please contact the development team.
