import AuthClientSingleton from '../lib/auth-client.js';

/**
 * Cleanup handler for graceful shutdown
 * Ensures WalletConnect connections are properly closed on exit
 */
class CleanupHandler {
    private static isRegistered = false;

    /**
     * Register cleanup handlers for process signals
     */
    static register(): void {
        if (this.isRegistered) {
            return;
        }

        // Handle SIGINT (Ctrl+C)
        process.on('SIGINT', async () => {
            console.log('\n\nReceived SIGINT, cleaning up...');
            await this.cleanup();
            process.exit(0);
        });

        // Handle SIGTERM
        process.on('SIGTERM', async () => {
            console.log('\n\nReceived SIGTERM, cleaning up...');
            await this.cleanup();
            process.exit(0);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', async (error) => {
            console.error('Uncaught exception:', error);
            await this.cleanup();
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Unhandled rejection at:', promise, 'reason:', reason);
            await this.cleanup();
            process.exit(1);
        });

        this.isRegistered = true;
    }

    /**
     * Perform cleanup operations
     */
    private static async cleanup(): Promise<void> {
        try {
            const provider = AuthClientSingleton.getCurrentInstance();

            if (provider && provider.session) {
                console.log('Disconnecting WalletConnect session...');

                try {
                    await provider.disconnect();
                    console.log('Disconnected session');
                } catch (error) {
                    console.error('Error disconnecting session:', error);
                }
            }

            // Reset the singleton
            AuthClientSingleton.reset();
            console.log('Cleanup complete');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    /**
     * Manually trigger cleanup (useful for testing)
     */
    static async manualCleanup(): Promise<void> {
        await this.cleanup();
    }
}

export default CleanupHandler;
