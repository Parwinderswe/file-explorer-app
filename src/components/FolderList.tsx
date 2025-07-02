type Props = {
  folders: string[];
  onSelect: (name: string) => void;
  activeFolder: string | null;
  selectedFolders: string[];
  onToggleSelect: (folder: string, selected: boolean) => void;
};

function FolderList({ folders, onSelect, activeFolder, selectedFolders, onToggleSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {folders.map((folder) => {
        const isSelected = selectedFolders.includes(folder);
        return (
          <div
            key={folder}
            className={`relative px-3 py-2 rounded ${
              activeFolder === folder ? "bg-blue-100 font-semibold" : "bg-gray-100"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onToggleSelect(folder, e.target.checked)}
              className="absolute top-2 right-2"
            />
            <div onClick={() => onSelect(folder)} className="cursor-pointer">
              📁 {folder}
            </div>
          </div>
        );
      })}
    </div>
  );
}


export default FolderList;
