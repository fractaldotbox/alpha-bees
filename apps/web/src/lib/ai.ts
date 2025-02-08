export type YieldHistoricalGraphActionData = {
  poolId: string;
};

export type AgentAction = {
  action: "drawYieldHistoricalGraph";
  data: YieldHistoricalGraphActionData;
};

export type ChatParagraph = {
  text: string;
  actions: AgentAction[];
};

export type ChatMessage = {
  paragraphs: ChatParagraph[];
  sender: string; // agent name
};
