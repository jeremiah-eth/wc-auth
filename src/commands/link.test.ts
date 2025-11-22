import { describe, test, expect } from 'bun:test';
import { generateUniversalLink, generateDeepLink } from '../utils/link-generator.js';
import { WALLET_SCHEMES } from '../utils/wallet-links.js';

describe('wc-auth link command', () => {
    const wcUri = 'wc:1234567890@2?relay-protocol=irn&symKey=xyz';

    test('generates universal link', () => {
        const link = generateUniversalLink(wcUri);
        expect(link).toContain('https://app.walletconnect.org/wc?uri=');
    });

    test('generates metamask deep link', () => {
        const scheme = WALLET_SCHEMES['metamask'];
        const link = generateDeepLink(wcUri, scheme);
        expect(link).toContain('metamask://wc?uri=');
    });

    test('wallet schemes include common wallets', () => {
        expect(WALLET_SCHEMES['metamask']).toBe('metamask');
        expect(WALLET_SCHEMES['rainbow']).toBe('rainbow');
        expect(WALLET_SCHEMES['coinbase']).toBe('cbwallet');
    });
});
