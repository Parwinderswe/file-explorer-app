import React, { useState, useEffect } from "react";
import type { FileItem } from "../types/FileItem";

type Props = {
  folderId: string;
  folderName: string;
  files: FileItem[];  
  selectedFiles: FileItem[];
  highlightedFileId?: string | null;
  onSelectFile: (file: FileItem) => void;
};

function FolderViewer({ folderName, files,selectedFiles, onSelectFile }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleFileClick = (file: FileItem) => {
    const blob = new Blob([new Uint8Array(file.data!.data)], { type: file.type });

    if (file.type.startsWith("image/")) {
      setPreviewImage(URL.createObjectURL(blob));
    } else {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-2 font-semibold">Inside folder: {folderName}</h2>
      {files.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {files.map((file) => (
            <li key={file._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                // checked={selectedFiles.includes(file.name)}
                 checked={selectedFiles.some((f) => f._id === file._id)} 
                onChange={() => onSelectFile(file)}
              />
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No files uploaded yet.</p>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setPreviewImage(null)}
        >
          <div className="bg-white p-4 rounded shadow-lg max-w-3xl max-h-[80%] overflow-auto">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[70vh]" />
            <button
              onClick={() => setPreviewImage(null)}
              className="px-4 py-1 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderViewer;
