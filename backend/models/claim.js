import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: [true, "Deal is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired"],
      default: "pending",
      index: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


claimSchema.index({ user: 1, deal: 1 }, { unique: true });


claimSchema.index({ user: 1, status: 1 });

export default mongoose.model("Claim", claimSchema);
