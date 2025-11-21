import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import { decodeJwt, decodeProtectedHeader } from 'jose';
import { table } from 'table';
import { OutputFormatter, type OutputFormat } from '../utils/output-formatter.js';

export default class Verify extends Command {
    static override description = 'Verify and decode a JWT token';

    static override examples = [
        '<%= config.bin %> <%= command.id %> <jwt>',
        '<%= config.bin %> <%= command.id %> <jwt> --output json',
    ];

    static override args = {
        jwt: Args.string({ description: 'JWT token to verify', required: true }),
    };

    static override flags = {
        output: Flags.string({
            char: 'o',
            description: 'Output format',
            options: ['json', 'yaml', 'pretty'],
            default: 'pretty',
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Verify);
        const outputFormat = flags.output as OutputFormat;

        try {
            const header = decodeProtectedHeader(args.jwt);
            const payload = decodeJwt(args.jwt);

            // Format timestamps
            const formattedPayload = { ...payload };
            ['iat', 'exp', 'nbf'].forEach(key => {
                if (formattedPayload[key]) {
                    formattedPayload[`${key}_iso`] = new Date((formattedPayload[key] as number) * 1000).toISOString();
                }
            });

            const result = {
                header,
                payload: formattedPayload,
                issuer: payload.iss || null,
            };

            if (outputFormat === 'pretty') {
                this.log(chalk.blue('🔍 Analyzing JWT...'));
                this.log(chalk.green('\n✓ JWT Decoded Successfully!'));

                // Display Header
                this.log(chalk.yellow('\n📜 Header:'));
                const headerData = Object.entries(header).map(([key, value]) => [key, JSON.stringify(value)]);
                this.log(table([['Key', 'Value'], ...headerData]));

                // Display Payload
                this.log(chalk.yellow('\n📦 Payload:'));
                const payloadData = Object.entries(payload).map(([key, value]) => {
                    let displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    if (key === 'iat' || key === 'exp' || key === 'nbf') {
                        displayValue += ` (${new Date((value as number) * 1000).toISOString()})`;
                    }
                    return [key, displayValue];
                });
                this.log(table([['Key', 'Value'], ...payloadData]));

                // Verification note
                this.log(chalk.gray('\nNote: Signature verification requires resolving the issuer DID.'));
                if (payload.iss) {
                    this.log(chalk.gray(`Issuer: ${payload.iss}`));
                }
            } else {
                OutputFormatter.print(result, outputFormat);
            }

        } catch (error) {
            this.error(`Failed to decode JWT: ${(error as Error).message}`);
        }
    }
}
