import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Verify from './verify.js';
import { Config } from '@oclif/core';
import { SignJWT } from 'jose';
import { createSiweMessage } from 'viem/siwe';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

describe('Verify Command', () => {
    let config: Config;

    beforeEach(async () => {
        config = await Config.load();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should verify a valid JWT structure', async () => {
        const secret = new TextEncoder().encode('secret');
        const jwt = await new SignJWT({ 'urn:example:claim': true })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer('urn:example:issuer')
            .setExpirationTime('2h')
            .sign(secret);

        const cmd = new Verify([jwt, '--output', 'json'], config);
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await cmd.run();

        expect(logSpy).toHaveBeenCalled();
        const output = JSON.parse(logSpy.mock.calls[0][0]);
        expect(output.type).toBe('JWT');
        expect(output.payload.iss).toBe('urn:example:issuer');
        expect(output.verification.valid).toBe(false); // Not a DID, so verification fails/skips
    });

    it('should verify a Cacao object (Base64)', async () => {
        // Mock Cacao object
        const cacao = {
            h: { t: 'eip4361' },
            p: {
                iss: 'did:pkh:eip155:1:0x123',
                domain: 'example.com',
                aud: 'https://example.com',
                version: '1',
                nonce: '12345678',
                iat: new Date().toISOString(),
            },
            s: {
                t: 'eip191',
                s: '0xsignature',
                m: 'mock message' // We are mocking, so signature won't match message unless we sign it real
            }
        };

        const base64Cacao = Buffer.from(JSON.stringify(cacao)).toString('base64');
        const cmd = new Verify([base64Cacao, '--output', 'json'], config);
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await cmd.run();

        expect(logSpy).toHaveBeenCalled();
        const output = JSON.parse(logSpy.mock.calls[0][0]);
        expect(output.type).toBe('Cacao');
        expect(output.payload.iss).toBe('did:pkh:eip155:1:0x123');
        // Signature verification will fail because it's a mock signature
        expect(output.verification.valid).toBe(false);
    });

    it('should verify a valid signed Cacao object', async () => {
        // Generate a real signature
        const privateKey = generatePrivateKey();
        const account = privateKeyToAccount(privateKey);
        const address = account.address;

        const message = createSiweMessage({
            address,
            chainId: 1,
            domain: 'example.com',
            nonce: '12345678',
            uri: 'https://example.com',
            version: '1',
        });

        const signature = await account.signMessage({ message });

        const cacao = {
            h: { t: 'eip4361' },
            p: {
                iss: `did:pkh:eip155:1:${address}`,
                domain: 'example.com',
                aud: 'https://example.com',
                version: '1',
                nonce: '12345678',
                iat: new Date().toISOString(),
            },
            s: {
                t: 'eip191',
                s: signature,
                m: message
            }
        };

        const base64Cacao = Buffer.from(JSON.stringify(cacao)).toString('base64');
        const cmd = new Verify([base64Cacao, '--output', 'json'], config);
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await cmd.run();

        expect(logSpy).toHaveBeenCalled();
        const output = JSON.parse(logSpy.mock.calls[0][0]);
        expect(output.type).toBe('Cacao');
        expect(output.verification.valid).toBe(true);
        expect(output.verification.address).toBe(address);
    });
});
