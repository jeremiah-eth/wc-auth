import { expect, test } from '@oclif/test';

describe('wc-auth link command', () => {
    const wcUri = 'wc:1234567890@2?relay-protocol=irn&symKey=xyz';

    test
        .stdout()
        .command(['link', wcUri])
        .it('generates universal link by default', ctx => {
            expect(ctx.stdout).to.contain('Universal Link');
            expect(ctx.stdout).to.contain('https://app.walletconnect.org/wc?uri=');
        });

    test
        .stdout()
        .command(['link', wcUri, '--wallet', 'metamask'])
        .it('generates metamask deep link', ctx => {
            expect(ctx.stdout).to.contain('metamask Deep Link');
            expect(ctx.stdout).to.contain('metamask://wc?uri=');
        });

    test
        .command(['link', wcUri, '--wallet', 'invalidwallet'])
        .catch(err => {
            expect(err.message).to.contain('Unknown wallet: invalidwallet');
        })
        .it('errors on unknown wallet');
});
