import { base, baseSepolia, sepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { createConfig, http, injected, WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [baseSepolia, sepolia],
  connectors: [
    injected(),
    // coinbaseWallet({
    //   appName: "αBees",
    // }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      {/* <OnchainKitProvider
          config={{
            appearance: {
              name: "🐝αBees",
              logo: "https://onchainkit.xyz/favicon/48x48.png?v4-19-24",
              mode: "auto",
              theme: "default",
            },
          }}
          chain={base}
        > */}
      {children}
      {/* </OnchainKitProvider> */}
    </WagmiProvider>
  );
};
