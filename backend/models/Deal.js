import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Deal title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Deal description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "cloud",
        "marketing",
        "analytics",
        "productivity",
        "development",
        "design",
        "other",
      ],
      index: true,
    },
    partnerName: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
    },
    partnerLogo: {
      type: String,
      default: null,
    },
    discount: {
      type: String,
      required: [true, "Discount information is required"],
    },
    originalPrice: {
      type: String,
      default: null,
    },
    dealPrice: {
      type: String,
      default: null,
    },

    requiresVerification: {
      type: Boolean,
      default: false,
      index: true,
    },

    eligibilityConditions: {
      type: String,
      default: null,
    },

    dealUrl: {
      type: String,
      required: [true, "Deal URL is required"],
    },

    imageUrl: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

dealSchema.index({ category: 1, requiresVerification: 1, isActive: 1 });
dealSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model("Deal", dealSchema);
