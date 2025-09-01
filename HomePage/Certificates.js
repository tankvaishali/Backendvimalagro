import express from "express"

const certificates = new mongoose.Schema({
  certificateimage: { type: String, required: true },
}, { timestamps: true });

const certificate = mongoose.model("certificate", certificates);

const certificatelist = express.Router();