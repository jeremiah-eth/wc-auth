import { TestConfig, TestCase } from '../types/test-schema.js';
import { assertTokenClaims, assertResponseTime } from './assertions.js';
import chalk from 'chalk';
import { exec } from 'child_process';

/**
 * Simple TestRunner that iterates over test cases and applies placeholder assertions.
 * In a full implementation this would execute commands, capture responses, and verify expectations.
 */
export class TestRunner {
    private config: TestConfig;
    private passed: number = 0;
    private failed: number = 0;

    constructor(config: TestConfig) {
        this.config = config;
    }

    /** Run a single test case scenario */
    private async runScenario(testCase: TestCase): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                exec(testCase.command, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Apply expectations if any
            if (testCase.expectations?.tokenClaims) {
                const dummyToken = 'dummy-token';
                assertTokenClaims(dummyToken, testCase.expectations.tokenClaims);
            }
            if (testCase.expectations?.maxResponseTimeMs) {
                const dummyDuration = 100; // placeholder
                assertResponseTime(dummyDuration, testCase.expectations.maxResponseTimeMs);
            }

            this.passed++;
            console.log(chalk.green(`✓ ${testCase.name}`));
        } catch (e) {
            this.failed++;
            console.error(chalk.red(`✗ ${testCase.name}: ${(e as Error).message}`));
        }
    }

    /** Run all test cases and return a summary object */
    async runAll(): Promise<{ passed: number; failed: number }> {
        for (const testCase of this.config.cases) {
            await this.runScenario(testCase);
        }
        return { passed: this.passed, failed: this.failed };
    }
}
