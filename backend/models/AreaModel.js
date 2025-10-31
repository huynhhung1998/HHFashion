import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    name: { type: String, required: true },
})

const AreaModel = mongoose.model('Area', areaSchema);
export default AreaModel;
