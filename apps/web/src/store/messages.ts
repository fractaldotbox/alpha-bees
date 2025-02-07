import { atom } from "nanostores";

export type Message = {
  sender: "agent" | "user";
  text: string;
  graphData?: {
    graphType: "yieldHistoricalGraph";
    poolId: string;
  };
};

// Create atom to store messages
const $messages = atom<Message[]>([
  {
    sender: "agent",
    text: "Hello, I am your AlphaBees Trading Agent. How can I assist you today?",
  },
]);

// Function to add a new message
export const setMessages = (messages: Message[]) => {
  $messages.set(messages);
};

// Function to get all messages
export const getMessages = () => {
  return $messages.get();
};

export { $messages };
