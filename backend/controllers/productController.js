import ProductModel from "../models/ProductModel.js";

import TagModel from "../models/TagModel.js";



const productController = {
  // CREATE
  createProduct: async (req, res) => {
    try {
      const {
        productName,
        price,
        quantity,
        description,
        img,
        sex,
        remaining,
        status,
        tags,
      } = req.body;

      const newProduct = new ProductModel({
        productName,
        price,
        quantity,
        description,
        img,
        sex,
        remaining: remaining ?? quantity, // mặc định = số lượng nhập ban đầu
        status: status || "Đang bán",
        tags: tags && tags.length ? tags : [],
      });

      await newProduct.save();

      res.status(201).send({
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  
  // READ - ALL (với filter + phân trang chuẩn)
getAllProducts: async (req, res) => {
  try {
    const curPage = parseInt(req.query.curPage) || 1;
    const ITEMS_PER_PAGE = 16;

    const {
      tagName,     
      name = "",
      sex,
      minPrice,
      maxPrice,
      stockStatus,
      sort,        
    } = req.query;

   
    const filter = {};

   
    if (tagName) {
     
      if (tagName.match(/^[0-9a-fA-F]{24}$/)) {
        filter.tags = { $in: [tagName] };
      } else {
        const tag = await TagModel.findOne({
          nameTag: { $regex: tagName, $options: "i" },
        });
        if (tag) {
          filter.tags = { $in: [tag._id] };
        } else {
          return res.status(200).send({
            message: "Success",
            data: [],
            numberOfPages: 0,
            curPage: 1,
            totalItems: 0,
          });
        }
      }
    }

    // 🔹 Lọc theo tên sản phẩm
    if (name) filter.productName = { $regex: name, $options: "i" };

    // 🔹 Lọc theo giới tính
    if (sex) filter.sex = sex;

    // 🔹 Lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔹 Lọc theo tình trạng kho
    if (stockStatus) {
      if (stockStatus === "Hết hàng") {
        filter.quantity = { $lte: 0 };
      } else if (stockStatus === "Sắp hết") {
        filter.quantity = { $gt: 0, $lte: 5 };
      } else if (stockStatus === "Còn hàng") {
        filter.quantity = { $gt: 5 };
      }
    }

    filter.status = "Đang bán";
    // 2️⃣ Tuỳ chọn sắp xếp
    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "priceAsc":
          sortOption = { price: 1 };
          break;
        case "priceDesc":
          sortOption = { price: -1 };
          break;
        case "nameAsc":
          sortOption = { productName: 1 };
          break;
        case "nameDesc":
          sortOption = { productName: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // 3️⃣ Đếm tổng số sản phẩm sau lọc
    const totalItems = await ProductModel.countDocuments(filter);
    const numberOfPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // 4️⃣ Reset trang nếu vượt giới hạn
    const currentPage =
      curPage > numberOfPages && numberOfPages > 0 ? 1 : curPage;

    // 5️⃣ Lấy dữ liệu
    const data = await ProductModel.find(filter)
      .populate("tags")
      .sort(sortOption)
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // 6️⃣ Trả kết quả
    res.status(200).send({
      message: "Success",
      data,
      numberOfPages,
      curPage: currentPage,
      totalItems,
      currentCount: data.length, // ✅ FE hiển thị “Hiển thị X / Y”
    });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},


getAllProductsAdmin: async (req, res) => {
  try {
    const curPage = parseInt(req.query.curPage) || 1;
    const ITEMS_PER_PAGE = 16;

    const {
      tagName,     
      name = "",
      sex,
      minPrice,
      maxPrice,
      stockStatus,
      sort,        
    } = req.query;

   
    const filter = {};

   
    if (tagName) {
     
      if (tagName.match(/^[0-9a-fA-F]{24}$/)) {
        filter.tags = { $in: [tagName] };
      } else {
        const tag = await TagModel.findOne({
          nameTag: { $regex: tagName, $options: "i" },
        });
        if (tag) {
          filter.tags = { $in: [tag._id] };
        } else {
          return res.status(200).send({
            message: "Success",
            data: [],
            numberOfPages: 0,
            curPage: 1,
            totalItems: 0,
          });
        }
      }
    }

    // 🔹 Lọc theo tên sản phẩm
    if (name) filter.productName = { $regex: name, $options: "i" };

    // 🔹 Lọc theo giới tính
    if (sex) filter.sex = sex;

    // 🔹 Lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔹 Lọc theo tình trạng kho
    if (stockStatus) {
      if (stockStatus === "Hết hàng") {
        filter.quantity = { $lte: 0 };
      } else if (stockStatus === "Sắp hết") {
        filter.quantity = { $gt: 0, $lte: 5 };
      } else if (stockStatus === "Còn hàng") {
        filter.quantity = { $gt: 5 };
      }
    }

    
    // 2️⃣ Tuỳ chọn sắp xếp
    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "priceAsc":
          sortOption = { price: 1 };
          break;
        case "priceDesc":
          sortOption = { price: -1 };
          break;
        case "nameAsc":
          sortOption = { productName: 1 };
          break;
        case "nameDesc":
          sortOption = { productName: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // 3️⃣ Đếm tổng số sản phẩm sau lọc
    const totalItems = await ProductModel.countDocuments(filter);
    const numberOfPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // 4️⃣ Reset trang nếu vượt giới hạn
    const currentPage =
      curPage > numberOfPages && numberOfPages > 0 ? 1 : curPage;

    // 5️⃣ Lấy dữ liệu
    const data = await ProductModel.find(filter)
      .populate("tags")
      .sort(sortOption)
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // 6️⃣ Trả kết quả
    res.status(200).send({
      message: "Success",
      data,
      numberOfPages,
      curPage: currentPage,
      totalItems,
      currentCount: data.length, // ✅ FE hiển thị “Hiển thị X / Y”
    });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},



getAllProductsNoPaging: async (req, res) => {
  try {
    const data = await ProductModel.find().populate("tags");
    res.status(200).send({ message: "Success", data });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},


  // READ - ONE
  getOneProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ProductModel.findById(id)
        
        .populate("tags");
      if (!data) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - MOST FAVOURITE
  getMostFavouriteProducts: async (req, res) => {
    try {
      const data = await ProductModel.find()
        .sort({ traded_count: -1 })
        .limit(20)
        
        .populate("tags");

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - TOP RATING
  getTopRatingProducts: async (req, res) => {
    try {
      const products = await ProductModel.find()
        
        .populate("tags");

      const data = products
        .sort((a, b) => b.curRating - a.curRating)
        .slice(0, 20);

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - BY TAG
  getProductsByTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ tags: tagId });
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const tag = await TagModel.findById(tagId);

      const data = await ProductModel.find({ tags: tag })
        
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // READ - BY PRICE RANGE
  getProductsByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      })
        
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // READ - BY STORE
  getProductsByStore: async (req, res) => {
    try {
      const { storeId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ store: storeId });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({ store: storeId })
        .populate("store")
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);
      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // UPDATE
 updateProduct: async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ cho phép update các field bạn muốn (ví dụ status)
    // Hoặc cứ để req.body như hiện tại cũng được
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // chạy validate schema khi update
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product); // trả luôn product để frontend dùng
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  // DELETE
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default productController;