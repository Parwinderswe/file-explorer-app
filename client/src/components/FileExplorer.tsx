import React, { useState } from "react";
import SearchFilter from "./SearchFilter";
import FolderManager from "./FolderManager"; // or your main folder UI component

type FileItem = {
  _id: string;
  name: string;
  // type: "file" | "folder";
  type: string;
  folderId?: string;
  folderName:string;
  downloadToken:{ type: string, unique: true, index: true };
  createdAt?: string;
};

function FileExplorer() {
  const [searchResults, setSearchResults] = useState<FileItem[] | null>(null);
  const handleClearSearch = () => {
    setSearchResults(null);
    localStorage.removeItem("openFolderId");
  };
  
  const handleGoToFolder = (file: FileItem) => {
    if (file.folderId) {
       localStorage.setItem("openFolderId", file.folderId);
    const event = new CustomEvent<{ folderId: string; fileId: string }>("go-to-folder", { detail: { folderId: file.folderId, fileId: file._id }, });
    window.dispatchEvent(event);
    setSearchResults(null);
    } 
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <SearchFilter onResults={setSearchResults} />
        {searchResults !== null && (
          <button
            onClick={handleClearSearch}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* Conditional Rendering */}
      {searchResults !== null ? (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-500">No files or folders found.</p>
          ) : (
            <ul className="space-y-2">
              {searchResults.map((file) => (
                <li
                  key={file._id}
                  // onClick={()=>handleGoToFolder(file)}
                  onDoubleClick={(e) => {
                    e.stopPropagation(); 
                    handleGoToFolder(file);
                    //handleOpenFile(file);
                  }}
                  className="p-2 transition border rounded hover:bg-gray-100"
                >
                  <span className="font-medium">{file.name}</span>
                  {" "} {/*for space */}
                  <span className="text-sm text-gray-500">({file.type})</span>{"/"}
                  <span className="text-sm text-gray-500">({file.folderName ||"Unknown folder"})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <FolderManager />
      )}
    </div>
  );
}

export default FileExplorer;
