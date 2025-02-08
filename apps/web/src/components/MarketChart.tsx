import React from "react";
import { useStore } from "@nanostores/react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const MarketChart = () => {
  const messages = useStore($messages);

  console.log({ messages });

  return (
    <div className="w-full bg-white rounded-lg shadow flex items-center justify-center">
      {/* Placeholder for a live market chart */}
      {messages.length === 0 && (
        <span className="text-gray-500">
          Market Chart will be drawn here after you ask a question
        </span>
      )}
      {messages.length > 0 &&
        messages
          .filter((message) => !!message.graphData)
          .map((message, index) => (
            <YieldHistoricalChart
              key={index}
              poolIds={message.graphData?.poolIds ?? []}
            />
          ))}
    </div>
  );
};

export default MarketChart;
