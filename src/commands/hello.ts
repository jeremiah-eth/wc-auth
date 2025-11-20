import { Command } from '@oclif/core';
import chalk from 'chalk';

export default class Hello extends Command {
    static override description = 'Test command to verify CLI setup';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    async run(): Promise<void> {
        this.log(chalk.green('✓ wc-auth CLI is working!'));
        this.log(chalk.blue('WalletConnect Auth CLI for Base builders'));
    }
}
