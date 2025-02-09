import { useStore } from "@nanostores/react";
import React from "react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const TransactionsWidget = ({ address }: { address: string }) => {
  const messages = useStore($messages);

  const transactions = [
    {
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      status: "Success",
    },
    {
      hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      status: "Pending",
    },
    {
      hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      status: "Failed",
    },
  ];

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Transaction Hash</th>
            <th className="p-4">From</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.hash} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <a
                  href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono"
                >
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </a>
              </td>
              <td className="p-4 font-mono">
                {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    tx.status === "Success"
                      ? "bg-green-100 text-green-800"
                      : tx.status === "Pending"
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
