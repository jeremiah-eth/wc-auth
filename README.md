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

## Prerequisites

- **Bun**: This project is built exclusively with [Bun](https://bun.com).
- **WalletConnect Project ID**: Get one at [cloud.reown.com](https://cloud.reown.com).

## Installation

```bash
# Clone the repository
git clone https://github.com/jeremiah-eth/wc-auth.git
cd wc-auth

# Install dependencies
bun install

# Build the project
bun run build
```

## Configuration

Set your WalletConnect Project ID as an environment variable:

```bash
export WALLETCONNECT_PROJECT_ID="your_project_id_here"
```

Or pass it explicitly with the `--projectId` flag.

## Usage

Run the CLI using `bun bin/run.ts` (or `bin/run.js` after build).

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

## Development

```bash
# Run tests
bun test

# Lint code
bun run lint
```

## License

MIT
