import React, { useRef } from "react";
import { MdUpload } from "react-icons/md";

type UploadButtonProps = {
  onUpload: (files: FileList | null) => void;
  disabled?: boolean;
};

function UploadButton({ onUpload, disabled = false }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files);
    e.target.value = ""; 
  };

  return (
    <div>
      <button
        disabled={disabled}
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 border rounded-md transition 
          ${disabled ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100" : "text-blue-600 border-blue-300 hover:bg-blue-50"}`}
      >
        <MdUpload size={20} />
        <span className="font-medium">Upload</span>
      </button>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default UploadButton;
