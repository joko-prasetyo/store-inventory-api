const mongoose = require("mongoose");
const Item = require("../models/item");

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

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;