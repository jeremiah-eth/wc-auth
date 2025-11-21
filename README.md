# wc-auth

**The definitive WalletConnect Auth CLI for Base builders.**

`wc-auth` is a powerful CLI tool designed to act as a "Postman for WalletConnect Auth". It allows developers to test, verify, and benchmark WalletConnect authentication flows directly from the terminal.

## Features

- **🔐 SIWE (Sign-In with Ethereum)**: Initiate and verify SIWE requests.
- **🥥 Cacau (CAIP-74)**: Support for Chain-Agnostic Capability User Authentication.
- **📧 Mock Auth**: Simulate Email, Passkey, and Social login flows.
- **🔍 Verify**: Decode and inspect JWTs and Cacao objects.
- **📼 Replay**: Save and replay authentication sessions.
- **⚡ Benchmark**: Measure wallet response latency.
- **🎮 Playground**: Interactive mode for testing connections.
- **🎨 Themes**: 5 beautiful color schemes (dracula, nord, monokai, solarized, default).
- **📊 Output Formats**: Export data as JSON, YAML, or pretty-printed.

## Prerequisites

- **Bun**: This project is built exclusively with [Bun](https://bun.com).
- **WalletConnect Project ID**: Get one at [cloud.reown.com](https://cloud.reown.com).

## Installation

### Via npm (Recommended)

```bash
# Install globally
npm install -g wc-auth

# Or use directly with npx
npx wc-auth
```

### Via Bun

```bash
# Install globally
bun install -g wc-auth

# Or use directly with bunx
bunx wc-auth
```

### From Source

```bash
# Clone the repository
git clone https://github.com/jeremiah-eth/wc-auth.git
cd wc-auth

# Install dependencies
bun install
```

## Configuration

Set your WalletConnect Project ID as an environment variable:

```bash
export WALLETCONNECT_PROJECT_ID="your_project_id_here"
```

Or pass it explicitly with the `--projectId` flag.

## Usage

Run commands using `wc-auth` (if installed globally) or `bun bin/run.ts` (from source).

### 1. Request Authentication

**Sign-In with Ethereum (SIWE)**
```bash
wc-auth request:siwe --chain eip155:8453 --domain my-app.reown.com
```

**Cacau (CAIP-74)**
```bash
wc-auth request:cacau --chain eip155:1
```

**Mock Auth Flows**
```bash
# Email
wc-auth request:email --email test@example.com

# Passkey
wc-auth request:passkey

# Social
wc-auth request:social --provider google
```

### 2. Verify Tokens

Decode and inspect a JWT:
```bash
wc-auth verify <jwt_string>
```

### 3. Session Management

**List saved sessions:**
```bash
wc-auth replay
```

**View session details:**
```bash
wc-auth replay <session_id>
```

### 4. Benchmarking

Measure wallet latency:
```bash
wc-auth benchmark --count 10
```

### 5. Playground

Start interactive playground:
```bash
wc-auth playground
```

### 6. Configuration & Themes

**Manage themes:**
```bash
# Interactive theme selection
wc-auth config theme

# Set theme directly
wc-auth config theme --set dracula

# Available themes: default, dracula, nord, monokai, solarized
```

**View current configuration:**
```bash
wc-auth config show
```

**Save Project ID:**
```bash
wc-auth config projectId --set your_project_id
```

### 7. Output Formats

Most commands support multiple output formats:
```bash
# JSON output
wc-auth verify <jwt> --output json

# YAML output
wc-auth replay <session-id> --output yaml

# Pretty output (default)
wc-auth verify <jwt> --output pretty
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed developer documentation.

```bash
# Run tests
bun test

# Lint code
bun run lint
```

## License

MIT
