import React, { useState } from "react";
import NewFolder from "./NewFolder";
import FolderList from "./FolderList";
import FolderViewer from "./FolderViewer";
import UploadButton from "./UploadButton";
import DeleteButton from "./DeleteButton";
import CutButton from "./CutButton";
import CopyButton from "./CopyButton";
import PasteButton from "./PasteButton";

function FolderManager() {
  const [folders, setFolders] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string[]>>({});
  const [clipboard, setClipboard] = useState<{
    type: 'cut' | 'copy';
    folder: string;
    filenames: string[];
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast =(message:string)=>{
    setToastMessage(message);
    setTimeout(()=>setToastMessage(null),3000)
  }

  const toggleFolderSelection = (folderName:string, selected:boolean)=>{  
    setSelectedFolders((prev)=>
    selected?[...prev,folderName]: prev.filter((f) => 
    f!==folderName)
  );
  };

  const toggleFileSelection = (filename: string) => {
    if (!activeFolder) return;
    setSelectedFiles((prev) => {
      const current = prev[activeFolder] || [];
      const isSelected = current.includes(filename);
      return {
        ...prev,
        [activeFolder]: isSelected
          ? current.filter((f) => f !== filename)
          : [...current, filename],
      };
    });
  };

  const addFolder = (name: string) => {
    if (!name.trim()) return;
    setFolders((prev) => [...prev, name.trim()]);
    showToast(`Folder "${name.trim()}" added`);
  };

  const uploadToActiveFolder = (files: FileList | null) => {
    if (!files || !activeFolder) return;
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [activeFolder]: [...(prev[activeFolder] || []), ...fileArray],
    }));
    showToast(`${fileArray.length} file(s) uploaded to "${activeFolder}"`);
  };

  const deleteSelectedFolders = () => {
    setFolders((prev) => prev.filter((f) => !selectedFolders.includes(f)));
    setSelectedFolders([]);
    setActiveFolder(null);
    showToast(`Deleted ${selectedFolders.length} folder(s)`);
  };

  const deleteSelectedFiles = () => {
    if (!activeFolder) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeFolder]: prev[activeFolder].filter(
        (file) => !(selectedFiles[activeFolder] || []).includes(file.name)
      ),
    }));
    setSelectedFiles((prev) => ({
      ...prev,
      [activeFolder]: [],
    }));
    showToast(`Deleted ${selectedFiles[activeFolder]?.length || 0} file(s)`);
  };

 const handlePaste = () => {
  if (!clipboard || !activeFolder) return;
  const { folder: sourceFolder, filenames, type } = clipboard;

  // For cut, ignore if pasting into same folder
  if (type === "cut" && sourceFolder === activeFolder) {
    showToast("Cannot paste cut items into the same folder");
    return;
  }

  const sourceFiles = uploadedFiles[sourceFolder] || [];
  const filesToPaste = sourceFiles.filter((f) => filenames.includes(f.name));

  setUploadedFiles((prev) => {
    const targetFiles = prev[activeFolder] || [];
    const existingNames = new Set(targetFiles.map((f) => f.name));

    const newFiles = filesToPaste.map((file) => {
      let newName = file.name;
      while (existingNames.has(newName)) {
        const parts = newName.split(".");
        if (parts.length > 1) {
          const ext = parts.pop();
          newName = `${parts.join(".")}_copy.${ext}`;
        } else {
          newName = `${newName}_copy`;
        }
      }
      existingNames.add(newName);
      return new File([file], newName, { type: file.type });
    });

    const updated = {
      ...prev,
      [activeFolder]: [...targetFiles, ...newFiles],
    };

    if (type === "cut") {
      updated[sourceFolder] = prev[sourceFolder].filter(
        (f) => !filenames.includes(f.name)
      );
    }

    return updated;
  });

  setSelectedFiles((prev) => ({
    ...prev,
    [sourceFolder]: [],
  }));

  setClipboard(null);
  showToast(`${type === 'cut' ? 'Moved' : 'Copied'} ${filenames.length} file(s)`);
};


  return (
    <div className="relative p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <NewFolder onAddFolder={addFolder} existingFolders={folders} />
        <UploadButton onUpload={uploadToActiveFolder} disabled={!activeFolder} />
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
                filenames: selectedFiles[activeFolder],
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
                filenames: selectedFiles[activeFolder],
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
      </div>

      <FolderList
        folders={folders}
        onSelect={setActiveFolder}
        activeFolder={activeFolder}
        selectedFolders={selectedFolders}
        onToggleSelect={toggleFolderSelection}
      />

      {activeFolder && (
        <FolderViewer
          folder={activeFolder}
          files={uploadedFiles[activeFolder] || []}
          onUpload={uploadToActiveFolder}
          selectedFiles={selectedFiles[activeFolder] || []}
          onSelectFile={toggleFileSelection}
        />
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
