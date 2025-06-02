# DOTA Documentation

A comprehensive documentation website for DOTA (Distribution Over The Air), a React Native over-the-air update service, built with React and Vite.

## Features

- 🎨 Modern, responsive design with dark/light mode support
- 📱 Mobile-friendly layout
- 📚 Comprehensive documentation sections
- 🔗 "On This Page" navigation for quick reference
- 🧭 Previous/Next navigation between pages

## Project Structure

This project uses React with Vite for a fast, modern development experience.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Structure

The documentation contains the following sections:

### Core Documentation
- Introduction
- Installation
- Deployment Options (Local, AWS, Azure)
- Configuration (Environment Variables, React Native Setup, OAuth Apps)
- CLI (Installation, Usage & API Reference)
- Advanced Topics (Metrics, Naming Limitations)

### Additional Resources
- Contribution Guide
- Community Resources

## Customization

### Styling

The site uses Tailwind CSS for styling. You can modify the design by editing the `tailwind.config.js` file and CSS files in the `src/styles` directory.

### Documentation Content

Documentation components are defined in the `src/components` directory. To add or modify content, edit the corresponding files.

## Building for Production

To build the site for production:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Contributing

We welcome contributions to improve the documentation. Please see the [Contribution Guide](/contribution) for more information.

## Community

Join the [DreamSportsLabs Discord server](https://discord.gg/tUpDV8EaDM) to connect with other DOTA users and contributors. 