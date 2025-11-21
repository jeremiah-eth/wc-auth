# Contributing to wc-auth

Thank you for your interest in contributing to `wc-auth`! This document provides a guide for developers who want to work on the codebase.

## 🛠 Prerequisites

- **Bun**: This project is built exclusively with [Bun](https://bun.com). Ensure you have it installed.
- **Node.js**: Required for some underlying dependencies (v18+).
- **Git**: For version control.

## 🚀 Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jeremiah-eth/wc-auth.git
    cd wc-auth
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Environment Setup:**
    Create a `.env` file (optional, as you can pass flags) or export variables:
    ```bash
    export WALLETCONNECT_PROJECT_ID="your_project_id"
    ```

## 📂 Project Structure

The project uses the [Oclif](https://oclif.io) framework.

```
wc-auth/
├── bin/
│   └── run.ts          # CLI entry point
├── src/
│   ├── commands/       # Oclif commands (the core logic)
│   │   ├── request/    # Sub-commands for 'request' (siwe, cacau, etc.)
│   │   ├── config.ts   # Configuration command
│   │   └── ...
│   ├── hooks/          # Oclif hooks (e.g., init hook for themes)
│   ├── lib/
│   │   └── auth-client.ts # Singleton wrapper for WalletConnect UniversalProvider
│   └── utils/
│       ├── cleanup.ts      # Graceful shutdown handler
│       ├── config.ts       # Persistent configuration (conf)
│       ├── output-formatter.ts # JSON/YAML/Pretty output logic
│       └── theme-manager.ts    # Color theme logic
├── test/               # Tests (Vitest)
└── package.json
```

## 💻 Development Workflow

### Running Locally

You can run the CLI directly from the source using `bun`:

```bash
# Run a command
bun bin/run.ts request:siwe --chain eip155:8453

# Run help
bun bin/run.ts --help
```

### Testing

We use [Vitest](https://vitest.dev) for testing.

```bash
# Run all tests
bun test

# Run tests with UI
bun test --ui
```

### Linting & Formatting

```bash
# Lint code
bun run lint
```

## 🏗 Architecture

### AuthClientSingleton (`src/lib/auth-client.ts`)
This is the core of the WalletConnect integration. It ensures a single instance of `UniversalProvider` is initialized and shared across commands. It handles:
- Initialization with Project ID.
- Session persistence (via `UniversalProvider`'s internal storage).
- Event listeners.

### Theme System (`src/utils/theme-manager.ts`)
A centralized theme manager that handles color schemes. It exports a `Theme` interface and several presets. The `init` hook loads the user's preferred theme on startup.

### Configuration (`src/utils/config.ts`)
Uses the `conf` library to persist user settings (theme, project ID) to the system's config directory.

## 📦 Release Process

To release a new version to npm:

1.  **Bump Version:**
    ```bash
    npm version patch # or minor/major
    ```
    This updates `package.json` and creates a git tag.

2.  **Publish:**
    ```bash
    npm publish
    ```

3.  **Push Tags:**
    ```bash
    git push --follow-tags
    ```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

Please ensure your code passes linting and tests before submitting!
