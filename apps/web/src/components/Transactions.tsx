import { useStore } from "@nanostores/react";
import React from "react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

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
}: {
  filter?: string;
  type?: string[];
  method?: string;
  chainId?: number;
}) => {
  const queryString = new URLSearchParams({
    ...(filter && { filter }),
    ...(method && { method }),
    ...(type && { type: type.join(",") }),
  });
  const endpoint = `https://base-sepolia.blockscout.com/api/v2/transactions?${queryString.toString()}`;
  return await invokeApi(endpoint);
};

const TransactionsWidget = ({ address }: { address: string }) => {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await getTxnsByFilter({
          filter: "contract_call",
          method: "supply,withdraw",
          type: ["validated"],
        });
        console.log(response);
        setTransactions(response.items.slice(0, 3) || []);
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
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Transaction Hash</th>
            <th className="p-4">Method</th>
            <th className="p-4">From</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.hash} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <a
                  href={`https://base-sepolia.blockscout.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono"
                >
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </a>
              </td>
              <td className="p-4">
                <a
                  href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono"
                >
                  {tx.method}
                </a>
              </td>
              <td className="p-4 font-mono">
                {/* {tx.from.hash.slice(0, 6)}...{tx.from.hash.slice(-4)} */}
                {address.slice(0, 6)}...{address.slice(-4)}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    tx.status === "ok"
                      ? "bg-green-100 text-green-800"
                      : tx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsWidget;
