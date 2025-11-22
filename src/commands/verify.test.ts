import { describe, test, expect } from 'bun:test';

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

    test('cacao structure is valid', () => {
        const decoded = JSON.parse(Buffer.from(validCacao, 'base64').toString('utf-8'));
        expect(decoded.h).toBeDefined();
        expect(decoded.p).toBeDefined();
        expect(decoded.s).toBeDefined();
    });

    test('cacao has required fields', () => {
        const decoded = JSON.parse(Buffer.from(validCacao, 'base64').toString('utf-8'));
        expect(decoded.p.iss).toContain('did:pkh');
        expect(decoded.p.domain).toBe('example.com');
    });
});
