import { Command, Flags, Args } from '@oclif/core';
import { generateUniversalLink, generateDeepLink } from '../utils/link-generator.js';
import { WALLET_SCHEMES } from '../utils/wallet-links.js';
import chalk from 'chalk';
import qrcode from 'qrcode-terminal';

export default class Link extends Command {
    static description = 'Generate deep links for WalletConnect URIs';

    static examples = [
        '<%= config.bin %> <%= command.id %> "wc:..." --wallet metamask',
        '<%= config.bin %> <%= command.id %> "wc:..." --universal --qr',
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
        qr: Flags.boolean({
            description: 'Render QR code for the link',
            default: false,
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Link);
        const uri = args.uri;
        let link: string;

        if (flags.wallet) {
            const scheme = WALLET_SCHEMES[flags.wallet.toLowerCase()];
            if (!scheme) {
                this.error(`Unknown wallet: ${flags.wallet}. Supported: ${Object.keys(WALLET_SCHEMES).join(', ')}`);
            }
            link = generateDeepLink(uri, scheme);
            this.log(chalk.green(`\n📱 ${flags.wallet} Deep Link:`));
        } else {
            // Default to universal link
            link = generateUniversalLink(uri);
            this.log(chalk.green('\n🌍 Universal Link:'));
        }

        this.log(link);

        if (flags.qr) {
            this.log(chalk.yellow('\n📷 QR Code:'));
            qrcode.generate(link, { small: true });
        }
    }
}
