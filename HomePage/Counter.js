import express from "express";
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  value: { type: Number, required: true },
});

// ✅ Capitalize model name
const Counter = mongoose.model("Counter", Schema);

const counterApi = express.Router();

// 👉 GET all counters
counterApi.get("/get", async (req, res) => {
  try {
    const counters = await Counter.find();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 POST - Add new counter
counterApi.post("/post", async (req, res) => {
  try {
    const { value } = req.body || {};

    if (value === undefined) {
      return res.status(400).json({ error: "value is required in body" });
    }

    const newCounter = new Counter({ value });
    await newCounter.save();

    res.json({ message: "Counter created successfully", counter: newCounter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 DELETE - remove counter by id
counterApi.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCounter = await Counter.findByIdAndDelete(id);

    if (!deletedCounter) {
      return res.status(404).json({ error: "Counter not found" });
    }

    res.json({ message: "Counter deleted successfully", counter: deletedCounter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default counterApi;
