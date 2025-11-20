import { Core } from '@walletconnect/core';
import { WalletKit } from '@reown/walletkit';
import type { IWalletKit } from '@reown/walletkit';

/**
 * Singleton wrapper for Reown WalletKit
 * WalletKit replaces the deprecated @walletconnect/auth-client and @walletconnect/sign-client
 * It provides both Sign API and Auth API (One-Click Auth) functionality
 */
class WalletKitSingleton {
  private static instance: IWalletKit | null = null;
  private static core: InstanceType<typeof Core> | null = null;
  private static initPromise: Promise<IWalletKit> | null = null;

  /**
   * Initialize or retrieve the WalletKit instance
   * @param projectId - WalletConnect Project ID from https://dashboard.reown.com
   * @returns Promise resolving to the WalletKit instance
   */
  static async getInstance(projectId?: string): Promise<IWalletKit> {
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
  private static async initialize(projectId?: string): Promise<IWalletKit> {
    const finalProjectId = projectId || process.env.WALLETCONNECT_PROJECT_ID || '';

    if (!finalProjectId) {
      throw new Error(
        'WalletConnect Project ID is required. Get one at https://dashboard.reown.com'
      );
    }

    // Initialize Core
    this.core = new Core({
      projectId: finalProjectId,
    });

    // Initialize WalletKit with the Core instance
    const walletKit = await WalletKit.init({
      core: this.core,
      metadata: {
        name: 'wc-auth CLI',
        description: 'The definitive WalletConnect Auth CLI for Base builders',
        url: 'https://github.com/jeremiah-eth/wc-auth',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    });

    // Set up event listeners for session proposals
    walletKit.on('session_proposal', (proposal) => {
      console.log('Session proposal received:', proposal);
    });

    // Set up event listeners for session requests
    walletKit.on('session_request', (request) => {
      console.log('Session request received:', request);
    });

    // Set up event listeners for authentication requests (One-Click Auth)
    walletKit.on('session_authenticate', (payload) => {
      console.log('Authentication request received:', payload);
    });

    return walletKit;
  }

  /**
   * Get the Core instance
   */
  static getCore(): InstanceType<typeof Core> | null {
    return this.core;
  }

  /**
   * Reset the singleton instance (useful for testing or cleanup)
   */
  static reset(): void {
    this.instance = null;
    this.core = null;
    this.initPromise = null;
  }

  /**
   * Get the current instance without initializing
   */
  static getCurrentInstance(): IWalletKit | null {
    return this.instance;
  }
}

export default WalletKitSingleton;
