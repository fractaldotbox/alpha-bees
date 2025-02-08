import React from "react";
import AgentAvatar from "./AgentAvatar";

import workerBeeImage from "../assets/worker_bee.png";

const WorkerBeeAvatarWidget = () => {
	return (
		<div className="grid grid-rows-[1fr,auto] h-full">
			<div className="bg-gray-900 rounded-lg shadow-lg p-2 flex items-center justify-center h-full">
				<AgentAvatar image={workerBeeImage} />
			</div>
		</div>
	);
};

export default WorkerBeeAvatarWidget;
