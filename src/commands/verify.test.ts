import { expect, test } from '@oclif/test';
import { viem } from 'viem';

// Mocking viem's verifyMessage is complex in integration tests without a real RPC.
// For this unit test, we will verify that the command accepts the --rpc flag and attempts verification.
// We can check if it fails gracefully or outputs expected logs.

describe('wc-auth verify command', () => {
    const validCacao = Buffer.from(JSON.stringify({
        h: { t: 'eip4361' },
        p: {
            iss: 'did:pkh:eip155:1:0x123',
            domain: 'example.com',
            aud: 'https://example.com',
            version: '1',
            nonce: '12345678',
            iat: '2021-09-30T16:25:24Z',
            resources: ['ipfs://...']
        },
        s: {
            t: 'eip191',
            s: '0xsignature',
            m: 'example.com wants you to sign in...'
        }
    })).toString('base64');

    test
        .stdout()
        .command(['verify', validCacao])
        .it('runs verify without rpc', ctx => {
            expect(ctx.stdout).to.contain('Analyzing Cacao');
        });

    test
        .stdout()
        .command(['verify', validCacao, '--rpc', 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID'])
        .it('runs verify with rpc flag', ctx => {
            expect(ctx.stdout).to.contain('Analyzing Cacao');
            // Since the signature is fake, it should fail verification, but the command should run.
            expect(ctx.stdout).to.contain('Verification Failed');
        });
});
