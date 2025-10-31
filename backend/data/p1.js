const products = [
  {
    productName: "Áo thun basic cotton",
    price: 199000,
    img: [
      "https://example.com/images/ao-thun-basic-1.jpg",
      "https://example.com/images/ao-thun-basic-2.jpg",
    ],
    tags: ["68ef62d13993bc133136f41c"], // Áo
    quantity: 100,
    remaining: 100,
    description: "Áo thun nam nữ unisex chất liệu cotton 100%, form rộng thoải mái.",
    sex: "Unisex",
  },
  {
    productName: "Quần jeans slim fit",
    price: 399000,
    img: [
      "https://example.com/images/quan-jean-slim-1.jpg",
      "https://example.com/images/quan-jean-slim-2.jpg",
    ],
    tags: ["68ef62d13993bc133136f41d"], // Quần
    quantity: 80,
    remaining: 80,
    description: "Quần jeans slim fit nam, co giãn nhẹ, bền màu sau nhiều lần giặt.",
    sex: "Nam",
  },
  {
    productName: "Mũ bucket thời trang",
    price: 99000,
    img: [
      "https://example.com/images/non-bucket-1.jpg",
    ],
    tags: ["68ef62d13993bc133136f41f"], // Nón
    quantity: 60,
    remaining: 60,
    description: "Mũ bucket form rộng, chất liệu cotton, phù hợp cho cả nam và nữ.",
    sex: "Unisex",
  },
  {
    productName: "Vớ cotton cao cổ",
    price: 49000,
    img: [
      "https://example.com/images/vo-cao-co-1.jpg",
    ],
    tags: ["68ef62d13993bc133136f420"], // Vớ
    quantity: 200,
    remaining: 200,
    description: "Vớ cotton co giãn tốt, thấm hút mồ hôi, thoải mái cả ngày.",
    sex: "Unisex",
  },
  {
    productName: "Vòng tay phong thủy đá mắt hổ",
    price: 259000,
    img: [
      "https://example.com/images/vong-tay-da-mat-ho-1.jpg",
    ],
    tags: ["68ef62d13993bc133136f421"], // Trang sức
    quantity: 40,
    remaining: 40,
    description: "Vòng tay đá mắt hổ tự nhiên, mang lại năng lượng tích cực và may mắn.",
    sex: "Unisex",
  },
  {
    productName: "Đồng hồ dây da cổ điển",
    price: 899000,
    img: [
      "https://example.com/images/dong-ho-day-da-1.jpg",
      "https://example.com/images/dong-ho-day-da-2.jpg",
    ],
    tags: ["68ef62d13993bc133136f422"], // Đồng hồ
    quantity: 30,
    remaining: 30,
    description: "Đồng hồ dây da thời trang, thiết kế cổ điển sang trọng, chống nước nhẹ.",
    sex: "Nam",
  },
  {
    productName: "Phụ kiện móc khóa mini",
    price: 59000,
    img: [
      "https://example.com/images/phu-kien-moc-khoa-1.jpg",
    ],
    tags: ["68ef62d13993bc133136f41e"], // Phụ kiện
    quantity: 120,
    remaining: 120,
    description: "Móc khóa mini nhiều hình dạng dễ thương, chất liệu kim loại bền.",
    sex: "Unisex",
  },
  {
    productName: "Áo hoodie unisex oversize",
    price: 329000,
    img: [
      "https://example.com/images/ao-hoodie-1.jpg",
      "https://example.com/images/ao-hoodie-2.jpg",
    ],
    tags: ["68ef62d13993bc133136f41c", "68ef62d13993bc133136f423"], // Áo + Khác
    quantity: 90,
    remaining: 90,
    description: "Áo hoodie unisex oversize, chất nỉ dày dặn, giữ ấm tốt và dễ phối đồ.",
    sex: "Unisex",
  },
  {
  productName: "Áo sơ mi trắng cổ bẻ",
  price: 259000,
  img: [
    "https://example.com/images/ao-so-mi-trang-1.jpg",
    "https://example.com/images/ao-so-mi-trang-2.jpg",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 70,
  remaining: 70,
  description: "Áo sơ mi trắng cổ bẻ, chất liệu cotton thoáng mát, phù hợp đi làm và đi chơi.",
  sex: "Nam",
},
{
  productName: "Quần short kaki năng động",
  price: 199000,
  img: [
    "https://example.com/images/quan-short-kaki-1.jpg",
    "https://example.com/images/quan-short-kaki-2.jpg",
  ],
  tags: ["68ef62d13993bc133136f41d"], // Quần
  quantity: 100,
  remaining: 100,
  description: "Quần short kaki trẻ trung, co giãn tốt, dễ phối áo thun hoặc sơ mi.",
  sex: "Nam",
},
{
  productName: "Phụ kiện dây chuyền bạc mini",
  price: 149000,
  img: [
    "https://example.com/images/day-chuyen-bac-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f41e", "68ef62d13993bc133136f421"], // Phụ kiện + Trang sức
  quantity: 50,
  remaining: 50,
  description: "Dây chuyền bạc mini phong cách Hàn Quốc, đơn giản nhưng tinh tế.",
  sex: "Nữ",
},
{
  productName: "Nón lưỡi trai classic",
  price: 99000,
  img: [
    "https://example.com/images/non-luoi-trai-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f41f"], // Nón
  quantity: 120,
  remaining: 120,
  description: "Nón lưỡi trai classic phong cách thể thao, form chuẩn, dễ phối đồ.",
  sex: "Unisex",
},
{
  productName: "Vớ cổ thấp thể thao",
  price: 39000,
  img: [
    "https://example.com/images/vo-the-thao-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f420"], // Vớ
  quantity: 200,
  remaining: 200,
  description: "Vớ cổ thấp co giãn, chuyên dụng cho thể thao và chạy bộ.",
  sex: "Unisex",
},
{
  productName: "Nhẫn bạc trơn tinh tế",
  price: 179000,
  img: [
    "https://example.com/images/nhan-bac-tron-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f421"], // Trang sức
  quantity: 80,
  remaining: 80,
  description: "Nhẫn bạc trơn tinh tế, thích hợp làm quà tặng hoặc phụ kiện hàng ngày.",
  sex: "Unisex",
},
{
  productName: "Đồng hồ điện tử LED thời trang",
  price: 459000,
  img: [
    "https://example.com/images/dong-ho-led-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f422"], // Đồng hồ
  quantity: 50,
  remaining: 50,
  description: "Đồng hồ LED hiện đại, hiển thị rõ nét, pin bền, phù hợp cả nam lẫn nữ.",
  sex: "Unisex",
},
{
  productName: "Túi đeo chéo mini canvas",
  price: 229000,
  img: [
    "https://example.com/images/tui-deo-cheo-1.jpg",
    "https://example.com/images/tui-deo-cheo-2.jpg",
  ],
  tags: ["68ef62d13993bc133136f41e", "68ef62d13993bc133136f423"], // Phụ kiện + Khác
  quantity: 70,
  remaining: 70,
  description: "Túi đeo chéo mini bằng vải canvas, nhỏ gọn, tiện dụng cho đi chơi.",
  sex: "Unisex",
},
{
  productName: "Áo khoác gió thể thao",
  price: 359000,
  img: [
    "https://example.com/images/ao-khoac-gio-1.jpg",
    "https://example.com/images/ao-khoac-gio-2.jpg",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 90,
  remaining: 90,
  description: "Áo khoác gió nhẹ chống nước, thích hợp mặc khi tập thể thao hoặc đi chơi.",
  sex: "Unisex",
},
{
  productName: "Áo thun trẻ em in hình hoạt hình",
  price: 159000,
  img: [
    "https://example.com/images/ao-thun-tre-em-1.jpg",
  ],
  tags: ["68ef62d13993bc133136f41c", "68ef62d13993bc133136f423"], // Áo + Khác
  quantity: 110,
  remaining: 110,
  description: "Áo thun trẻ em cotton in hình hoạt hình đáng yêu, an toàn cho da bé.",
  sex: "Trẻ em",
},

];

export default products;
