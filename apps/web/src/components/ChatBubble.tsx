import React from "react";

const ChatBubble = ({ message, sender }) => {
	return (
		<div
			className={`p-3 rounded-lg max-w-xs break-words shadow-md ${
				sender === "agent"
					? "bg-yellow-300 border border-yellow-400 text-gray-800"
					: "bg-yellow-700 border border-yellow-600 text-white"
			}`}
		>
			{message}
		</div>
	);
};

export default ChatBubble;
