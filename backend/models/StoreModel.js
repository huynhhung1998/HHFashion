import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    onwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    address: { type: String, required: true },
    storeName: { type: String, required: true },
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
    isMall: { type: Boolean, default: false },
    isLiked: { type: Boolean, default: false },
})

const StoreModel = mongoose.model('Store', storeSchema);
export default StoreModel;