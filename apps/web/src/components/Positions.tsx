import { useStore } from "@nanostores/react";
import React from "react";
import { $messages } from "../store/messages";

const PositionsWidget = () => {
	const messages = useStore($messages);

	return (
		<div className="w-full min-h-[200px] bg-white rounded-lg shadow flex items-center justify-center">
			Aave / Morpho positions
		</div>
	);
};

export default PositionsWidget;
