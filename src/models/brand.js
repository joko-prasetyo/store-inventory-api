const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

brandSchema.virtual("brand", {
    ref: 'Item',
    localField: '_id',
    foreignField: 'brand_id'
})

brandSchema.pre('save', async function (next) {
    next()
})

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;