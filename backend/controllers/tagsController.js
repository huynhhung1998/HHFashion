// backend/controllers/tagController.js
import Tag from "../models/TagModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const tagsController = {
  // Create
  createTag: catchAsync(async (req, res, next) => {
    const tag = await Tag.create(req.body);
    res.status(201).json({ status: "success", data: tag });
  }),

  // Read
  getAllTags: catchAsync(async (req, res, next) => {
    const tags = await Tag.find();
    res.status(200).json({ status: "success", data: tags });
  }),

  getOneTag: catchAsync(async (req, res, next) => {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return next(new AppError("Không tìm thấy tag", 404));
    res.status(200).json({ status: "success", data: tag });
  }),

  // Update
  updateTag: catchAsync(async (req, res, next) => {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tag) return next(new AppError("Không tìm thấy tag", 404));
    res.status(200).json({ status: "success", data: tag });
  }),

  // Delete
  deleteTag: catchAsync(async (req, res, next) => {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return next(new AppError("Không tìm thấy tag", 404));
    res.status(204).json({ status: "success", data: null });
  }),
};

export default tagsController;
