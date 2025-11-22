import { Command, Flags } from '@oclif/core';
import { TestConfig, TestConfigSchema } from '../../types/test-schema.js';
import { readFile } from 'fs/promises';
import { parse as parseYaml } from 'yaml';
import chalk from 'chalk';
import { TestRunner } from '../../lib/test-runner.js';

export default class Test extends Command {
    static description = 'Run automated authentication tests defined in a configuration file';

    static examples = [
        '<%= config.bin %> <%= command.id %> --file ./auth-test.yaml',
        '<%= config.bin %> <%= command.id %> -f ./tests/suite.json',
    ];

    static flags = {
        file: Flags.string({
            char: 'f',
            description: 'Path to the test configuration file (YAML or JSON)',
            required: true,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Test);
        try {
            this.log(chalk.blue(`Loading test configuration from ${flags.file}...`));
            const config = await this.loadConfig(flags.file);
            this.log(chalk.green(`✓ Loaded configuration: ${config.description || 'No description'}`));
            this.log(chalk.gray(`Found ${config.cases.length} test cases.`));
            const runner = new TestRunner(config);
            const result = await runner.runAll();
            this.log(chalk.green(`Test summary: ${result.passed} passed, ${result.failed} failed`));
        } catch (error) {
            this.error(`Failed to run tests: ${(error as Error).message}`);
        }
    }

    private async loadConfig(filePath: string): Promise<TestConfig> {
        try {
            const content = await readFile(filePath, 'utf-8');
            let parsed: unknown;
            if (filePath.endsWith('.json')) {
                parsed = JSON.parse(content);
            } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
                parsed = parseYaml(content);
            } else {
                throw new Error('Unsupported file extension. Use .json, .yaml, or .yml');
            }
            const result = TestConfigSchema.safeParse(parsed);
            if (!result.success) {
                const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
                throw new Error(`Invalid configuration schema:\n${errors}`);
            }
            return result.data;
        } catch (error) {
            if ((error as any).code === 'ENOENT') {
                throw new Error(`File not found: ${filePath}`);
            }
            throw error;
        }
    }
}
