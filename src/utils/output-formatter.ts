import chalk from 'chalk';
import { stringify as yamlStringify } from 'yaml';

export type OutputFormat = 'json' | 'yaml' | 'pretty';

export class OutputFormatter {
    static format(data: any, format: OutputFormat = 'pretty'): string {
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'yaml':
                return yamlStringify(data);
            case 'pretty':
            default:
                return this.prettyFormat(data);
        }
    }

    private static prettyFormat(data: any, indent = 0): string {
        const spaces = '  '.repeat(indent);

        if (typeof data !== 'object' || data === null) {
            return chalk.cyan(String(data));
        }

        if (Array.isArray(data)) {
            return data.map((item, i) =>
                `${spaces}${chalk.gray(`[${i}]`)} ${this.prettyFormat(item, indent + 1)}`
            ).join('\n');
        }

        return Object.entries(data)
            .map(([key, value]) => {
                const formattedKey = chalk.blue(key);
                if (typeof value === 'object' && value !== null) {
                    return `${spaces}${formattedKey}:\n${this.prettyFormat(value, indent + 1)}`;
                }
                return `${spaces}${formattedKey}: ${chalk.cyan(String(value))}`;
            })
            .join('\n');
    }

    static print(data: any, format: OutputFormat = 'pretty'): void {
        console.log(this.format(data, format));
    }
}
