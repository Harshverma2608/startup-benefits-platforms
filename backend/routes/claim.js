import express from 'express';
import Claim from '../models/claim.js';
import Deal from '../models/Deal.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/my-claims', authenticate, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id })
      .populate('deal')
      .sort({ claimedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: { claims },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get claims", error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({
        success: false,
        message: 'Deal ID is required',
      });
    }

    const deal = await Deal.findOne({ _id: dealId, isActive: true });
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    const existing = await Claim.findOne({
      user: req.user._id,
      deal: dealId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already claimed this deal',
      });
    }

    const newClaim = new Claim({
      user: req.user._id,
      deal: dealId,
      status: 'pending',
    });
    await newClaim.save();
    await newClaim.populate('deal');

    res.status(201).json({
      success: true,
      message: 'Deal claimed successfully',
      data: { claim: newClaim },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not claim", error: err.message });
  }
});

export default router;
