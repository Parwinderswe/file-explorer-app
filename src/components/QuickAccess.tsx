import { MdHome } from "react-icons/md";
import { FaTrash, FaShareAlt } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";

function QuickAccess() {
  const QuickItems = [
    { label: "Home", icon: <MdHome /> },
    { label: "Trash", icon: <FaTrash /> },
    { label: "Documents", icon: <IoDocuments /> }, 
    { label: "Shared", icon: <FaShareAlt /> }
  ];

  return (
    <div className="flex-1 flex-auto p-4 mb-4 space-y-2 overflow-hidden border shadow-sm bg-card">
      <h1 className='mb-4 text-xl'>Quick Access</h1>
      {QuickItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-gray-800">
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default QuickAccess;
