import { useStore } from "@nanostores/react";
import React from "react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const TransactionsWidget = () => {
	const messages = useStore($messages);

	return (
		<div className="w-full min-h-[200px] bg-white rounded-lg shadow flex items-center justify-center">
			Transactions
		</div>
	);
};

export default TransactionsWidget;
