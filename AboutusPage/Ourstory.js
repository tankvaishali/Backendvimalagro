import express from "express";
import mongoose from "mongoose";

// ✅ Schema
const storySchema = new mongoose.Schema(
  {
    storypera: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Model (capitalized and correct name)
const Story = mongoose.model("Story", storySchema);

// ✅ Router
const Ourstory = express.Router();

// ➡️ CREATE (POST)
Ourstory.post("/", async (req, res) => {
  try {
    const { storypera } = req.body;
    if (!storypera) {
      return res.status(400).json({ error: "storypera is required ❌" });
    }
    const newStory = new Story({ storypera });
    await newStory.save();

    res.status(201).json({
      message: "Story created successfully ✅",
      data: newStory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ READ (GET all)
Ourstory.get("/", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json({
      message: "Stories fetched successfully ✅",
      data: stories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ UPDATE (PUT by ID)
Ourstory.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { storypera } = req.body;

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { storypera },
      { new: true, runValidators: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found ❌" });
    }

    res.json({
      message: "Story updated successfully ✅",
      data: updatedStory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ DELETE (by ID)
Ourstory.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStory = await Story.findByIdAndDelete(id);

    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found ❌" });
    }

    res.json({
      message: "Story deleted successfully ✅",
      data: deletedStory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default Ourstory;
