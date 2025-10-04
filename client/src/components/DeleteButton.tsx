import React from "react";
import { MdDelete } from "react-icons/md";

type DeleteButtonProps = {
  onDelete: () => void;
  disabled?: boolean;
};

function DeleteButton({ onDelete, disabled = false }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 border rounded-md transition 
        ${disabled
          ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
          : "text-red-600 border-red-300 hover:bg-red-50"}`}
    >
      <MdDelete size={20} />
      <span className="font-medium">Delete</span>
    </button>
  );
}

export default DeleteButton;
