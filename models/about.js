const { Schema, model } = require("mongoose");

const aboutSchema = new Schema(
  {
    content: { 
      type: String, 
      required: [true, 'Content is required'], 
      trim: true,
      minlength: [10, 'Content must be at least 10 characters long'],
      maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = model('About', aboutSchema);
