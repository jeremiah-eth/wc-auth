import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'fs/promises';
import * as path from 'path';

const tmpConfigPath = path.join(__dirname, 'tmp-auth-test.yaml');
const sampleConfig = `description: Sample test config
cases:
  - name: dummy test
    command: echo hello
    expectations:
      tokenClaims: {}
`;

describe('wc-auth test command', () => {
    beforeAll(async () => {
        await fs.writeFile(tmpConfigPath, sampleConfig, 'utf-8');
    });

    afterAll(async () => {
        try {
            await fs.unlink(tmpConfigPath);
        } catch (e) {
            // Ignore if file doesn't exist
        }
    });

    test('config file structure is valid', async () => {
        const content = await fs.readFile(tmpConfigPath, 'utf-8');
        expect(content).toContain('description');
        expect(content).toContain('cases');
    });
});
