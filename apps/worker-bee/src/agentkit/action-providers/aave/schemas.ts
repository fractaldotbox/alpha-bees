import { z } from "zod";

export const AssetSchema = z.object({
	UNDERLYING: z
		.string()
		.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
		.describe(
			"The contract address of the underlying token of asset to supply",
		),

	A_TOKEN: z
		.string()
		.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
		.optional()
		.describe(
			"The contract address of the underlying token of asset to supply",
		),

	decimals: z.number().describe("decimals specified in ERC20, 18 for ETH"),
});

/**
 * Input schema for supply action.
 */
export const SupplySchema = z
	.object({
		amount: z
			.string()
			.regex(/^\d+$/, "Must be a valid whole number >0")
			.describe("The amount of the asset to supply"),

		assetAddress: z
			.string()
			.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
			.describe(
				"The contract address of the underlying token of asset to supply",
			),
	})
	.strip()
	.describe("Instructions for supplying assets")
	.strict();

export const WithdrawSchema = z
	.object({
		amount: z.custom<bigint>().describe("The amount of the asset to withdraw"),

		assetAddress: z
			.string()
			.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
			.describe(
				"The contract address of the underlying token of asset to withdraw",
			),
	})
	.strip()
	.describe("Instructions for withdrawing assets")
	.strict();