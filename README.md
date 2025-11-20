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

### Via Bun (Recommended)

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
bun bin/run.ts request:siwe --chain eip155:8453 --domain my-app.reown.com
```

**Cacau (CAIP-74)**
```bash
bun bin/run.ts request:cacau --chain eip155:1
```

**Mock Auth Flows**
```bash
# Email
bun bin/run.ts request:email --email test@example.com

# Passkey
bun bin/run.ts request:passkey

# Social
bun bin/run.ts request:social --provider google
```

### 2. Verify Tokens

Decode and inspect a JWT:
```bash
bun bin/run.ts verify <jwt_string>
```

### 3. Session Management

**List saved sessions:**
```bash
bun bin/run.ts replay
```

**View session details:**
```bash
bun bin/run.ts replay <session_id>
```

### 4. Benchmarking

Measure wallet latency:
```bash
bun bin/run.ts benchmark --count 10
```

### 5. Playground

Start interactive playground:
```bash
bun bin/run.ts playground
```

### 6. Configuration & Themes

**Manage themes:**
```bash
# Interactive theme selection
bun bin/run.ts config theme

# Set theme directly
bun bin/run.ts config theme --set dracula

# Available themes: default, dracula, nord, monokai, solarized
```

**View current configuration:**
```bash
bun bin/run.ts config show
```

**Save Project ID:**
```bash
bun bin/run.ts config projectId --set your_project_id
```

### 7. Output Formats

Most commands support multiple output formats:
```bash
# JSON output
bun bin/run.ts verify <jwt> --output json

# YAML output
bun bin/run.ts replay <session-id> --output yaml

# Pretty output (default)
bun bin/run.ts verify <jwt> --output pretty
```

## Development

```bash
# Run tests
bun test

# Lint code
bun run lint
```

## License

MIT
