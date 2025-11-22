# wc-auth

**The definitive WalletConnect Auth CLI for Base builders.**

`wc-auth` is a powerful command-line tool designed to act as a "Postman for WalletConnect Auth". It allows developers to test, verify, and benchmark WalletConnect authentication flows directly from the terminal.

---

## 🚀 Quick Start

### Installation

```bash
# Install globally via npm
npm install -g wc-auth

# Or use directly with npx
npx wc-auth

# Install globally via Bun
bun install -g wc-auth

# Or use directly with bunx
bunx wc-auth
```

### Basic Workflow

```bash
# 1. Set your WalletConnect Project ID
export WALLETCONNECT_PROJECT_ID="your_project_id_here"

# 2. Request SIWE authentication
wc-auth request:siwe --chain eip155:8453 --domain my-app.com

# 3. Verify a JWT token
wc-auth verify <jwt_token>

# 4. View saved sessions
wc-auth replay
```

---

## 📋 What is wc-auth?

`wc-auth` is a comprehensive CLI tool for testing and debugging WalletConnect authentication flows. It's perfect for:

- **🔧 Development**: Test authentication flows without building a full dApp
- **🐛 Debugging**: Inspect JWT tokens and Cacao objects
- **⚡ Performance Testing**: Benchmark wallet response times
- **📚 Learning**: Understand WalletConnect Auth protocols (SIWE, CAIP-74)
- **🎨 Customization**: Beautiful themes and multiple output formats

---

## ✨ Features

- **🔐 SIWE (Sign-In with Ethereum)**: Initiate and verify SIWE requests
- **🥥 Cacau (CAIP-74)**: Support for Chain-Agnostic Capability User Authentication
- **📧 Mock Auth**: Simulate Email, Passkey, and Social login flows
- **🔍 Verify**: Decode and inspect JWTs and Cacao objects
- **📼 Replay**: Save and replay authentication sessions
- **⚡ Benchmark**: Measure wallet response latency
- **🎮 Playground**: Interactive mode for testing connections
- **🎨 Themes**: 5 beautiful color schemes (dracula, nord, monokai, solarized, default)
- **📊 Output Formats**: Export data as JSON, YAML, or pretty-printed

---

## 📦 Prerequisites

