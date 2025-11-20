import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import { decodeJwt, decodeProtectedHeader } from 'jose';
import { table } from 'table';

export default class Verify extends Command {
    static override description = 'Verify and decode a JWT token';

    static override examples = [
        '<%= config.bin %> <%= command.id %> <jwt>',
    ];

    static override args = {
        jwt: Args.string({ description: 'JWT token to verify', required: true }),
    };

    async run(): Promise<void> {
        const { args } = await this.parse(Verify);

        try {
            this.log(chalk.blue('🔍 Analyzing JWT...'));

            const header = decodeProtectedHeader(args.jwt);
            const payload = decodeJwt(args.jwt);

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

        } catch (error) {
            this.error(`Failed to decode JWT: ${(error as Error).message}`);
        }
    }
}
