import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import AuthClientSingleton from '../../lib/auth-client';
import CleanupHandler from '../../utils/cleanup';

export default class RequestCacau extends Command {
    static override description = 'Request CAIP-74 (Cacau) authentication';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --chain eip155:1',
    ];

    static override flags = {
        chain: Flags.string({
            char: 'c',
            description: 'Chain ID (e.g., eip155:1)',
            default: 'eip155:1',
        }),
        domain: Flags.string({
            char: 'd',
            description: 'Domain requesting the signature',
            default: 'wc-auth.cli',
        }),
        projectId: Flags.string({
            description: 'WalletConnect Project ID',
            env: 'WALLETCONNECT_PROJECT_ID',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(RequestCacau);

        CleanupHandler.register();
        const spinner = ora('Initializing WalletConnect...').start();

        try {
            const provider = await AuthClientSingleton.getInstance(flags.projectId);
            spinner.succeed('WalletConnect initialized');

            this.log(chalk.green('\n🥥 Cacau (CAIP-74) Authentication Request'));
            this.log(chalk.gray('─'.repeat(50)));
            this.log(chalk.blue(`Chain: ${flags.chain}`));
            this.log(chalk.blue(`Domain: ${flags.domain}`));
            this.log(chalk.gray('─'.repeat(50)));

            this.log(chalk.yellow('\n📱 Scan this QR code with your wallet:\n'));

            await provider.connect({
                namespaces: {
                    eip155: {
                        methods: ['personal_sign'],
                        chains: [flags.chain],
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
            });

            this.log(chalk.cyan('⏳ Waiting for wallet connection...'));

            const session = provider.session;
            if (!session) throw new Error('Failed to establish session');

            const accounts = session.namespaces.eip155?.accounts;
            if (!accounts || accounts.length === 0) throw new Error('No accounts found');

            const firstAccount = accounts[0];
            if (!firstAccount) throw new Error('No accounts found');

            const address = firstAccount.split(':')[2];
            this.log(chalk.green(`\n✓ Connected: ${address}`));

            // Construct Cacau payload (Simplified for demo)
            // In a real scenario, this would involve constructing a proper Cacao object
            // For now, we'll simulate the flow with a structured message
            const cacaoPayload = {
                domain: flags.domain,
                address,
                statement: 'Sign in with Cacau capability',
                uri: `https://${flags.domain}`,
                version: '1',
                chainId: flags.chain.split(':')[1],
                nonce: Math.random().toString(36).substring(2, 15),
                issuedAt: new Date().toISOString(),
                resources: ['urn:recap:eyJhdHQiOnsiY2hhdCI6eyJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfX19'] // Example ReCap
            };

            this.log(chalk.yellow('\n📝 Requesting signature for Cacau payload:'));
            this.log(chalk.gray(JSON.stringify(cacaoPayload, null, 2)));

            // We'll use personal_sign for the demo as standard wallets might not support specific cacao methods yet
            // But the payload structure mimics the intent
            const message = `
${cacaoPayload.domain} wants you to sign in with your Ethereum account:
${cacaoPayload.address}

${cacaoPayload.statement}

URI: ${cacaoPayload.uri}
Version: ${cacaoPayload.version}
Chain ID: ${cacaoPayload.chainId}
Nonce: ${cacaoPayload.nonce}
Issued At: ${cacaoPayload.issuedAt}
Resources:
- ${cacaoPayload.resources[0]}
`.trim();

            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, address],
            });

            this.log(chalk.green('\n✓ Signature received!'));
            this.log(chalk.gray(signature));

            this.log(chalk.yellow('\nPress Ctrl+C to exit'));
            await new Promise(() => { });

        } catch (error) {
            spinner.fail('Failed');
            this.error(error as Error);
        }
    }
}
