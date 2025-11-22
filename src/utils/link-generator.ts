// Utility functions for generating universal and deep links for WalletConnect

/**
 * Generates a universal link for a given WalletConnect URI.
 * Example: wc:... becomes https://app.walletconnect.org/wc?uri=...
 */
export function generateUniversalLink(wcUri: string): string {
    const encoded = encodeURIComponent(wcUri);
    return `https://app.walletconnect.org/wc?uri=${encoded}`;
}

/**
 * Generates a deep link for a specific wallet schema.
 * Supported schemas are defined in `wallet-links.ts`.
 */
export function generateDeepLink(wcUri: string, walletSchema: string): string {
    return `${walletSchema}://wc?uri=${encodeURIComponent(wcUri)}`;
}
