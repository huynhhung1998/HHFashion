// controllers/promotionController.js
import PromotionModel from "../models/PromotionModel.js";

const promotionController = {
  // [POST] /promotions
  createPromotion: async (req, res) => {
    try {
      const promotion = new PromotionModel(req.body);
      const savedPromotion = await promotion.save();
      res.status(201).json(savedPromotion);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // [GET] /promotions
  getAllPromotions: async (req, res) => {
    try {
      const promotions = await PromotionModel.find()
        .populate("store")
        .populate("product");
      res.status(200).json(promotions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // [GET] /promotions/:id
  getOnePromotion: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id)
        .populate("store")
        .populate("product");
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(200).json(promotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // [PUT] /promotions/:id
  updatePromotion: async (req, res) => {
    try {
      const updatedPromotion = await PromotionModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedPromotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(200).json(updatedPromotion);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // [DELETE] /promotions/:id
  deletePromotion: async (req, res) => {
    try {
      const deletedPromotion = await PromotionModel.findByIdAndDelete(req.params.id);
      if (!deletedPromotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(200).json({ message: "Promotion deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default promotionController;
