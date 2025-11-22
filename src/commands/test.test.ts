import { expect, test } from '@oclif/test';
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
    before(async () => {
        await fs.writeFile(tmpConfigPath, sampleConfig, 'utf-8');
    });

    after(async () => {
        await fs.unlink(tmpConfigPath);
    });

    test
        .stdout()
        .command(['test', '--file', tmpConfigPath])
        .it('runs and loads configuration without error', ctx => {
            expect(ctx.stdout).to.contain('Loaded configuration');
        });
});
