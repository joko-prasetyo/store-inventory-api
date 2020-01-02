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
        type: mongoose.Schema.Types.Mixed,
        required: true
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

saleSchema.statics.checkQuantityAndSave = async function(sale, res) {
    const stock = await Stock.findOne({ item_id: sale.item_id._id });
    try {
        if (sale.item_quantity >= stock.quantity || !stock) {
            throw new Error("item quantity is invalid or stock is not found");
        }
        else if (sale.item_quantity <= stock.quantity) {
            stock.quantity = stock.quantity - sale.item_quantity;
            await stock.save();
            await sale.save();
        }
    } catch(e) {
        res.status(400).send({error : e.message})
    }
} 

saleSchema.statics.updateQuantityAndSave = async function(sale, res, before) {
    const sales = this;
    const stock = await Stock.findOne({ item_id: sale.item_id._id });
    const newQuantity = sale.item_quantity - before;
    try {
        if (newQuantity > stock.quantity || !stock) {
            throw new Error("item quantity is invalid or stock is not found");
        }
        else if (newQuantity <= stock.quantity) {
            stock.quantity = stock.quantity - newQuantity;
            if (stock.quantity < 0) throw new Error("Cannot update item quantity");
            await stock.save();
            await sale.save();
        }
    } catch(e) {
        res.status(400).send({error : e.message})
    }
} 

saleSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()
    delete itemObject.__v;
    return itemObject
}

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;