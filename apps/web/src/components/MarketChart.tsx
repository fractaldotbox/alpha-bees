import React from "react";
import { useStore } from "@nanostores/react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const MarketChart = () => {
  const messages = useStore($messages);

  const messagesWithGraphData = messages.filter(
    (message) => !!message.graphData,
  );

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow flex items-center justify-center">
      {/* Placeholder for a live market chart */}
      {messagesWithGraphData.length === 0 && (
        <div className="text-black px-4">
          Market Chart will be drawn here after you ask a question
        </div>
      )}
      {messagesWithGraphData.length > 0 &&
        messagesWithGraphData.map((message, index) => (
          <YieldHistoricalChart
            key={index}
            poolIds={message.graphData?.poolIds ?? []}
          />
        ))}
    </div>
  );
};

export default MarketChart;
