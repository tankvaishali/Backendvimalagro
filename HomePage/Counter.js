import express from "express";
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  value: [
    {
      customers: { type: Number, required: true },
      products: { type: Number, required: true },
      countries: { type: Number, required: true },
    },
  ],
});

// ✅ Capitalize model name
const Counter = mongoose.model("Counter", CounterSchema);

const counterApi = express.Router();

// 👉 GET all counters
counterApi.get("/", async (req, res) => {
  try {
    const counters = await Counter.find();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 POST - Add new counter
counterApi.post("/", async (req, res) => {
  try {
    const { value } = req.body || {};

    if (!value || !Array.isArray(value)) {
      return res.status(400).json({ error: "value must be an array of objects" });
    }

    const newCounter = new Counter({ value });
    await newCounter.save();

    res.json({ message: "Counter created successfully", counter: newCounter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // 👉 DELETE - remove counter by id
// counterApi.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedCounter = await Counter.findByIdAndDelete(id);

//     if (!deletedCounter) {
//       return res.status(404).json({ error: "Counter not found" });
//     }

//     res.json({ message: "Counter deleted successfully", counter: deletedCounter });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


export default counterApi;
