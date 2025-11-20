import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { table } from 'table';

export default class Replay extends Command {
    static override description = 'Replay/View a saved session';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> <session-id>',
    ];

    static override args = {
        sessionId: Args.string({ description: 'ID of the session to replay' }),
    };

    async run(): Promise<void> {
        const { args } = await this.parse(Replay);
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

            this.log(chalk.blue('Saved Sessions:'));
            const data = files.map(file => {
                const filePath = path.join(sessionsDir, file);
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    return [file.replace('.json', ''), content.timestamp || 'Unknown', content.topic || 'N/A'];
                } catch {
                    return [file, 'Error', 'Error'];
                }
            });

            this.log(table([['ID', 'Timestamp', 'Topic'], ...data]));
            this.log(chalk.gray('\nRun "wc-auth replay <session-id>" to view details.'));
            return;
        }

        // Show specific session
        const filePath = path.join(sessionsDir, `${args.sessionId}.json`);
        if (!fs.existsSync(filePath)) {
            this.error(`Session file not found: ${filePath}`);
        }

        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            this.log(chalk.green(`\nSession Details: ${args.sessionId}`));
            this.log(JSON.stringify(content, null, 2));
        } catch (error) {
            this.error(`Failed to read session file: ${(error as Error).message}`);
        }
    }
}
