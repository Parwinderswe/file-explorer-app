// client/src/types/FileItem.ts
export type FileItem = {
  _id: string;
  name: string;
  size: number;
  type: string;
  data?: { data: number[] }; // Buffer JSON from Mongo
  folderId: string;
  folderName:string;
  createdAt: string;
  downloadToken: { type: string, unique: true, index: true };
  isShared?: boolean;
};
