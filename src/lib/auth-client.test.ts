import { describe, it, expect } from 'bun:test';
import AuthClientSingleton from './auth-client.js';

describe('AuthClientSingleton', () => {
    it('should throw error when no project ID is provided', async () => {
        // Reset any existing instance
        AuthClientSingleton.reset();

        // Clear environment variable
        const originalProjectId = process.env.WALLETCONNECT_PROJECT_ID;
        delete process.env.WALLETCONNECT_PROJECT_ID;

        try {
            await expect(AuthClientSingleton.getInstance()).rejects.toThrow(
                'WalletConnect Project ID is required'
            );
        } finally {
            // Restore environment variable
            if (originalProjectId) {
                process.env.WALLETCONNECT_PROJECT_ID = originalProjectId;
            }
            AuthClientSingleton.reset();
        }
    });

    it('should return null when no instance exists', () => {
        AuthClientSingleton.reset();
        const instance = AuthClientSingleton.getCurrentInstance();
        expect(instance).toBeNull();
    });

    it('should reset instance successfully', () => {
        AuthClientSingleton.reset();
        const instance = AuthClientSingleton.getCurrentInstance();
        expect(instance).toBeNull();
    });
});
