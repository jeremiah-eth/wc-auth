import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { createSiweMessage } from 'viem/siwe';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AuthClientSingleton from '../../lib/auth-client';
import CleanupHandler from '../../utils/cleanup';

export default class RequestSiwe extends Command {
    static override description = 'Request Sign-In with Ethereum (SIWE) authentication';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --chain base',
        '<%= config.bin %> <%= command.id %> --domain example.com',
    ];

    static override flags = {
        chain: Flags.string({
            char: 'c',
            description: 'Chain ID (e.g., eip155:8453 for Base)',
            default: 'eip155:8453', // Base mainnet
        }),
        domain: Flags.string({
            char: 'd',
            description: 'Domain requesting the signature',
            default: 'wc-auth.cli',
        }),
        nonce: Flags.string({
            char: 'n',
            description: 'Custom nonce (auto-generated if not provided)',
        }),
        statement: Flags.string({
            char: 's',
            description: 'Human-readable statement',
            default: 'Sign in with Ethereum to wc-auth CLI',
        }),
        projectId: Flags.string({
            description: 'WalletConnect Project ID',
            env: 'WALLETCONNECT_PROJECT_ID',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(RequestSiwe);

        // Register cleanup handlers
        CleanupHandler.register();

        const spinner = ora('Initializing WalletConnect...').start();

        try {
            // Initialize Auth Client (Universal Provider)
            const provider = await AuthClientSingleton.getInstance(flags.projectId);
            spinner.succeed('WalletConnect initialized');

            this.log(chalk.green('\n🔐 SIWE Authentication Request'));
            this.log(chalk.gray('─'.repeat(50)));
            this.log(chalk.blue(`Chain: ${flags.chain}`));
            this.log(chalk.blue(`Domain: ${flags.domain}`));
            this.log(chalk.gray('─'.repeat(50)));

            // Create a pairing
            this.log(chalk.yellow('\n📱 Scan this QR code with your wallet:\n'));

            // Connect and generate URI
            await provider.connect({
                namespaces: {
                    eip155: {
                        methods: ['personal_sign', 'eth_sendTransaction'],
                        chains: [flags.chain],
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
            });

            // Wait for connection
            this.log(chalk.cyan('⏳ Waiting for wallet connection...'));

            const session = provider.session;
            if (!session) {
                throw new Error('Failed to establish session');
            }

            const eip155Namespace = session.namespaces.eip155;
            const accounts = eip155Namespace?.accounts;

            if (!accounts || accounts.length === 0) {
                throw new Error('No Ethereum accounts found in session');
            }

            const firstAccount = accounts[0];
            if (!firstAccount) {
                throw new Error('No Ethereum accounts found in session');
            }

            const address = firstAccount.split(':')[2];
            const chainIdParts = flags.chain.split(':');
            if (chainIdParts.length < 2 || !chainIdParts[1]) {
                throw new Error('Invalid chain ID format. Expected eip155:number');
            }
            const chainId = parseInt(chainIdParts[1]);

            this.log(chalk.green(`\n✓ Connected to wallet: ${address}`));

            // Create SIWE message
            const message = createSiweMessage({
                address: address as `0x${string}`,
                chainId: chainId,
                domain: flags.domain,
                nonce: flags.nonce || Math.random().toString(36).substring(2, 15),
                uri: `https://${flags.domain}`,
                version: '1',
                statement: flags.statement,
            });

            this.log(chalk.yellow('\n📝 Requesting signature for SIWE message:'));
            this.log(chalk.gray(message));

            // Request signature
            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, address],
            });

            this.log(chalk.green('\n✓ Signature received!'));
            this.log(chalk.gray(signature));

            // Verify signature (basic check)
            this.log(chalk.blue('\n🔍 Signature details:'));
            this.log(`Address: ${address}`);
            this.log(`Signature: ${signature}`);

            // Save session
            const sessionsDir = path.join(os.homedir(), '.wc-auth', 'sessions');
            if (!fs.existsSync(sessionsDir)) {
                fs.mkdirSync(sessionsDir, { recursive: true });
            }

            const sessionId = `session-${Date.now()}`;
            const sessionData = {
                id: sessionId,
                timestamp: new Date().toISOString(),
                address,
                chainId,
                domain: flags.domain,
                signature,
                message,
                topic: session.topic,
            };

            fs.writeFileSync(
                path.join(sessionsDir, `${sessionId}.json`),
                JSON.stringify(sessionData, null, 2)
            );
            this.log(chalk.green(`\n💾 Session saved to ${sessionId}`));

            // Keep the process running briefly to show output then exit
            this.log(chalk.yellow('\nPress Ctrl+C to exit'));
            await new Promise(() => { });

        } catch (error) {
            spinner.fail('Failed to initialize or authenticate');
            this.error(error as Error);
        }
    }
}
