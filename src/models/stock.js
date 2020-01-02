const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    item_id: {
        type: String,
        unique: true,
        required: true,
        ref: 'Item'
    },
    size: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});

stockSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()
    delete itemObject.__v;
    return itemObject
}

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;