import React from "react";
import { MdContentPaste } from "react-icons/md";

type Props = {
  onPaste: () => void;
  disabled: boolean;
};

function PasteButton({ onPaste, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onPaste}
      className={`flex items-center gap-2 px-4 py-2 border rounded-md transition 
        ${disabled ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100" : "text-green-600 border-green-300 hover:bg-green-50"}`}
    >
      <MdContentPaste size={20} />
      <span className="font-medium">Paste</span>
    </button>
  );
}

export default PasteButton;
