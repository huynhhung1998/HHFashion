import express from "express";
import tagsController from "../controllers/tagsController.js"; // ✅ import default object

const router = express.Router();

router
  .route("/")
  .get(tagsController.getAllTags)
  .post(tagsController.createTag);

router
  .route("/:id")
  .get(tagsController.getOneTag) // tên trong controller là getOneTag
  .put(tagsController.updateTag)
  .delete(tagsController.deleteTag);

export default router;
