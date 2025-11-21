import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import qrcode from 'qrcode-terminal';
import AuthClientSingleton from '../lib/auth-client.js';
import CleanupHandler from '../utils/cleanup.js';

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
      // Initialize Auth Client (Universal Provider)
      const provider = await AuthClientSingleton.getInstance(flags.projectId);
      spinner.succeed('WalletConnect initialized');

      this.log(chalk.green('\n🎮 WalletConnect Auth Playground'));
      this.log(chalk.gray('─'.repeat(50)));
      this.log(chalk.blue(`Port: ${flags.port}`));
      this.log(chalk.blue(`Default Chain: ${flags.chain}`));
      this.log(chalk.gray('─'.repeat(50)));

      // Create a pairing
      this.log(chalk.yellow('\n📱 Scan this QR code with your wallet:\n'));

      // Connect and generate URI
      await provider.connect({
        namespaces: {
          eip155: {
            methods: ['personal_sign', 'eth_sendTransaction'],
            chains: ['eip155:8453'], // Base
            events: ['chainChanged', 'accountsChanged'],
          },
        },
      });

      // Wait for connection
      this.log(chalk.cyan('⏳ Waiting for wallet connection...'));

      const session = provider.session;
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
