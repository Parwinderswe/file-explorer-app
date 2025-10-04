type Folder = {
  _id: string;
  name: string;
};
type Props = {
  folders: Folder[];
  onSelect: (id: string) => void;
  activeFolder: string | null;
  selectedFolders: string[];
  onToggleSelect: (id: string, selected: boolean) => void;
};

function FolderList({ folders, onSelect, activeFolder, selectedFolders, onToggleSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {folders.map((folder) => {
        const isSelected = selectedFolders.includes(folder._id);
        return (
          <div
            key={folder._id}
            className={`relative px-3 py-2 rounded ${
              activeFolder === folder._id ? "bg-blue-100 font-semibold" : "bg-gray-100"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              
              onChange={(e) =>{
                // e.stopPropagation();
                onToggleSelect(folder._id, e.target.checked)
              } }
              className="absolute top-2 right-2"
            />
            <div onClick={() => onSelect(folder._id)} className="cursor-pointer">
              📁 {folder.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}


export default FolderList;
