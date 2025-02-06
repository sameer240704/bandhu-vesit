import ChatComponent from "@/components/Universe/ChatComponent";
import React from "react";

const MindplayUniversePage = () => {
  return (
    <div className="h-full w-full flex justify-center items-start gap-x-5">
      <div className="h-full flex flex-col gap-y-5 w-2/3">
        <div className="h-1/2 w-full rounded-xl border border-black"></div>
        <div className="h-1/2 w-full rounded-xl border border-black"></div>
      </div>

      <ChatComponent />
    </div>
  );
};

export default MindplayUniversePage;
