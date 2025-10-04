import React, { useState,useEffect } from "react";
import NewFolder from "./NewFolder";
import FolderList from "./FolderList";
import FolderViewer from "./FolderViewer";
import UploadButton from "./UploadButton";
import DeleteButton from "./DeleteButton";
import CutButton from "./CutButton";
import CopyButton from "./CopyButton";
import PasteButton from "./PasteButton";
import ShareModal from "./ShareButton";
import { FiShare2 } from "react-icons/fi";
import type { FileItem } from "../types/FileItem";


type Folder = {
  _id: string;
  name: string;
};

function FolderManager() {
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(
  () => localStorage.getItem("openFolderId"));
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileItem[]>>({});
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, FileItem[]>>({});
  const [highlightedFileId, setHighlightedFileId] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  const [clipboard, setClipboard] = useState<{
    type: 'cut' | 'copy';
    folder: string;
    filenames: string[];
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const refreshFiles = async (folderId: string) => {
    if (!folderId) return;
  setLoadingFiles(true);
    try {
      const res = await fetch(
        `http://localhost:5000/folders/${folderId}/files`
      );
    if (!res.ok) {
      const err = await res.text();
      console.error("fetch failed:", err);
      return;
    }
      const data = await res.json();
      setUploadedFiles((prev) => ({...prev,[folderId]: data.files  }));
      setSelectedFiles((prev) => ({ ...prev, [folderId]: [] }));
    } catch (err) {
      console.error("Error refreshing files:", err);
    }
    finally {
    setLoadingFiles(false);
  }
  };

useEffect(() => {
    // Load folders from backend
    fetch("http://localhost:5000/folders")
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders)})
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  useEffect(() => {
  const handleGoToFolder = (e: Event) => {
    const {folderId,fileId } = (e as CustomEvent<{folderId: string; fileId: string}>).detail;
    if (folderId) {
      setActiveFolder(folderId);
       setHighlightedFileId(fileId || null);
      void refreshFiles(folderId); 
    }
  };

  window.addEventListener("go-to-folder", handleGoToFolder);
  return () => {window.removeEventListener("go-to-folder", handleGoToFolder)};
}, []);


  const showToast =(message:string)=>{
    setToastMessage(message);
    setTimeout(()=>setToastMessage(null),3000)
  }

  const toggleFolderSelection = (folderId:string, selected:boolean)=>{  
    setSelectedFolders((prev)=>
    selected?[...prev,folderId]: prev.filter((id) => 
    id!==folderId)
  );
  };

  const addFolder = async (name: string) => {
    try {
      const res = await fetch("http://localhost:5000/folders/create-folder",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: null }),
      });

      const data=await res.json();
      setFolders((prev) => [...prev, data.folder]);
      showToast(`Folder "${name}" added`);
    } catch (err) {
      console.error("Error creating folder:", err);
      showToast("Error creating folder");
    }
  };

  const deleteSelectedFolders = async () => {
    if (selectedFolders.length === 0) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${selectedFolders.length} folder(s) and all their files?`
  );

  if (!confirmDelete) {
    showToast("Folder deletion cancelled");
    return;
  }

    try {
      await Promise.all(
        selectedFolders.map((folderId=>
          fetch(`http://localhost:5000/folders/${folderId}`,{
            method:"DELETE",
          })
        ))
      )

      setFolders((prev) => prev.filter((f) => !selectedFolders.includes(f._id)));
      setSelectedFolders([]);
      setActiveFolder(null);
      showToast(`Deleted ${selectedFolders.length} folder(s)`);
    } catch (err) {
       console.error("Error deleting folders:", err);
    showToast("Error deleting folders");
    }
  };

  const deleteSelectedFiles = async () => {
    if (!activeFolder) return;
    const filesToDelete = selectedFiles[activeFolder] || [];
    if (filesToDelete.length === 0) return;
    try {
      await Promise.all(
        filesToDelete.map((file) =>
          fetch(`http://localhost:5000/files/${file._id}`, {
            method: "DELETE",
          })
        )
    );

      setUploadedFiles((prev) => ({
      ...prev,
      [activeFolder]: prev[activeFolder].filter(
        (file) => !filesToDelete.some((sel) => sel._id === file._id)
      ),
    }));

    setSelectedFiles((prev) => ({
      ...prev,
      [activeFolder]: [],
    }));
    showToast(`Deleted ${selectedFiles[activeFolder]?.length || 0} file(s)`);
    
    } catch (err) {
      console.error("Error deleting files:", err);
    showToast("Error deleting files");
    }
    
    
  };

