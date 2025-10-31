// backend/models/TagModel.js
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    nameTag: {
      type: String,
      required: [true, "Tên tag không được để trống"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
