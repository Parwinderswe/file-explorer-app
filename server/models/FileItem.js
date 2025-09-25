import mongoose from "mongoose";

const fileItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: Number,
  type: String,
  data:Buffer,
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  createdAt: { type: Date, default: Date.now },
  downloadToken: { type: String, unique: true, index: true },
  downloadTokenExpiresAt: Date,
});

//Ensure filename is unique inside the same folder
fileItemSchema.index({ folderId: 1, name: 1 }, { unique: true });

const FileItem = mongoose.model("FileItem", fileItemSchema);
export default FileItem;
