import React, { useState } from "react";
import MarketChart from "./MarketChart";
import Portfolio from "./Portfolio";

const Chatbot = () => {
	const [activeTab, setActiveTab] = useState("chat");
	const [messages, setMessages] = useState([
		{
			sender: "agent",
			text: "Hello, I am your AlphaBees Trading Agent. How can I assist you today?",
		},
	]);
	const [input, setInput] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage = { sender: "user", text: input };
		setMessages((prev) => [...prev, userMessage]);

		// Simulated agent response
		const agentResponse = {
			sender: "agent",
			text: "I'm processing your request...",
		};
		setTimeout(() => {
			setMessages((prev) => [...prev, agentResponse]);
		}, 500);

		setInput("");
	};

	return (
		<div className="flex flex-col h-screen bg-gray-900 text-white">
			<header className="bg-gradient-to-r from-yellow-800 to-amber-600 p-4 flex items-center justify-between shadow-lg">
				<div className="flex items-center">
					<img
						src="/assets/alphaBees-logo.png"
						alt="αBees Logo"
						className="w-10 h-10 mr-2 filter brightness-110"
					/>
					<h1 className="font-bold text-2xl text-yellow-200">
						αBees <span className="ml-1">🤖🐝</span>
					</h1>
				</div>
				<nav className="space-x-4">
					<button
						onClick={() => setActiveTab("chat")}
						className={`transition-colors px-4 py-2 rounded ${
							activeTab === "chat"
								? "bg-amber-500 text-black"
								: "bg-yellow-800 text-yellow-300 hover:bg-yellow-700"
						}`}
					>
						Chat
					</button>
					<button
						onClick={() => setActiveTab("portfolio")}
						className={`transition-colors px-4 py-2 rounded ${
							activeTab === "portfolio"
								? "bg-amber-500 text-black"
								: "bg-yellow-800 text-yellow-300 hover:bg-yellow-700"
						}`}
					>
						My Portfolio
					</button>
				</nav>
			</header>
			{activeTab === "chat" ? (
				<div className="flex flex-col flex-1 p-4 overflow-hidden">
					<div className="flex-1 overflow-y-auto pb-4 space-y-4">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${msg.sender === "agent" ? "flex-row" : "flex-row-reverse"}`}
							>
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
			) : (
				<div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-6">
					<div>
						<h2 className="text-xl font-bold text-yellow-200 mb-2">
							Market Chart
						</h2>
						<MarketChart />
					</div>
					<div>
						<h2 className="text-xl font-bold text-yellow-200 mb-2">
							Portfolio
						</h2>
						<Portfolio />
					</div>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
