import {
  MdCreateNewFolder,
  MdUpload,
  MdDelete,
  MdShare,
  MdContentCut,
  MdContentCopy,
  MdContentPaste,
  MdGridView,
  MdViewList
} from "react-icons/md";



function Toolbar() {
  const handleCreateFolder = () => {
    console.log("Create Folder clicked");

  };

  const handleUpload = () => {
    console.log("Upload clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  const btnList = [
    { label: "NEW FOLDER", icon: <MdCreateNewFolder />, onClick: handleCreateFolder },
    { label: "Upload", icon: <MdUpload />, onClick: handleUpload },
    { label: "Delete", icon: <MdDelete />, onClick: handleDelete },
    { label: "", icon: <MdContentCut /> },
    { label: "", icon: <MdContentCopy /> },
    { label: "", icon: <MdContentPaste /> },
    { label: "Share", icon: <MdShare />, onClick: handleShare }
  ];

  return (
    <div className="flex px-2 mb-4 space-x-3">
      {btnList.map((btn, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2 text-blue-500 transition-all border border-blue-300 rounded-md hover:bg-blue-50"
          onClick={btn.onClick} 
        >
          {btn.icon}
          {btn.label && <span className="font-medium">{btn.label}</span>}
        </button>
      ))}
      <div className="flex flex-auto"></div>
      <div className="justify-end gap-2 py-2 space-x-2 "> 
        {[MdGridView,MdViewList].map((Icon,index)=>(
            <button key={index} className="p-2 rounded-full hover:bg-slate-100">
            {<Icon size={25}/>}
        </button>
        ))}
      </div>
    </div>
  );
}

export default Toolbar;
