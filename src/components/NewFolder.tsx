import React, { useState } from "react";
import {
  MdCreateNewFolder,
  MdUpload,
  MdFolder
} from "react-icons/md";

function NewFolder() {
  const [folders, setFolders] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  const handleAddFolder = () => {
    if (folderName.trim()) {
      setFolders((prev) => [...prev, folderName.trim()]);
      setFolderName("");
      setShowModal(false);
    }
  };

  const handleFileUpload = (folder: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [folder]: [...(prev[folder] || []), ...fileArray],
    }));
  };

  return (
    <div className="w-full max-w-xl p-4">
      {/* New Folder Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
      >
        <MdCreateNewFolder size={20} />
        <span className="font-medium">NEW FOLDER</span>
      </button>

      {/* Folder List */}
      <div className="mt-6 space-y-4">
        {folders.map((folder, idx) => (
          <div
            key={idx}
            className="p-3 space-y-2 border rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-gray-800">
                <MdFolder />
                {folder}
              </div>
              <label className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 cursor-pointer hover:underline">
                <MdUpload />
                Upload
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(folder, e.target.files)}
                />
              </label>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles[folder]?.length > 0 && (
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {uploadedFiles[folder].map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-md"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFolder}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewFolder;
