import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { select, input } from '@inquirer/prompts';
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
            methods: ['personal_sign', 'eth_sendTransaction', 'eth_signTypedData'],
            chains: ['eip155:8453', 'eip155:1'], // Base, Mainnet
            events: ['chainChanged', 'accountsChanged'],
          },
        },
      });

      // Wait for connection
      this.log(chalk.cyan('⏳ Waiting for wallet connection...'));

      const session = provider.session;
      this.log(chalk.green(`\n✓ Connected to wallet!`));

      const accounts = session?.namespaces.eip155?.accounts || [];
      const address = accounts[0]?.split(':')[2];
      this.log(chalk.gray(`Address: ${address}`));

      // Interactive Loop
      let running = true;
      while (running) {
        const action = await select({
          message: 'Select an action:',
          choices: [
            { name: 'Personal Sign', value: 'personal_sign' },
            { name: 'Send Transaction (Mock)', value: 'eth_sendTransaction' },
            { name: 'View Session Details', value: 'session_details' },
            { name: 'Disconnect & Exit', value: 'exit' },
          ],
        });

        try {
          switch (action) {
            case 'personal_sign': {
              const message = await input({ message: 'Enter message to sign:', default: 'Hello from wc-auth!' });
              this.log(chalk.yellow('Requesting signature...'));
              const signature = await provider.request({
                method: 'personal_sign',
                params: [message, address],
              });
              this.log(chalk.green('\n✓ Signature received:'));
              this.log(chalk.gray(signature));
              break;
            }
            case 'eth_sendTransaction': {
              this.log(chalk.yellow('Requesting mock transaction...'));
              // Mock transaction
              const tx = {
                from: address,
                to: address, // Send to self
                data: '0x',
                value: '0x0', // 0 ETH
              };
              const hash = await provider.request({
                method: 'eth_sendTransaction',
                params: [tx],
              });
              this.log(chalk.green('\n✓ Transaction sent:'));
              this.log(chalk.gray(hash));
              break;
            }
            case 'session_details': {
              this.log(chalk.cyan('\nSession Details:'));
              console.log(JSON.stringify(provider.session, null, 2));
              break;
            }
            case 'exit': {
              running = false;
              await provider.disconnect();
              this.log(chalk.yellow('Disconnected.'));
              process.exit(0);
            }
          }
        } catch (error) {
          this.log(chalk.red(`\n❌ Action failed: ${(error as Error).message}`));
        }

        this.log(chalk.gray('─'.repeat(50)));
      }

    } catch (error) {
      spinner.fail('Failed to initialize');
      this.error(error as Error);
    }
  }
}
