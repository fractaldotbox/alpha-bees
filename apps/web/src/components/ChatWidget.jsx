import React, { useState } from "react";

const ChatWidget = () => {
	const [messages, setMessages] = useState([
		{
			sender: "agent",
			text: "Hello, I am your AlphaBees Trading Agent. How can I assist you today?",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		// Append the user's message to the conversation.
		const userMessage = { sender: "user", text: input };
		setMessages((prev) => [...prev, userMessage]);

		// Set loading and call the API.
		setLoading(true);
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input }),
			});
			const data = await response.json();
			// Append the API's response as the agent's message.
			setMessages((prev) => [
				...prev,
				{ sender: "agent", text: data.response || "No response from API" },
			]);
		} catch (error) {
			console.error(error);
			setMessages((prev) => [
				...prev,
				{ sender: "agent", text: "Error retrieving response." },
			]);
		}
		setLoading(false);
		setInput("");
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-4">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex ${msg.sender === "agent" ? "justify-start" : "justify-end"}`}
					>
						{msg.sender === "agent" && (
							<img
								src="/assets/agent_avatar.png"
								alt="Agent Avatar"
								className="w-8 h-8 rounded-full mr-2 border border-yellow-500"
							/>
						)}
						<div
							className={`p-3 rounded-lg max-w-xs break-words shadow-md ${
								msg.sender === "agent"
									? "bg-yellow-300 border border-yellow-400 text-gray-800"
									: "bg-yellow-700 border border-yellow-600 text-white"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				{loading && <div className="text-yellow-300">Fetching response...</div>}
			</div>
			<form onSubmit={handleSubmit} className="flex mt-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					className="flex-1 p-2 bg-gray-800 border border-yellow-700 rounded-l-lg focus:outline-none text-white placeholder-yellow-400"
				/>
				<button
					type="submit"
					className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-r-lg transition-colors"
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default ChatWidget;
