import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { createSiweMessage } from 'viem/siwe';
import AuthClientSingleton from '../../lib/auth-client.js';
import CleanupHandler from '../../utils/cleanup.js';

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
            const chainId = parseInt(flags.chain.split(':')[1]);
            this.log(chalk.green(`\n✓ Connected: ${address}`));

            // 1. Construct SIWE Message (which serves as the Cacao Payload)
            const nonce = Math.random().toString(36).substring(2, 15);
            const issuedAt = new Date().toISOString();
            const statement = 'Sign in with Cacau capability';
            const uri = `https://${flags.domain}`;
            const version = '1';
            const resources = ['urn:recap:eyJhdHQiOnsiY2hhdCI6eyJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfX19']; // Example ReCap

            const message = createSiweMessage({
                address: address as `0x${string}`,
                chainId: chainId,
                domain: flags.domain,
                nonce,
                uri,
                version,
                statement,
                resources,
            });

            this.log(chalk.yellow('\n📝 Requesting signature for Cacao payload:'));
            this.log(chalk.gray(message));

            // 2. Request Signature
            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, address],
            });

            this.log(chalk.green('\n✓ Signature received!'));

            // 3. Construct Cacao Object
            const cacao = {
                h: {
                    t: 'eip4361', // Header type for SIWE-based Cacao
                },
                p: {
                    iss: `did:pkh:${flags.chain}:${address}`,
                    domain: flags.domain,
                    aud: uri, // Audience is usually the URI in SIWE mapping
                    version,
                    nonce,
                    iat: issuedAt,
                    statement,
                    requestId: undefined,
                    resources,
                },
                s: {
                    t: 'eip191', // Signature type
                    s: signature,
                    m: message, // Optional: include message for easier verification
                },
            };

            this.log(chalk.green('\n🥥 Cacao Object Created:'));
            this.log(chalk.gray(JSON.stringify(cacao, null, 2)));

            // Base64 encode for easy transport/verification
            const base64Cacao = Buffer.from(JSON.stringify(cacao)).toString('base64');
            this.log(chalk.yellow('\n📦 Base64 Encoded Cacao (use with verify command):'));
            this.log(base64Cacao);

            this.log(chalk.yellow('\nPress Ctrl+C to exit'));
            await new Promise(() => { });

        } catch (error) {
            spinner.fail('Failed');
            this.error(error as Error);
        }
    }
}
