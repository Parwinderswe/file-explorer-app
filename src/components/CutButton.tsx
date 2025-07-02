import React from "react";
import { MdContentCut } from "react-icons/md";

type Props = {
  onCut: () => void;
  disabled: boolean;
};

function CutButton({ onCut, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onCut}
      className={`flex items-center gap-2 px-4 py-2 border rounded-md transition 
        ${disabled ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100" : "text-yellow-600 border-yellow-300 hover:bg-yellow-50"}`}
    >
      <MdContentCut size={20} />
      <span className="font-medium">Cut</span>
    </button>
  );
}

export default CutButton;
