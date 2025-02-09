import { useState, useEffect } from "react";
import { createPublicClient, http, type Address } from "viem";
import { baseSepolia } from "viem/chains";

// Define the event structure based on the Withdraw event in L2PoolAbi
interface WithdrawEvent {
  reserve?: string;
  user?: string;
  to?: string;
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

export function useWithdrawEvents(walletAddress: string) {
  const [events, setEvents] = useState<WithdrawEvent[]>([]);
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

        const contractAddress = "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b";

        const logs = await client.getLogs({
          address: contractAddress as Address,
          event: {
            type: "event",
            name: "Withdraw",
            inputs: [
              { type: "address", name: "reserve", indexed: true },
              { type: "address", name: "user", indexed: true },
              { type: "address", name: "to", indexed: true },
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

        const formattedEvents: WithdrawEvent[] = logs.map((log) => ({
          reserve: log.args.reserve,
          user: log.args.user,
          to: log.args.to,
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
