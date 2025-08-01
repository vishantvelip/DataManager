const { Schema, model } = require("mongoose");

const skillSchema = new Schema(
  {
    skillName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    projectImg: { type: String, default: "" },
    publicId: { type: String, default: "" }, // Added to store Cloudinary public ID
  },
  { timestamps: true }
);

module.exports = model("Skill", skillSchema);
