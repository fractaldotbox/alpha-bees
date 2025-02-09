import { parseEther, type Chain } from "viem";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

interface FundProps {
  recipientAddress: `0x${string}`;
  chain: Chain;
  token: string;
}

export function Fund({ recipientAddress, chain, token }: FundProps) {
  const [amount, setAmount] = useState("0.01");
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleSubmit = () => {
    // Convert amount to Wei
    const value = parseEther(amount);

    return {
      to: recipientAddress,
      value,
    };
  };

  return (
    <div className="w-[200px] h-[200px] bg-white rounded-lg shadow flex flex-col items-center justify-center gap-4">
      {/* <div className="flex justify-end w-full px-4">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Address
              className="text-sm text-gray-600"
              isSliced={true}
              address={address as `0x${string}`}
            />
            <button
              onClick={() => disconnect()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Disconnect
            </button>
          </div>
        )}
      </div> */}

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          step="0.01"
          min="0"
        />
        <span>{token}</span>
      </div>
    </div>
  );
}
