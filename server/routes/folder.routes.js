// routes/folder.routes.js
import express from "express";
import Folder from "../models/Folder.js";

const router = express.Router();

router.post("/create-folder", async (req, res) => {
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


export default router;
