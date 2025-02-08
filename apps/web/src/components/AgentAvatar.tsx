import React from "react";

const AgentAvatar = ({ image }) => {
	return (
		<div className="w-100 h-full mr-4 border border-yellow-500 rounded-lg flex items-center justify-center overflow-y-hidden">
			<img
				src={image.src}
				alt="Agent Avatar"
				className="w-full h-full object-cover overflow-y-hidden"
			/>
		</div>
	);
};

export default AgentAvatar;
