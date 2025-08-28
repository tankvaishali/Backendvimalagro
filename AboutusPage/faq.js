import mongoose from "mongoose";
import express from "express";

const Faqschema = new mongoose.Schema({
  que: { type: String, required: true },
  ans: { type: String, required: true },
});

// ✅ Capitalize model name
const Faqdata = mongoose.model("Faq", Faqschema);
const faq = express.Router();

// 👉 Get all FAQs
faq.get("/", async (req, res) => {
  try {
    const faqs = await Faqdata.find();
    res.json({
      message: "FAQs fetched successfully ✅",
      data: faqs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Add FAQ
faq.post("/", async (req, res) => {
  try {
    const { que, ans } = req.body;
    const newFaq = new Faqdata({ que, ans });
    await newFaq.save();
    res.status(201).json({
      message: "FAQ added successfully ✅",
      data: newFaq,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Update FAQ
faq.put("/:id", async (req, res) => {
  try {
    const { que, ans } = req.body;
    const updatedFaq = await Faqdata.findByIdAndUpdate(
      req.params.id,
      { que, ans },
      { new: true }
    );
    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found ❌" });
    }
    res.json({
      message: "FAQ updated successfully ✅",
      data: updatedFaq,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 Delete FAQ
faq.delete("/:id", async (req, res) => {
  try {
    const deletedFaq = await Faqdata.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found ❌" });
    }
    res.json({
      message: "FAQ deleted successfully ✅",
      data: deletedFaq,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default faq;
