// CopyButton.tsx
import React from "react";
import { MdContentCopy } from "react-icons/md";

type Props = {
  onCopy: () => void;
  disabled: boolean;
};

function CopyButton({ onCopy, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onCopy}
      className={`flex items-center gap-2 px-4 py-2 border rounded-md transition
        ${disabled
          ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
          : "text-green-600 border-green-300 hover:bg-green-50"}`}
    >
      <MdContentCopy size={20} />
      <span className="font-medium">Copy</span>
    </button>
  );
}

export default CopyButton;
