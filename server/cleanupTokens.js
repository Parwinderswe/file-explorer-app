// cleanupTokens.js
import mongoose from "mongoose";
import FileItem from "./models/FileItem.js";

await mongoose.connect("mongodb+srv://admin2:admin123@cluster0.anuv5v8.mongodb.net/file_explorer_db");

const result = await FileItem.updateMany(
  { downloadTokenExpiresAt: { $lt: new Date() } },
  { $unset: { downloadToken: "", downloadTokenExpiresAt: "" } }
);

console.log(`Cleaned up ${result.modifiedCount} expired tokens`);
await mongoose.disconnect();
