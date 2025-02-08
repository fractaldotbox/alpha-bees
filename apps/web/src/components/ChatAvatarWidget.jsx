import React from "react";
import AgentAvatar from "./AgentAvatar";

const ChatAvatarWidget = () => {
	return (
		<div className="grid grid-rows-[1fr,auto] h-full">
			<div className="bg-gray-900 rounded-lg shadow-lg p-2 flex items-center justify-center h-full">
				<AgentAvatar />
			</div>
		</div>
	);
};

export default ChatAvatarWidget;
