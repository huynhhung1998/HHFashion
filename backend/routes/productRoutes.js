import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

// Create
router.post("/", productController.createProduct);

// Read
router.get("/admin", productController.getAllProductsAdmin);
router.get("/all", productController.getAllProductsNoPaging);
router.get("/", productController.getAllProducts);
router.get("/most-favourite", productController.getMostFavouriteProducts);
router.get("/top-rating", productController.getTopRatingProducts);
router.get("/tag/:tagId", productController.getProductsByTag);
router.get("/price/range", productController.getProductsByPriceRange);

router.get("/:id", productController.getOneProduct);

// Update
router.put("/:id", productController.updateProduct);

// Delete
router.delete("/:id", productController.deleteProduct);

export default router;


