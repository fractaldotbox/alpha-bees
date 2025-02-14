import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import React from "react";
import { TransactionTable } from "./geist/transaction-table";
import type { TransactionMeta } from "@/lib/domain/transaction/transaction";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { Explorer } from "@/lib/explorer/url";

const alchemy = new Alchemy({
  apiKey: import.meta.env.PUBLIC_ALCHEMY_API_KEY,
  network: Network.BASE_SEPOLIA,
});

export const invokeApi = async (endpoint: string, body?: any) => {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
};

export const getTxnsByFilter = async ({
  filter,
  type,
  method,
  address,
}: {
  filter?: string;
  type?: string[];
  method?: string;
  chainId?: number;
  address?: string;
}) => {
  if (address) {
    try {
      const txns = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
        ],
      });

      console.log("txns", txns);

      const formatted = txns.transfers.map(
        (tx) =>
          ({
            hash: tx.hash as `0x${string}`,
            from: tx.from as `0x${string}`,
            to: tx.to as `0x${string}`,
            value: tx.value ? BigInt(tx.value * 10 ** 18) : 0n,
            gas: 0n,
            blockNumber: tx.blockNum ? BigInt(tx.blockNum) : 0n,
            isSuccess: true,
            tokenTransfers: [],
          } satisfies Partial<TransactionMeta>),
      );

      console.log({ formatted });

      // Transform Alchemy response to match existing format
      return {
        items: formatted,
      };
    } catch (error) {
      console.error("Alchemy API error:", error);
      throw error;
    }
  }

  // Fallback to original Blockscout API if no address provided
  const queryString = new URLSearchParams({
    ...(filter && { filter }),
    ...(method && { method }),
    ...(type && { type: type.join(",") }),
  });
  const endpoint = `https://base-sepolia.blockscout.com/api/v2/transactions?${queryString.toString()}`;
  return await invokeApi(endpoint);
};

const TransactionsWidget = ({ address }: { address: string }) => {
  const [transactions, setTransactions] = React.useState<TransactionMeta[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await getTxnsByFilter({
          filter: "contract_call",
          method: "supply,withdraw",
          type: ["validated"],
          address: address,
        });
        console.log(response);
        setTransactions(response.items || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[200px] bg-white rounded-lg shadow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow">
      <TransactionTable
        transactions={transactions}
        chainId={baseSepolia.id}
        explorer={Explorer.Blockscout}
      />
    </div>
  );
};

export default TransactionsWidget;
