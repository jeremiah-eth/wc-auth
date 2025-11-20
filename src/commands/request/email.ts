import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { input } from '@inquirer/prompts';

export default class RequestEmail extends Command {
    static override description = 'Request Email authentication (Mock)';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    static override flags = {
        email: Flags.string({
            char: 'e',
            description: 'Email address to authenticate',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(RequestEmail);

        const email = flags.email || await input({ message: 'Enter your email address:' });

        const spinner = ora(`Initiating email authentication for ${email}...`).start();

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        spinner.succeed('Magic link sent!');
        this.log(chalk.blue(`\n📧 A magic link has been sent to ${email}`));
        this.log(chalk.gray('In a real implementation, this would trigger a Web3Modal email auth flow.'));

        const code = await input({ message: 'Enter the 6-digit code from your email (Mock: 123456):' });

        const verifySpinner = ora('Verifying code...').start();
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code === '123456') {
            verifySpinner.succeed('Email verified successfully!');
            this.log(chalk.green('\n✓ Authenticated'));
            this.log(chalk.gray(`Session Token: mock-session-token-${Date.now()}`));
        } else {
            verifySpinner.fail('Invalid code');
            this.error('Authentication failed');
        }
    }
}
