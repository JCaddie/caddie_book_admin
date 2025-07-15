"use client";

import React from "react";
import { Button } from "@/shared/components/ui";

interface EmptyGroupsStateProps {
  onCreateGroup: () => void;
}

const EmptyGroupsState: React.FC<EmptyGroupsStateProps> = ({
  onCreateGroup,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-4 py-10 bg-white rounded-xl"
      style={{ height: "600px" }}
    >
      <div className="text-center">
        <p className="text-black text-[15px] font-bold leading-[1.6em] opacity-40">
          생성된 그룹이 없습니다.
          <br />
          그룹을 생성해주세요.
        </p>
      </div>
      <Button
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-[16px] font-semibold leading-[1.5em]"
        onClick={onCreateGroup}
      >
        그룹 생성
      </Button>
    </div>
  );
};

export default EmptyGroupsState;
