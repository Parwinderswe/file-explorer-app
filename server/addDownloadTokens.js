// scripts/addDownloadTokens.js
import mongoose from "mongoose";
import crypto from "crypto";
import FileItem from "./models/FileItem.js";

async function addDownloadTokens() {
  await mongoose.connect("mongodb+srv://admin2:admin123@cluster0.anuv5v8.mongodb.net/file_explorer_db");

  const result = await FileItem.updateMany(
    { downloadToken: { $exists: false } },
    { $set: { downloadToken: crypto.randomBytes(16).toString("hex") } }
  );

  console.log(`Updated ${result.modifiedCount} files with tokens`);
  await mongoose.disconnect();
}

addDownloadTokens().catch((err) => {
  console.error(err);
  process.exit(1);
});
