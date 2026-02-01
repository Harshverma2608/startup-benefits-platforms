import express from 'express';
import Deal from '../models/Deal.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    const deals = await Deal.find(filter).sort({ featured: -1, createdAt: -1 }).lean();
    res.json({ success: true, data: { deals } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error loading deals", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const deal = await Deal.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });
    res.json({ success: true, data: { deal } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error", error: err.message });
  }
});

export default router;
