import React from "react";
import { useStore } from "@nanostores/react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const MarketChart = () => {
  const messages = useStore($messages);

  console.log({ messages });

  return (
    <div className="w-full h-48 bg-white rounded-lg shadow flex items-center justify-center">
      {/* Placeholder for a live market chart */}
      {/* <span className="text-gray-500">Market Chart Coming Soon</span> */}
      {messages
        .filter((message) => !!message.graphData)
        .map((message) => (
          <YieldHistoricalChart poolId={message.graphData!.poolId} />
        ))}
    </div>
  );
};

export default MarketChart;
