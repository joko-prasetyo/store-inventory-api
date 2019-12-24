const mongoose = require("mongoose");
const Stock = require("../models/stock");

const saleSchema = new mongoose.Schema({
    note_number: {
        type: String,
        required: true,
        unique: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    item_size: {
        type: Number,
        required: true
    },
    item_quantity: {
        type: Number,
        required: true
    }, 
}, {
    timestamps: true
});

saleSchema.statics.checkQuantityAndSave = async function(req, res) {
    const stock = await Stock.findOne({ item_id: req.item_id});
    try {
        if (req.item_quantity >= stock.quantity || !stock) {
            throw new Error("item quantity is invalid or stock is not found");
        }
        else if (req.item_quantity <= stock.quantity) {
            stock.quantity = stock.quantity - req.item_quantity;
            await stock.save();
            await req.save();
        }
    } catch(e) {
        res.status(400).send({error : e.message})
    }
} 

saleSchema.statics.updateQuantityAndSave = async function(req, res, before) {
    const stock = await Stock.findOne({ item_id: req.item_id});
    const newQuantity = req.item_quantity - before;
    try {
        if (newQuantity > stock.quantity || !stock) {
            throw new Error("item quantity is invalid or stock is not found");
        }
        else if (newQuantity <= stock.quantity) {
            stock.quantity = stock.quantity - newQuantity;
            if (stock.quantity < 0) throw new Error("Cannot update item quantity");
            await stock.save();
            await req.save();
        }
    } catch(e) {
        res.status(400).send({error : e.message})
    }
} 

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;