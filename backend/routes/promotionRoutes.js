// routes/promotionRoutes.js
import express from "express";
import promotionController from "../controllers/promotionController.js";

const router = express.Router();

router
  .route("/")
  .get(promotionController.getAllPromotions)
  .post(promotionController.createPromotion);

router
  .route("/:id")
  .get(promotionController.getOnePromotion)
  .put(promotionController.updatePromotion)
  .delete(promotionController.deletePromotion);

export default router;
