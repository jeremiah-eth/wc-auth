import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import AuthClientSingleton from '../lib/auth-client';
import CleanupHandler from '../utils/cleanup';

export default class Benchmark extends Command {
    static override description = 'Benchmark wallet response times';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    static override flags = {
        count: Flags.integer({
            char: 'n',
            description: 'Number of requests to send',
            default: 5,
        }),
        projectId: Flags.string({
            description: 'WalletConnect Project ID',
            env: 'WALLETCONNECT_PROJECT_ID',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Benchmark);

        CleanupHandler.register();
        const spinner = ora('Initializing...').start();

        try {
            const provider = await AuthClientSingleton.getInstance(flags.projectId);
            spinner.succeed('Initialized');

            this.log(chalk.yellow('\n📱 Please connect your wallet for benchmarking...'));

            await provider.connect({
                namespaces: {
                    eip155: {
                        methods: ['eth_chainId', 'eth_blockNumber', 'personal_sign'],
                        chains: ['eip155:8453'],
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
            });

            const session = provider.session;
            if (!session) throw new Error('No session');

            this.log(chalk.green('✓ Connected'));
            this.log(chalk.blue(`\nStarting benchmark (${flags.count} requests)...`));
            this.log(chalk.gray('Using eth_chainId (read-only) for latency testing'));

            const results: number[] = [];

            for (let i = 0; i < flags.count; i++) {
                const start = performance.now();
                await provider.request({ method: 'eth_chainId' });
                const end = performance.now();
                const duration = end - start;
                results.push(duration);
                this.log(chalk.gray(`Request ${i + 1}: ${duration.toFixed(2)}ms`));
            }

            const avg = results.reduce((a, b) => a + b, 0) / results.length;
            const min = Math.min(...results);
            const max = Math.max(...results);

            this.log(chalk.green('\n📊 Benchmark Results:'));
            this.log(`Average: ${chalk.bold(avg.toFixed(2))}ms`);
            this.log(`Min: ${min.toFixed(2)}ms`);
            this.log(`Max: ${max.toFixed(2)}ms`);

            // Disconnect
            await provider.disconnect();
            process.exit(0);

        } catch (error) {
            spinner.fail('Benchmark failed');
            this.error(error as Error);
        }
    }
}
