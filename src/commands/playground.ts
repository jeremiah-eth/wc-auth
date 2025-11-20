import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import qrcode from 'qrcode-terminal';
import WalletKitSingleton from '../lib/auth-client';
import CleanupHandler from '../utils/cleanup';

export default class Playground extends Command {
    static override description = 'Start an interactive WalletConnect Auth playground server';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --port 8080',
        '<%= config.bin %> <%= command.id %> --chain base',
    ];

    static override flags = {
        port: Flags.integer({
            char: 'p',
            description: 'Port to run the server on',
            default: 31337,
        }),
        chain: Flags.string({
            char: 'c',
            description: 'Default chain (e.g., base, ethereum, polygon)',
            default: 'base',
        }),
        projectId: Flags.string({
            description: 'WalletConnect Project ID',
            env: 'WALLETCONNECT_PROJECT_ID',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Playground);

        // Register cleanup handlers
        CleanupHandler.register();

        const spinner = ora('Initializing WalletConnect...').start();

        try {
            // Initialize WalletKit
            const walletKit = await WalletKitSingleton.getInstance(flags.projectId);
            spinner.succeed('WalletConnect initialized');

            this.log(chalk.green('\n🎮 WalletConnect Auth Playground'));
            this.log(chalk.gray('─'.repeat(50)));
            this.log(chalk.blue(`Port: ${flags.port}`));
            this.log(chalk.blue(`Default Chain: ${flags.chain}`));
            this.log(chalk.gray('─'.repeat(50)));

            // For now, we'll create a simple pairing URI
            this.log(chalk.yellow('\n📱 Scan this QR code with your wallet:\n'));

            // Create a pairing
            const { uri, approval } = await walletKit.pair();

            if (uri) {
                // Display QR code
                qrcode.generate(uri, { small: true });
                this.log(chalk.gray(`\nURI: ${uri}\n`));
            }

            this.log(chalk.cyan('⏳ Waiting for wallet connection...'));

            // Wait for approval
            const session = await approval();
            this.log(chalk.green(`\n✓ Connected to wallet!`));
            this.log(chalk.gray(JSON.stringify(session, null, 2)));

            // Keep the process running
            this.log(chalk.yellow('\n Press Ctrl+C to exit'));
            await new Promise(() => { }); // Keep alive

        } catch (error) {
            spinner.fail('Failed to initialize');
            this.error(error as Error);
        }
    }
}
