import React from 'react';
import { FaWhatsapp, FaCopy, FaEnvelope } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import type { FileItem } from "../types/FileItem";

type ShareModalProps = {
  files: FileItem[];
  onClose: () => void;
};

const ShareModal: React.FC<ShareModalProps> = ({ files, onClose }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied!');
    } catch {
      alert('Failed to copy');
    }
  };

  const buildFileLinks = () => 
    files.map((f) => 
      // f.downloadUrl).join("\n");
  `http://localhost:5000/download/${f.downloadToken}`).join("\n");

  // Added/Updated: Centralized share options
  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-green-500" />,
      handler: () =>
        window.open(
          `https://wa.me/?text=Check these files:%0A${encodeURIComponent(
            buildFileLinks()
          )}`,
          "_blank"
        ),
    },
    {
      name: "Email",
      icon: <FaEnvelope className="text-blue-500" />,
      handler: () =>
        window.open(
          `mailto:?subject=Shared Files&body=Here are the files:%0A${encodeURIComponent(
            buildFileLinks()
          )}`
        ),
    },
    {
      name: "Copy Link",
      icon: <FaCopy className="text-gray-600" />,
      handler: () => copyToClipboard(buildFileLinks()),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Share Files</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500">
            <MdClose size={20} />
          </button>
        </div>

        <ul className="mb-4 overflow-y-auto text-sm max-h-40">
          {files.map((file) => (
            <li key={file._id} className="flex items-center justify-between mb-2">
             
              <span>{file.name}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`http://localhost:5000/download/${file.downloadToken}`)
                }
                className="text-blue-600 hover:underline"
              >
                Copy
                </button>              
            </li>
          ))}
        </ul>

          <div className="flex flex-wrap gap-3">
          {shareOptions.map((option, i) => (
            <button
              key={i}
              onClick={option.handler}
              className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>

         <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
