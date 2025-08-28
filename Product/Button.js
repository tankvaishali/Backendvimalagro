import mongoose from "mongoose";
import express from "express";

const toggleSchema = new mongoose.Schema({
    isVisible: {
        type: Boolean,
        default: false, // Button is shown by default
    },
});

const Toggle = mongoose.model("Toggle", toggleSchema);

const ViewMorebtn = express.Router();

// ✅ Get current state
ViewMorebtn.get("/btn", async (req, res) => {
    try {
        let toggle = await Toggle.findOne();
        if (!toggle) {
            toggle = new Toggle({ isVisible: true });
            await toggle.save();
        }
        res.json(toggle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update state (admin control)
ViewMorebtn.post("/btn", async (req, res) => {
    try {
        let toggle = await Toggle.findOne();
        if (!toggle) {
            toggle = new Toggle();
        }
        toggle.isVisible = req.body.isVisible;
        await toggle.save();
        res.json(toggle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default ViewMorebtn;



