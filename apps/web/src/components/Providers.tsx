import { base } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <OnchainKitProvider
      config={{
        appearance: {
          name: "🐝αBees",
          logo: "https://onchainkit.xyz/favicon/48x48.png?v4-19-24",
          mode: "auto",
          theme: "default",
        },
      }}
      chain={base}
    >
      {children}
    </OnchainKitProvider>
  );
};
