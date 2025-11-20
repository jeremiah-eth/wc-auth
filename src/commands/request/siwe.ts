import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import qrcode from 'qrcode-terminal';
import { populateAuthPayload } from '@walletconnect/utils';
import WalletKitSingleton from '../../lib/auth-client';
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
            // Initialize WalletKit
            const walletKit = await WalletKitSingleton.getInstance(flags.projectId);
            spinner.succeed('WalletConnect initialized');

            this.log(chalk.green('\n🔐 SIWE Authentication Request'));
            this.log(chalk.gray('─'.repeat(50)));
            this.log(chalk.blue(`Chain: ${flags.chain}`));
            this.log(chalk.blue(`Domain: ${flags.domain}`));
            this.log(chalk.gray('─'.repeat(50)));

            // Create authentication request
            this.log(chalk.yellow('\n📱 Scan this QR code with your wallet:\n'));

            // Create a pairing and authentication request
            const { uri } = await walletKit.pair();

            if (uri) {
                // Display QR code
                qrcode.generate(uri, { small: true });
                this.log(chalk.gray(`\nURI: ${uri}\n`));
            }

            this.log(chalk.cyan('⏳ Waiting for authentication...'));

            // Listen for authentication events
            walletKit.on('session_authenticate', async (payload) => {
                this.log(chalk.green('\n✓ Authentication request received!'));

                // Populate auth payload
                const authPayload = populateAuthPayload({
                    authPayload: payload.params.authPayload,
                    chains: [flags.chain],
                    methods: ['personal_sign', 'eth_sendTransaction'],
                });

                this.log(chalk.gray(JSON.stringify(authPayload, null, 2)));
            });

            // Keep the process running
            this.log(chalk.yellow('\n Press Ctrl+C to exit'));
            await new Promise(() => { }); // Keep alive

        } catch (error) {
            spinner.fail('Failed to initialize');
            this.error(error as Error);
        }
    }
}
