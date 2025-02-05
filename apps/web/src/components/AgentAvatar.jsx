import React from "react";
import localBirdImage from "../assets/queen_bee_avatar.webp";

const AgentAvatar = () => {
	return (
		<div className="w-100 h-full mr-4 border border-yellow-500 rounded-lg flex items-center justify-center overflow-y-hidden">
			<img
				src={localBirdImage.src}
				alt="Agent Avatar"
				className="w-full h-full object-cover overflow-y-hidden"
			/>
		</div>
	);
};

export default AgentAvatar;
