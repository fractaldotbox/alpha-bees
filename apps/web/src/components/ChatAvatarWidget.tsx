import React from "react";
import AgentAvatar from "./AgentAvatar";
import queenBeeImageMagic from "../assets/queen_bee_magic.gif";
import queenBeeSmileImage from "../assets/queen_bee_smile.gif";
import { $isQueenLoading } from "@/store/queen-loading-state";
import { useStore } from "@nanostores/react";

const ChatAvatarWidget = () => {
  const isQueenBeeLoading = useStore($isQueenLoading);

  return (
    <div className="grid grid-rows-[1fr,auto] h-full">
      <div className="bg-gray-900 rounded-lg shadow-lg p-2 flex items-center justify-center h-[360px]">
        <AgentAvatar
          image={isQueenBeeLoading ? queenBeeImageMagic : queenBeeSmileImage}
        />
      </div>
    </div>
  );
};

export default ChatAvatarWidget;
