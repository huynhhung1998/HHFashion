import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    note: [{ type: String}],
    
    deliveryAddress: { type: String, required: true },
    products: {
  type: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    }
  ],
  validate: arr => arr.length > 0
},
    totalPrice: { type: Number, required: true },

    status: { 
        type: String, 
        enum: ['đang chờ', 'đang vận chuyển', 'đã hủy', 'đã nhận'], 
        default: 'đang chờ' 
    },
    
    promisedDeliveryDate: { 
        type: Date, 
        default: () => {
            const now = new Date();
            now.setDate(now.getDate() + 7); // cộng thêm 7 ngày
            return now;
        }
    },
    handler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Người xử lý đơn hàng
    default: null,
  },
},  { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
