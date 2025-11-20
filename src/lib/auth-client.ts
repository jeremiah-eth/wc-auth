import UniversalProvider from '@walletconnect/universal-provider';

/**
 * Singleton wrapper for WalletConnect Universal Provider
 * Acts as the dApp side to initiate authentication requests
 */
class AuthClientSingleton {
  private static instance: UniversalProvider | null = null;
  private static initPromise: Promise<UniversalProvider> | null = null;

  /**
   * Initialize or retrieve the UniversalProvider instance
   * @param projectId - WalletConnect Project ID
   * @returns Promise resolving to the UniversalProvider instance
   */
  static async getInstance(projectId?: string): Promise<UniversalProvider> {
    // If already initialized, return the instance
    if (this.instance) {
      return this.instance;
    }

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.initPromise = this.initialize(projectId);
    this.instance = await this.initPromise;
    this.initPromise = null;

    return this.instance;
  }

  /**
   * Internal initialization method
   */
  private static async initialize(projectId?: string): Promise<UniversalProvider> {
    const finalProjectId = projectId || process.env.WALLETCONNECT_PROJECT_ID || '';

    if (!finalProjectId) {
      throw new Error(
        'WalletConnect Project ID is required. Get one at https://cloud.walletconnect.com'
      );
    }

    // Initialize Universal Provider
    const provider = await UniversalProvider.init({
      projectId: finalProjectId,
      metadata: {
        name: 'wc-auth CLI',
        description: 'The definitive WalletConnect Auth CLI for Base builders',
        url: 'https://github.com/jeremiah-eth/wc-auth',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    });

    // Set up event listeners
    provider.on('display_uri', (uri: string) => {
      console.log('Pairing URI:', uri);
    });

    provider.on('session_ping', ({ id, topic }: { id: number; topic: string }) => {
      console.log('Session ping:', id, topic);
    });

    provider.on('session_event', ({ event, chainId }: { event: any; chainId: string }) => {
      console.log('Session event:', event, chainId);
    });

    provider.on('session_update', ({ topic, params }: { topic: string; params: any }) => {
      console.log('Session update:', topic, params);
    });

    provider.on('session_delete', ({ id, topic }: { id: number; topic: string }) => {
      console.log('Session deleted:', id, topic);
    });

    return provider;
  }

  /**
   * Reset the singleton instance (useful for testing or cleanup)
   */
  static reset(): void {
    this.instance = null;
    this.initPromise = null;
  }

  /**
   * Get the current instance without initializing
   */
  static getCurrentInstance(): UniversalProvider | null {
    return this.instance;
  }
}

export default AuthClientSingleton;

