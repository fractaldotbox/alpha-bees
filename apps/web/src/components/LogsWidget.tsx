import { useStore } from "@nanostores/react";
import React, { useEffect, useState } from "react";
import { $messages } from "../store/messages";
import { YieldHistoricalChart } from "./YieldHistoricalChart";

const LogsWidget = ({ url }: { url: string }) => {
	const [logs, setLogs] = useState("");

	useEffect(() => {
		fetch(url)
			.then((res) => res.text())
			.then((data) => {
				setLogs(data);
			});
	}, []);

	return (
		<div className="w-full min-h-[200px] bg-white rounded-lg shadow flex items-center justify-center">
			Thoughts of Agent
			{JSON.stringify(logs)}
		</div>
	);
};

export default LogsWidget;
