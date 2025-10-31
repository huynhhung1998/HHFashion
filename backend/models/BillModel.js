import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    deliveryAddress: { type: String, required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // Lưu giá tại thời điểm mua
        }
    ],
    totalPrice: { type: Number, required: true },
    // khoi tao pending->store comfirmed: distributing-> RouteDeliveryManager comfirmed + add Delivery Man: shipping->delivered
    // buyer comfirmed: received
    // buyer canceled: canceled
    status: { 
        type: String, 
        enum: ['pending', 'shipping', 'delivered', 'canceled', 'distributing', 'received'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now },
    promisedDeliveryDate: { 
        type: Date, 
        default: () => {
            const now = new Date();
            now.setDate(now.getDate() + 7); // cộng thêm 7 ngày
            return now;
        }
    },
    deliveryMan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const BillModel = mongoose.model("Bill", billSchema);
export default BillModel;
