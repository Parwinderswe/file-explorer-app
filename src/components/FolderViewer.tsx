import React, { useState } from "react";

type Props = {
  folder: string;
  files: File[];
  onUpload: (files: FileList | null) => void;
  selectedFiles: string[];
  onSelectFile: (filename: string) => void;
};

function FolderViewer({ folder, files, selectedFiles, onSelectFile }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileClick = (file: File) => {
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      setPreviewImage(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-2 font-semibold">Inside folder: {folder}</h2>

      {files.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.name)}
                onChange={() => onSelectFile(file.name)}
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
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[70vh]"
            />
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
