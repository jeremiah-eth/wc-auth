import { Command, Flags, Args } from '@oclif/core';
import { generateUniversalLink, generateDeepLink } from '../utils/link-generator.js';
import { WALLET_SCHEMES } from '../utils/wallet-links.js';
import chalk from 'chalk';

export default class Link extends Command {
    static description = 'Generate deep links for WalletConnect URIs';

    static examples = [
        '<%= config.bin %> <%= command.id %> "wc:..." --wallet metamask',
        '<%= config.bin %> <%= command.id %> "wc:..." --universal',
    ];

    static args = {
        uri: Args.string({ description: 'WalletConnect URI', required: true }),
    };

    static flags = {
        wallet: Flags.string({
            char: 'w',
            description: 'Target specific wallet app (e.g., metamask, rainbow)',
        }),
        universal: Flags.boolean({
            char: 'u',
            description: 'Generate a universal link (https://app.walletconnect.org)',
            exclusive: ['wallet'],
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Link);
        const uri = args.uri;

        if (flags.wallet) {
            const scheme = WALLET_SCHEMES[flags.wallet.toLowerCase()];
            if (!scheme) {
                this.error(`Unknown wallet: ${flags.wallet}. Supported: ${Object.keys(WALLET_SCHEMES).join(', ')}`);
            }
            const link = generateDeepLink(uri, scheme);
            this.log(chalk.green(`\n📱 ${flags.wallet} Deep Link:`));
            this.log(link);
        } else {
            // Default to universal link
            const link = generateUniversalLink(uri);
            this.log(chalk.green('\n🌍 Universal Link:'));
            this.log(link);
        }
    }
}
