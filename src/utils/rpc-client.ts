// Simple RPC client utility for wc-auth commands

import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

/**
 * Returns a viem PublicClient for the given RPC URL.
 * If no URL is provided, defaults to the mainnet public RPC.
 */
export function getPublicClient(rpcUrl?: string): PublicClient {
    const url = rpcUrl ?? mainnet.rpcUrls.default.http[0];
    return createPublicClient({
        chain: mainnet,
        transport: http(url),
    });
}
