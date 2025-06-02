# Contribution Guidelines - DOTA

Thank you for your interest in contributing to the DOTA project! As an open-source initiative, we greatly value contributions from the community. To ensure a smooth and efficient collaboration, please follow the guidelines outlined below.

## Before You Contribute

- Please review the [documentation](https://dota.dreamsportslabs.com/) to understand the project's purpose and structure.
- Check existing Issues and Pull Requests to avoid duplication.

## Ways to Contribute

We welcome contributions in various forms, including but not limited to:

1. **Reporting Issues**: If you encounter bugs, or have feature suggestions, please:
   - Search existing Issues to check if the problem has already been reported.
   - If the issue is new, create a detailed GitHub Issue, including:
     - A clear and descriptive title.
     - Steps to reproduce (if applicable).
     - Expected and actual behavior.
     - Any relevant logs, screenshots, or configurations.

2. **Raise Pull Requests**: To contribute directly to the codebase:
   - Create a new branch, implement your changes, ensuring your code adheres to the project's standards.
   - Open a Pull Request to propose your changes, providing a detailed description of the update.
   - Update the documentation.
   - All PRs undergo review before merging. Engage constructively in discussions and incorporate feedback as needed.

## Coding Standards

- Strive for clean, readable, and well-documented code.
- Write relevant tests to validate new functionality.
- Use clear and descriptive commit messages.
- Follow the existing code style and patterns.

## Testing Guidelines

All contributions must be properly tested to maintain project stability:
- Write unit tests for new functionality
- Ensure all existing tests pass
- Include integration tests where appropriate
- Test across different environments (local, AWS, Azure)

## Documentation Updates

- If your contribution introduces new features or modifications, ensure that the relevant documentation is updated.
- Maintain clarity and completeness in documentation for ease of understanding.
- Update README.md if necessary
- Add or update API documentation

## Code Review Process

- All Pull Requests undergo review by community members before merging.
- Be open to feedback and engage constructively in discussions.
- Address requested changes promptly to facilitate timely integration.
- Ensure CI/CD checks pass before requesting review.

## Getting Support

- If you have questions or need clarification on contributing, reach out via:
  - [Issue Tracker](https://github.com/dream-sports-labs/dota/issues)
  - [Discord](https://discord.gg/tUpDV8EaDM)
## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Docker Desktop (must be running)
- npm (Node Package Manager)
- Google OAuth configuration (optional)

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/dream-sports-labs/dota
```

2. Create environment files:
```bash
./env.dev.sh
```
This script copies `env.web.dev` from the root directory into `.env` files in both `api` and `web` directories.

3. Navigate to the API directory:
```bash
cd api
```

4. Start the development server:
```bash
npm run dev:web
```

After successful installation, you should see:
- Server running at `http://localhost:3010`
- CLI logged in (verify with `dota --version` and `dota whoami`)
- Web server running at `http://localhost:3000`

We appreciate your contributions to DOTA and look forward to your participation in improving this project! 🚀

Thank you for helping make DOTA a better platform! 🎉 