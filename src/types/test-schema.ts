// Test configuration schema for wc-auth test command

import { z } from 'zod';

/**
 * Defines a single test case within a test configuration.
 */
export const TestCaseSchema = z.object({
    name: z.string(),
    // The command to execute, e.g., "request:siwe --chain eip155:8453"
    command: z.string(),
    // Expected token claims or other assertions
    expectations: z.object({
        address: z.string().optional(),
        chainId: z.string().optional(),
        // Additional custom expectations can be added as needed
    }).optional(),
});

/**
 * Top‑level test configuration file.
 */
export const TestConfigSchema = z.object({
    description: z.string().optional(),
    cases: z.array(TestCaseSchema),
});

type TestCase = z.infer<typeof TestCaseSchema>;
type TestConfig = z.infer<typeof TestConfigSchema>;

export { TestCase, TestConfig };
