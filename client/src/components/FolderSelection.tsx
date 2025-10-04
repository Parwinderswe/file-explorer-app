
function FolderSelection() {
  const folderList: string[] = ["All Files", "Images", "Documents", "Videos", "Shared"];

  return (
    <div className="p-3 w-60">
      <label htmlFor="folderSelect" className="block mb-2 text-sm font-medium text-gray-700">
        Select Folder
      </label>
      <select
        id="folderSelect"
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {folderList.map((list, index) => (
          <option key={index} value={list}>
            {list}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FolderSelection;
