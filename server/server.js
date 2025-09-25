import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import FileItem from './models/FileItem.js';
import Folder from './models/Folder.js'
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const port = 5000;

// configure multer
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/folders/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body;

    let path = "";
    if (parentId) {
      const parent = await Folder.findById(parentId);
      if (!parent) {
        return res.status(400).json({ message: "Parent not found" });
      }
      path = `${parent.path}${parent.name}/`;
    }

    const folder = new Folder({ name, parentId, path });
     await folder.save();

    res.status(201).json({ message: "Folder created", folder });
  } catch (err) {
    res.status(500).json({ message: "Error creating folder", error: err.message });
  }
});
app.get("/folders/:id", async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json({
      message:"Folder fetched succesfully",
      folder
    })

  } catch (err) {
    console.error("Get folder error:", err);
    res.status(500).json({ error: "Failed to fetch folder" });
  }
});

app.get("/folders", async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json({ folders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching folders", error: err.message });
  }
});


//Logic to save files in folder
app.post("/folders/upload/:folderId", upload.array("files"), async (req, res) => {
    console.log('api hit');
  try {
    const {folderId}=req.params;
    const folder = await Folder.findById(folderId);
    if(!folder){
      res.status(400).json({message:"Folder not found"})
    }
    
    const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const savedFiles =[];
  let skippedCount = 0;

  for(const file of files){
    const exists= await FileItem.findOne({
      folderId:folder._id,
      name:file.originalname
    })

    if(exists){
      console.log(`Skipping duplicate: ${file.originalname}`);
       skippedCount++;
      continue;
    }

      const token = crypto.randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
     const newFile = new FileItem({
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        data: file.buffer,
        createdAt: new Date(),
        folderId: folder._id,
        downloadToken: token,
        downloadTokenExpiresAt: expiresAt,
      });

      const saved = await newFile.save();
      savedFiles.push(saved);
    // await Promise.all(newFile);
  }

     res.status(201).json({ 
       message: "Files uploaded successfully",
      uploadedCount: savedFiles.length,
      skippedCount,
      files: savedFiles.map((f) => ({
        id: f._id,
        name: f.name,
        size: f.size,
        type: f.type,
        createdAt: f.createdAt,
        downloadUrl: `http://localhost:5000/download/${f.downloadToken}`,
      })),
      });
    
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Error uploading files", details: err.message});
  }
});

//search file by name
app.get("/files/search", async (req, res) => {
  try {
    const { name } = req.query; // ?name=Screenshot.png
    if (!name) {
      return res.status(400).json({ message: "Please provide a file name" });
    }

    const files = await FileItem.find({ name: new RegExp(name, "i") });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.json(files.map(f => ({
      id: f._id,
      name: f.name,
      type: f.type,
      size: f.size,
      createdAt: f.createdAt
    })));
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/download/:token", async (req, res) => {
  try {
  const file = await FileItem.findOne({downloadToken: req.params.token});

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if(file.downloadTokenExpiresAt && file.downloadTokenExpiresAt <new Date()){
      return res.status(403).json({message:"Your Download link expired"})
    }

    res.set({
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    });

    // res.send(file.data);
    res.send(Buffer.from(file.data));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});
app.get("/folders/:folderId/files", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const files = await FileItem.find({ folderId: folder._id });

    res.status(200).json({files });
  } catch (err) {
    console.error("Fetch files error:", err);
    res.status(500).json({ error: "Failed to fetch files", details: err.message });
  }
});

// DELETE a file by id
app.delete("/files/:fileId",async (req, res)=>{
  try {
    const {fileId}=req.params;
    const deleted = await FileItem.findByIdAndDelete(fileId);
    if(!deleted){
      res.status(200).json({
        message:"File not found",
      })
    }

    res.status(200).json({message:"File deleted successfully",deleted})
    
  } catch (err) {
    console.error("Delete error:",err);
    res.status(500).json({error:"Failed to delete file",details:err.message})
  }
})

// DELETE a folder and all its files
app.delete("/folders/:folderId",async (req,res)=>{

  try {
    const {folderId}=req.params;

    const folder = await Folder.findById(folderId);
    if(!folder){
      return res.status(404).json({ message: "Folder not found" });
    }

    // Delete all files inside the folder
    await FileItem.deleteMany({folderId})

     // Delete the folder itself
    await Folder.findByIdAndDelete(folderId)

    res.status(200).json({ message: "Folder and its files deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", err);
    res.status(500).json({ error: "Failed to delete folder", details: err.message });
  }
})

// Paste (copy/cut) files between folders
app.post("/folders/paste", async (req, res) => {
  try {
    const { sourceFolder, targetFolder, filenames, action } = req.body;

    const files = await FileItem.find({
      folderId: sourceFolder,
      name: { $in: filenames },
    });
if (!files.length) {
      return res.status(404).json({ message: "No files to paste" });
    }
    const newFiles  = [];

    for (const file of files) {
      let baseName = file.name;
      let newName = baseName;

       //check if file with this name already exists in target folder
      if (action === "copy" || (action === "cut" && sourceFolder !== targetFolder)) {
        let counter = 0;
        while (
          await FileItem.exists({ folderId: targetFolder, name: newName })
        ) {
          counter++;
          const parts = baseName.split(".");
          if (parts.length > 1) {
            const ext = parts.pop();
            newName = `${parts.join(".")}_copy${counter === 1 ? "" : counter}.${ext}`;
          } else {
            newName = `${baseName}_copy${counter === 1 ? "" : counter}`;
          }
        }
      }

if (action === "copy") {
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); 
  const copy = new FileItem({
        name: newName,
        size: file.size,
        type: file.type,
        data: file.data,
        createdAt: new Date(),
        folderId: targetFolder,
        downloadToken: token,
        downloadTokenExpiresAt: expiresAt,
      });

      newFiles.push(await copy.save())
} else if (action === "cut") {
        // await FileItem.deleteOne({ _id: file._id });
        file.name = newName;
        file.folderId = targetFolder;
        await file.save();
        newFiles.push(file);
      }
    }

    res.json({ 
      message: `${action === "cut" ? "Moved" : "Paste"} ${newFiles.length} file(s)`,
      processedCount: newFiles.length, });
  } catch (err) {
    console.error("Paste error:", err);
    res.status(500).json({ message: "Paste failed", error: err.message });
  }
});



mongoose.connect("mongodb+srv://admin2:admin123@cluster0.anuv5v8.mongodb.net/file_explorer_db",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("MongoDB connected");
    app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
})


