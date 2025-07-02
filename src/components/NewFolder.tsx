import React, { useState,useRef, useEffect } from "react";
import { MdCreateNewFolder } from "react-icons/md";

type NewFolderProps = {
  onAddFolder: (folderName: string) => void;
  existingFolders:string[];
};

function NewFolder({ onAddFolder,existingFolders }: NewFolderProps) {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const inputref = useRef<HTMLInputElement>(null);

  const handleAddFolder = () => {
    const trimmed =folderName.trim();
    if(!trimmed){
      setError("Folder name required");
      return;
    }
    const exists =existingFolders.some((f)=>f.toLowerCase()===trimmed.toLowerCase())
    if(exists){
      setError("Folder name must be unique.")
      return;
    }
      onAddFolder(trimmed);
      setFolderName("");
      setShowModal(false);
      setError("");
  };

  const handleCancel=()=>{
    setShowModal(false);
    setFolderName("");
    setError("")
  }

  useEffect(()=>{
    if(showModal)
      setTimeout(()=>inputref.current?.focus(),100);
  },[showModal])

  return (
    <div className="w-full max-w-md p-4">
      {/* New Folder Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
      >
        <MdCreateNewFolder size={20} />
        <span className="font-medium">NEW FOLDER</span>
      </button>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Create New Folder</h2>
            <input
            ref={inputref}
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) =>{ 
                setFolderName(e.target.value)
                setError("")
                }
              }
              onKeyDown={(e)=>{
                if(e.key ==="Enter"){
               handleAddFolder()
                }
              }}
              className="w-full px-3 py-2 mb-4 border rounded-md"
            />

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={ handleCancel}
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
