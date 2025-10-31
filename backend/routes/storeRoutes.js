import { Router } from "express";
import storeController from "../controllers/storeController.js";

const router = Router();

router.get("/", storeController.getAllStores);   // ✅ để AddProductModal gọi
router.get("/:id", storeController.getStoreInfo);

export default router;
