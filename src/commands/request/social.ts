import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { select } from '@inquirer/prompts';

export default class RequestSocial extends Command {
    static override description = 'Request Social authentication (Mock)';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --provider google',
    ];

    static override flags = {
        provider: Flags.string({
            char: 'p',
            description: 'Social provider (google, apple, discord, github)',
            options: ['google', 'apple', 'discord', 'github'],
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(RequestSocial);

        const provider = flags.provider || await select({
            message: 'Select a social provider:',
            choices: [
                { name: 'Google', value: 'google' },
                { name: 'Apple', value: 'apple' },
                { name: 'Discord', value: 'discord' },
                { name: 'GitHub', value: 'github' },
            ],
        });

        const spinner = ora(`Connecting to ${provider}...`).start();

        // Simulate OAuth redirect delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        spinner.text = 'Waiting for user approval...';

        // Simulate user interaction on provider page
        await new Promise(resolve => setTimeout(resolve, 2000));

        spinner.succeed(`Authenticated with ${provider}`);

        this.log(chalk.green('\n✓ Social Login Successful'));

        const mockUser = {
            id: `${provider}-user-${Math.floor(Math.random() * 10000)}`,
            email: `user@${provider}.com`,
            name: 'Test User',
            avatar: `https://${provider}.com/avatar/user.png`,
            provider: provider,
            issuedAt: new Date().toISOString(),
        };

        this.log(chalk.blue('\n👤 User Profile:'));
        this.log(JSON.stringify(mockUser, null, 2));

        this.log(chalk.gray(`\nSession Token: social-session-${Date.now()}`));
    }
}
