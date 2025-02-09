import { useState, useEffect } from "react";
import {
  createPublicClient,
  http,
  formatUnits,
  type PublicClient,
  type Address,
} from "viem";
import { baseSepolia, mainnet } from "viem/chains";
// Define the event structure
interface SupplyEvent {
  reserve?: string;
  user?: string;
  onBehalfOf?: string;
  amount?: bigint;
}

// Initialize the viem client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(
    `https://base-sepolia.g.alchemy.com/v2/${
      import.meta.env.PUBLIC_ALCHEMY_API_KEY
    }`,
  ),
});

export function useSupplyEvents(walletAddress: string) {
  const [events, setEvents] = useState<SupplyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!walletAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Replace with your actual contract address
        const contractAddress = "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b";

        const logs = await client.getLogs({
          address: contractAddress as Address,
          event: {
            type: "event",
            name: "Supply",
            inputs: [
              { type: "address", name: "reserve", indexed: true },
              { type: "address", name: "user", indexed: true },
              { type: "address", name: "onBehalfOf", indexed: true },
              { type: "uint256", name: "amount" },
            ],
          } as const,
          fromBlock: 21656730n,
          toBlock: "latest",
          args: {
            user: walletAddress as Address,
          },
        });

        console.log({ logs });

        const formattedEvents: SupplyEvent[] = logs.map((log) => ({
          reserve: log.args.reserve,
          user: log.args.user,
          onBehalfOf: log.args.onBehalfOf,
          amount: log.args.amount,
        }));

        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch events"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [walletAddress]);

  return {
    events,
    isLoading,
    error,
  };
}