const handlePaste = async () => {
  if (!clipboard || !activeFolder) return;
  const { folder: sourceFolder, filenames, type } = clipboard;

  if (type === "cut" && sourceFolder === activeFolder) {
    showToast("Cannot paste cut items into the same folder");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/folders/paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceFolder,
        targetFolder: activeFolder,
        filenames,
        action: type,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(`Paste failed: ${err.message}`);
      return;
    }

    const data = await res.json();
    showToast(
      `${type === "cut" ? "Moved" : "Paste"} ${data.processedCount} file(s)`
    );

    await refreshFiles(activeFolder); // refresh active folder
    setClipboard(null);
    setSelectedFiles((prev) => ({ ...prev, [sourceFolder]: [] }));
  } catch (err) {
    console.error("Paste error:", err);
    showToast("Error while pasting files");
  }
};

useEffect(() => {
  if (activeFolder) {
    refreshFiles(activeFolder);
  }
}, [activeFolder]); 


  return (
    <div className="relative p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <NewFolder 
        onAddFolder={addFolder} 
        existingFolders={folders.map((f) => f.name)} />
      
       <UploadButton
  // onUpload={uploadToActiveFolder}
  onUpload={() => activeFolder && refreshFiles(activeFolder)}
  disabled={!activeFolder}
  existingFiles={activeFolder ? uploadedFiles[activeFolder] || [] : []}
  folderId={activeFolder}
  currentFolderPath={activeFolder || ""}
  showToast={showToast}
/>
        <DeleteButton
          onDelete={() => {
    if (selectedFolders.length > 0) {
      deleteSelectedFolders();
    } else {
      deleteSelectedFiles();
    }
  }}
          disabled={
            selectedFolders.length === 0 &&
            (!activeFolder || !selectedFiles[activeFolder]?.length)
          }
        />
        <CutButton
          onCut={() => {
            if (activeFolder && selectedFiles[activeFolder]?.length) {
              setClipboard({
                type: 'cut',
                folder: activeFolder,
                filenames: selectedFiles[activeFolder].map((f)=>f.name),
              });
              showToast("Cut ready to paste");
            }
          }}
          disabled={!activeFolder || !selectedFiles[activeFolder]?.length}
        />
        <CopyButton
          onCopy={() => {
            if (activeFolder && selectedFiles[activeFolder]?.length) {
              setClipboard({
                type: 'copy',
                folder: activeFolder,
                filenames: selectedFiles[activeFolder].map((f) => f.name),
              });
              showToast("Copied ready to paste");             
            }
          }}
          disabled={!activeFolder || !selectedFiles[activeFolder]?.length}
        />
        <PasteButton
           onPaste={handlePaste} 
          disabled={!clipboard || !activeFolder}
        />
        
<button
  onClick={() => setShowShareModal(true)}
  disabled={ selectedFolders.length ===0 &&
    (!activeFolder || !selectedFiles[activeFolder]?.length)}
  className={`flex items-center gap-1 px-4 py-2 border rounded transition text-sm font-medium
    ${
      selectedFolders.length === 0 &&
      (!activeFolder || !selectedFiles[activeFolder]?.length)
        ? "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
        : "text-white bg-green-600 border-green-700 hover:bg-green-700"
    }`}
>
  <FiShare2 size={20} />
  <span className="font-medium">Share</span>
  
</button>


{showShareModal && activeFolder && (
  <ShareModal
    files={selectedFiles[activeFolder] || []}
    onClose={() => setShowShareModal(false)}
  />
)}

      </div>

      <FolderList
        folders={folders}
        onSelect={(id) => 
          {setActiveFolder(id);
            refreshFiles(id); 
          }}
        activeFolder={activeFolder}
        selectedFolders={selectedFolders}
         onToggleSelect={toggleFolderSelection}
      />

      {activeFolder && (
        <>
         {loadingFiles ? (
      <div className="p-4 text-gray-500">Loading files...</div>
    ) : (
        <FolderViewer
        folderId={activeFolder}
    folderName={folders.find((f) => f._id === activeFolder)?.name || ""}
          // folder={activeFolder}
          files={uploadedFiles[activeFolder] ?? []}
          selectedFiles={selectedFiles[activeFolder] ?? []}
           highlightedFileId={highlightedFileId}
          onSelectFile={(filename) =>
            setSelectedFiles((prev) => ({
              ...prev,
              [activeFolder]: prev[activeFolder]?.includes(filename)
                ? prev[activeFolder].filter((f) => f !== filename)
                : [...(prev[activeFolder] || []), filename],
            }))
          }
        />)}
        </>
      )}

      {toastMessage && (
        <div className="fixed px-4 py-2 text-white bg-gray-800 rounded shadow bottom-4 right-4">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default FolderManager;
