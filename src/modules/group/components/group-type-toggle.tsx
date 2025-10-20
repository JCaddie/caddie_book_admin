"use client";

import React from "react";
import type { GroupType } from "@/shared/types";

interface GroupTypeToggleProps {
  value: GroupType;
  onChange: (value: GroupType) => void;
  disabled?: boolean;
}

const GroupTypeToggle: React.FC<GroupTypeToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onChange("PRIMARY")}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${
            value === "PRIMARY"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        주그룹
      </button>
      <button
        type="button"
        onClick={() => onChange("SPECIAL")}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${
            value === "SPECIAL"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        특수그룹
      </button>
    </div>
  );
};

export default GroupTypeToggle;