- **Bun**: This project is built exclusively with [Bun](https://bun.com)
- **WalletConnect Project ID**: Get one at [cloud.reown.com](https://cloud.reown.com)

---

## 🛠️ Installation

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

# Run locally
bun bin/run.ts
```

---

## ⚙️ Configuration

### Environment Variables

Set your WalletConnect Project ID as an environment variable:

```bash
# Linux/macOS
export WALLETCONNECT_PROJECT_ID="your_project_id_here"

# Windows (PowerShell)
$env:WALLETCONNECT_PROJECT_ID="your_project_id_here"

# Windows (CMD)
set WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Save Configuration

You can also save your Project ID using the config command:

```bash
wc-auth config projectId --set your_project_id_here
```

### View Current Configuration

```bash
wc-auth config show
```

---

## 📚 Command Reference

### 1. Authentication Requests

#### Sign-In with Ethereum (SIWE)

Request SIWE authentication from a wallet.

```bash
# Basic SIWE request on Base
wc-auth request:siwe --chain eip155:8453 --domain my-app.com

# SIWE with custom statement
wc-auth request:siwe \
  --chain eip155:8453 \
  --domain my-app.com \
  --statement "Sign in to access your account"

# SIWE with specific address
wc-auth request:siwe \
  --chain eip155:1 \
  --domain ethereum-app.com \
  --address 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Multiple chains
wc-auth request:siwe \
  --chain eip155:1 \
  --chain eip155:8453 \
  --domain multi-chain-app.com
```

**Options:**
- `--chain, -c`: Chain ID (e.g., `eip155:8453` for Base)
- `--domain, -d`: Your application domain
- `--statement, -s`: Custom message to display
- `--address, -a`: Specific wallet address to request
- `--projectId`: WalletConnect Project ID (overrides env var)

#### Cacau (CAIP-74)

Request Chain-Agnostic Capability User Authentication.

```bash
# Basic Cacau request
wc-auth request:cacau --chain eip155:1

# Cacau with custom capabilities
wc-auth request:cacau \
  --chain eip155:8453 \
  --capability "wallet:transfer" \
  --capability "wallet:sign"
```

**Options:**
- `--chain, -c`: Chain ID
- `--capability`: Requested capabilities (can specify multiple)
- `--projectId`: WalletConnect Project ID

#### Mock Authentication Flows

Test authentication flows without a real wallet.

**Email Authentication:**
```bash
# Mock email login
wc-auth request:email --email user@example.com

# With custom provider
wc-auth request:email \
  --email user@example.com \
  --provider "Custom Email Service"
```

**Passkey Authentication:**
```bash
# Mock passkey login
wc-auth request:passkey

# With custom username
wc-auth request:passkey --username "john_doe"
```

**Social Authentication:**
```bash
# Google login
wc-auth request:social --provider google

# GitHub login
wc-auth request:social --provider github

# Twitter login
wc-auth request:social --provider twitter

# Discord login
wc-auth request:social --provider discord
```

---

### 2. Token Verification

Decode and inspect JWT tokens and Cacao objects.

```bash
# Verify a JWT token
wc-auth verify eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# Verify with JSON output
wc-auth verify <jwt_token> --output json

# Verify with YAML output
wc-auth verify <jwt_token> --output yaml

# Verify and save to file
wc-auth verify <jwt_token> --output json > token-details.json
```

**Output includes:**
- Header information
- Payload claims
- Signature verification status
- Expiration time
- Issuer and audience
- Custom claims

---

### 3. Session Management

Save, list, and replay authentication sessions.

```bash
# List all saved sessions
wc-auth replay

# View specific session details
wc-auth replay <session_id>

# View session as JSON
wc-auth replay <session_id> --output json

# View session as YAML
wc-auth replay <session_id> --output yaml

# Delete a session
wc-auth replay <session_id> --delete
```

**Session data includes:**
- Timestamp
- Chain information
- Wallet address
- Authentication method
- Request/response details

---

### 4. Benchmarking

Measure wallet response times and performance.

```bash
# Run 10 benchmark tests
wc-auth benchmark --count 10

# Benchmark with specific chain
wc-auth benchmark --count 10 --chain eip155:8453

# Benchmark with custom timeout
wc-auth benchmark --count 10 --timeout 30000

# Export benchmark results
wc-auth benchmark --count 10 --output json > benchmark-results.json
```

**Metrics measured:**
- Connection time
- QR code generation time
- User approval time
- Total round-trip time
- Success rate
- Average, min, max response times

---

### 5. Interactive Playground

Start an interactive server for testing WalletConnect connections.

```bash
# Start playground on default port (31337)
wc-auth playground

# Start on custom port
wc-auth playground --port 8080

# Start with specific chain
wc-auth playground --chain base

# Start with custom project ID
wc-auth playground --projectId your_project_id
```

**Features:**
- Real-time connection status
- QR code display
- Session information
- Event logging
- Interactive testing

---

### 6. Configuration & Themes

#### Theme Management

```bash
# Interactive theme selection
wc-auth config theme

# Set theme directly
wc-auth config theme --set dracula

# Available themes
wc-auth config theme --list
```

**Available Themes:**
- `default` - Clean and minimal
- `dracula` - Dark purple theme
- `nord` - Arctic blue theme
- `monokai` - Warm dark theme
- `solarized` - Balanced light/dark theme

#### Project ID Management

```bash
# Save Project ID
wc-auth config projectId --set your_project_id

# View current Project ID
wc-auth config projectId

# Clear Project ID
wc-auth config projectId --clear
```

#### View All Configuration

```bash
# Show all configuration
wc-auth config show

# Show as JSON
wc-auth config show --output json
```

---

### 7. Output Formats

Most commands support multiple output formats:

```bash
# Pretty output (default) - Human-readable with colors
wc-auth verify <jwt> --output pretty

# JSON output - Machine-readable
wc-auth verify <jwt> --output json

# YAML output - Configuration-friendly
wc-auth verify <jwt> --output yaml
```

---

## 🌐 Supported Networks

`wc-auth` supports all EVM-compatible chains. Common examples:

| Network | Chain ID | Example |
|---------|----------|---------|
| Ethereum Mainnet | `eip155:1` | `--chain eip155:1` |
| Base | `eip155:8453` | `--chain eip155:8453` |
| Optimism | `eip155:10` | `--chain eip155:10` |
| Arbitrum | `eip155:42161` | `--chain eip155:42161` |
| Polygon | `eip155:137` | `--chain eip155:137` |
| Sepolia Testnet | `eip155:11155111` | `--chain eip155:11155111` |
| Base Sepolia | `eip155:84532` | `--chain eip155:84532` |

---

## 💡 Use Cases & Examples

### Example 1: Testing SIWE Flow for a Base dApp

```bash
# 1. Set your Project ID
export WALLETCONNECT_PROJECT_ID="abc123..."

# 2. Request SIWE authentication
wc-auth request:siwe \
  --chain eip155:8453 \
  --domain mybaseapp.com \
  --statement "Sign in to access your Base NFTs"

# 3. Scan QR code with your wallet and approve

# 4. Verify the returned JWT
wc-auth verify <jwt_token_from_wallet>

# 5. Save session for later replay
wc-auth replay
```

### Example 2: Benchmarking Wallet Performance

```bash
# Run 20 authentication requests and measure performance
wc-auth benchmark --count 20 --chain eip155:8453 --output json > perf-results.json

# Analyze results
cat perf-results.json | jq '.averageTime'
```

### Example 3: Multi-Chain Authentication

```bash
# Request authentication across multiple chains
wc-auth request:siwe \
  --chain eip155:1 \
  --chain eip155:8453 \
  --chain eip155:10 \
  --domain multi-chain-app.com
```

### Example 4: Debugging JWT Tokens

```bash
# Decode a JWT to inspect claims
wc-auth verify eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9... --output json | jq '.'

# Check expiration
wc-auth verify <jwt> --output json | jq '.payload.exp'

# Verify signature
wc-auth verify <jwt> --output json | jq '.valid'
```

### Example 5: CI/CD Integration

```bash
#!/bin/bash
# test-walletconnect-auth.sh

# Set Project ID from environment
export WALLETCONNECT_PROJECT_ID=$WC_PROJECT_ID

# Run authentication test
wc-auth request:siwe \
  --chain eip155:8453 \
  --domain ci-test.com \
  --output json > auth-result.json

# Verify the result
if [ $? -eq 0 ]; then
  echo "✅ WalletConnect Auth test passed"
  exit 0
else
  echo "❌ WalletConnect Auth test failed"
  exit 1
fi
```

---

## 🔧 Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution documentation.

```bash
# Run tests
bun test

# Lint code
bun run lint

# Generate documentation
bun run docs
```

---

## 🆘 Getting Help

- **Documentation**: [https://jeremiah-eth.github.io/wc-auth/](https://jeremiah-eth.github.io/wc-auth/)
- **Issues**: [GitHub Issues](https://github.com/jeremiah-eth/wc-auth/issues)
- **WalletConnect Docs**: [docs.walletconnect.com](https://docs.walletconnect.com)
- **Base Docs**: [docs.base.org](https://docs.base.org)

### Common Issues

**Issue: "WalletConnect Project ID is required"**
```bash
# Solution: Set your Project ID
export WALLETCONNECT_PROJECT_ID="your_project_id"
# Or save it permanently
wc-auth config projectId --set your_project_id
```

**Issue: "Connection timeout"**
```bash
# Solution: Increase timeout
wc-auth request:siwe --chain eip155:8453 --timeout 60000
```

**Issue: "Invalid chain ID"**
```bash
# Solution: Use proper CAIP-2 format
wc-auth request:siwe --chain eip155:8453  # ✅ Correct
wc-auth request:siwe --chain 8453         # ❌ Wrong
```

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built with:
- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- [WalletConnect](https://walletconnect.com) - Web3 authentication protocol
- [oclif](https://oclif.io) - CLI framework
- [Base](https://base.org) - Ethereum L2 network

---

**Made for Base builders**
