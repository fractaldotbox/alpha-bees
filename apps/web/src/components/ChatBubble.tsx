import Markdown from "react-markdown";
const ChatBubble = ({
	message,
	sender,
}: {
	message: string;
	sender: string;
}) => {
	return (
		<div
			className={`p-3 rounded-lg max-w-xs break-words shadow-md ${
				sender === "agent"
					? "bg-yellow-300 border border-yellow-400 text-gray-800"
					: "bg-yellow-700 border border-yellow-600 text-white"
			}`}
		>
			<Markdown>{message}</Markdown>
		</div>
	);
};

export default ChatBubble;
