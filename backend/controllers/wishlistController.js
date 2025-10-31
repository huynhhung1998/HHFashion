import WishlistModel from "../models/WishlistModel.js";
import ProductModel from "../models/ProductModel.js";

const wishlistController = {
  // 🟢 Lấy toàn bộ wishlist (admin)
  getAllWishlists: async (req, res) => {
    try {
      const wishlists = await WishlistModel.find()
        .populate("user", "name email")
        .populate({
          path: "items.product",
          populate: { path: "tags", select: "nameTag" },
          select: "productName price img tags quantity",
        });
      res.status(200).json(wishlists);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách wishlist", error });
    }
  },

  // 🟢 Lấy wishlist theo user
  getWishlistByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const wishlist = await WishlistModel.findOne({ user: userId })
        .populate({
          path: "items.product",
          populate: { path: "tags", select: "nameTag" },
          select: "productName price img tags quantity",
        });

      if (!wishlist) {
        return res.status(200).json({ user: userId, items: [] });
      }

      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy wishlist của user", error });
    }
  },

  // 🟢 Thêm sản phẩm vào wishlist
addToWishlist: async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Thiếu userId hoặc productId" });
    }

    let wishlist = await WishlistModel.findOne({ user: userId });
    if (!wishlist) wishlist = new WishlistModel({ user: userId, items: [] });

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );
    if (alreadyExists) {
      return res.status(400).json({ message: "Sản phẩm đã có trong wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.status(200).json({ message: "Đã thêm vào wishlist thành công", wishlist });
  } catch (error) {
    console.error("❌ addToWishlist error:", error);
    res.status(500).json({ message: "Lỗi khi thêm vào wishlist", error: error.message });
  }
},



  // 🟢 Xóa sản phẩm khỏi wishlist
removeFromWishlist: async (req, res) => {
  try {
    const { userId, productId } = req.params; // lấy từ URL thay vì body

    const wishlist = await WishlistModel.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Không tìm thấy wishlist" });
    }

    // Lọc bỏ sản phẩm cần xóa
    const beforeCount = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    if (wishlist.items.length === beforeCount) {
      return res.status(404).json({ message: "Sản phẩm không có trong wishlist" });
    }

    await wishlist.save();

    res.status(200).json({
      message: "Đã xóa sản phẩm khỏi wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa wishlist:", error);
    res.status(500).json({ message: "Lỗi khi xóa khỏi wishlist", error });
  }
},


  // 🟢 Xóa toàn bộ wishlist
  clearWishlist: async (req, res) => {
    try {
      const { userId } = req.params;
      const wishlist = await WishlistModel.findOne({ user: userId });
      if (!wishlist) {
        return res.status(404).json({ message: "Không tìm thấy wishlist" });
      }

      wishlist.items = [];
      await wishlist.save();
      res.status(200).json({ message: "Đã xóa toàn bộ wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa wishlist", error });
    }
  },

  // 🟢 Đếm tổng số sản phẩm trong wishlist
  getTotalWishlistCount: async (req, res) => {
    try {
      const { userId } = req.params;
      const wishlist = await WishlistModel.findOne({ user: userId });
      const count = wishlist ? wishlist.items.length : 0;
      res.status(200).json({ total: count });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đếm wishlist", error });
    }
  },
};

export default wishlistController;
