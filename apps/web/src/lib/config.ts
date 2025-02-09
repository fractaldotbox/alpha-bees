import { http, createPublicClient } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

// Public RPC clients for supported chains
export const sepoliaClient = createPublicClient({
	chain: sepolia,
	transport: http(),
});

export const baseSepoliaClient = createPublicClient({
	chain: baseSepolia,
	transport: http(),
});

// Chain configurations
export const supportedChains = [sepolia, baseSepolia];

// Contract addresses
export const contractAddresses = {
	sepolia: {
		agent: "0x4A9b1ECD1297493B4EfF34652710BD1cE52c6526",
	},
	baseSepolia: {
		aaveAgent: "0x94D8C42AFE90C15b7Dd55902f25ed6253fD47F8c",
		morphoAgent: "0x6B608C852850234d42e0C87db86C491A972E3E01",
	},
} as const;
