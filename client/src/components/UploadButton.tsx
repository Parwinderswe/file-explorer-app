import React, { useRef } from "react";
import { MdUpload } from "react-icons/md";
import type { FileItem } from "../types/FileItem";

type UploadButtonProps = {
  // onUpload: (files: FileList | null) => void;
  onUpload: () => void; 
  disabled?: boolean;
  // existingFiles: { name: string }[];  
  existingFiles: FileItem[];
  folderId: string | null;
  showToast:(message:string)=>void;
  currentFolderPath: string;
};

function UploadButton({
  onUpload,
  disabled = false,
  existingFiles,
  folderId,
  showToast,
  currentFolderPath,
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;
    
    if (!folderId) {
      showToast("⚠️ Please select a folder first.");
      return;
    }

    const existingNames = new Set(
      existingFiles.map((f) => f.name.toLowerCase())
    );

    const filteredFiles = Array.from(newFiles).filter(
      (file) => !existingNames.has(file.name.toLowerCase())
    );

    if (filteredFiles.length === 0) {
      showToast("⚠️Selected files already exist in the folder.");
    } else {
      // const dataTransfer = new DataTransfer();
      // filteredFiles.forEach((f) => dataTransfer.items.add(f));

      const formData = new FormData();
      filteredFiles.forEach((file) => formData.append("files", file));
      formData.append("currentFolderPath", currentFolderPath);

      try {
        console.log("Uploading to folderId:", folderId);
        const res = await fetch(`http://localhost:5000/folders/upload/${folderId}`, {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (res.ok) {
          console.log("Upload success", result);
          const { uploadedCount, skippedCount } = result;
          
           if (uploadedCount > 0 && skippedCount > 0) {
            showToast(`✅ ${uploadedCount} uploaded, ⚠️ ${skippedCount} skipped`);
          } else if (uploadedCount > 0) {
            showToast(`✅ ${uploadedCount} file(s) uploaded successfully`);
          } else if (skippedCount > 0) {
            showToast(`⚠️ ${skippedCount} file(s) skipped (already exist)`);
          }
          onUpload();  //refresh files list
        } else {
          console.error("Upload error:", result.message);
          showToast("❌ Upload failed: " + result.message);
        }
      } catch (error) {
        console.error("Upload request failed:", error);
        showToast("❌ Network error: " + error);
      }
    }

    e.target.value = "";
  };

  return (
    <div>
      <button
        disabled={disabled}
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 border rounded-md transition 
          ${disabled
            ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
            : "text-blue-600 border-blue-300 hover:bg-blue-50"}`}
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
