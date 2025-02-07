import React, { useState } from "react";
import AgentAvatar from "./AgentAvatar";
import ChatBubble from "./ChatBubble";

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

    // Call the API endpoint.
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      console.log(data);
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
    <div className="grid grid-rows-[1fr,auto] h-full">
      {/* Messages Container */}
      <div className="overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`grid items-start gap-4 ${
              msg.sender === "agent"
                ? "grid-cols-[max-content,1fr]"
                : "grid-cols-[1fr,max-content]"
            }`}
          >
            <ChatBubble message={msg.text} sender={msg.sender} />
          </div>
        ))}
        {loading && <div className="text-yellow-300">Fetching response...</div>}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex p-4">
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
