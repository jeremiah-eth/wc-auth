import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { table } from 'table';
import { OutputFormatter, type OutputFormat } from '../utils/output-formatter.js';

export default class Replay extends Command {
    static override description = 'Replay/View a saved session';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> <session-id>',
        '<%= config.bin %> <%= command.id %> <session-id> --output json',
    ];

    static override args = {
        sessionId: Args.string({ description: 'ID of the session to replay' }),
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
        const { args, flags } = await this.parse(Replay);
        const outputFormat = flags.output as OutputFormat;
        const sessionsDir = path.join(os.homedir(), '.wc-auth', 'sessions');

        if (!fs.existsSync(sessionsDir)) {
            this.log(chalk.yellow('No sessions directory found.'));
            return;
        }

        if (!args.sessionId) {
            // List sessions
            const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));
            if (files.length === 0) {
                this.log(chalk.yellow('No saved sessions found.'));
                return;
            }

            const sessions = files.map(file => {
                const filePath = path.join(sessionsDir, file);
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    return {
                        id: file.replace('.json', ''),
                        timestamp: content.timestamp || 'Unknown',
                        topic: content.topic || 'N/A',
                    };
                } catch {
                    return {
                        id: file,
                        timestamp: 'Error',
                        topic: 'Error',
                    };
                }
            });

            if (outputFormat === 'pretty') {
                this.log(chalk.blue('Saved Sessions:'));
                const data = sessions.map(s => [s.id, s.timestamp, s.topic]);
                this.log(table([['ID', 'Timestamp', 'Topic'], ...data]));
                this.log(chalk.gray('\nRun "wc-auth replay <session-id>" to view details.'));
            } else {
                OutputFormatter.print({ sessions }, outputFormat);
            }
            return;
        }

        // Show specific session
        const filePath = path.join(sessionsDir, `${args.sessionId}.json`);
        if (!fs.existsSync(filePath)) {
            this.error(`Session file not found: ${filePath}`);
        }

        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            if (outputFormat === 'pretty') {
                this.log(chalk.green(`\nSession Details: ${args.sessionId}`));
                this.log(JSON.stringify(content, null, 2));
            } else {
                OutputFormatter.print(content, outputFormat);
            }
        } catch (error) {
            this.error(`Failed to read session file: ${(error as Error).message}`);
        }
    }
}
