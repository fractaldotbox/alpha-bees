// import { z } from "zod";
// import { encodeFunctionData, Hex } from "viem";
// import { ActionProvider, CreateAction, EvmWalletProvider, Network } from "@coinbase/agentkit";
// import { GetSecretSchema } from "./schemas";

// export class NillionActionProvider extends ActionProvider<EvmWalletProvider> {
//     /**
//      * Constructor for the ERC20ActionProvider.
//      */
//     constructor() {
//         super("erc20", []);
//     }

//     /**
//      * Gets secret form nillion vault
//      *
//      * @param walletProvider - The wallet provider to get the balance from.
//      * @param args - The input arguments for the action.
//      * @returns A message containing the balance.
//      */
//     @CreateAction({
//         name: "get_secret",
//         description: `
//     This tool will get the secret from a nillion vault specified by schema id `,
//         schema: GetSecretSchema,
//     })
//     async getSecret(
//         walletProvider: EvmWalletProvider,
//         args: z.infer<typeof GetSecretSchema>,
//     ): Promise<string> {
//         return ''
//     }

//     /**
//      * Checks if the action provider supports the given network.
//      *
//      * @param _ - The network to check.
//      * @returns True if the action provider supports the network, false otherwise.
//      */
//     supportsNetwork = (_: Network) => true;
// }

// export const nillionActionProvider = () => new NillionActionProvider();
