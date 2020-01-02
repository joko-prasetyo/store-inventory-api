const mongoose = require('mongoose');
const Stock = require("../models/stock");

const itemSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brand'
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Supplier'
    },
    image: {
        type: Buffer
    }
}, {
    timestamps: false
});

itemSchema.virtual("item", {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'item_id'
})

itemSchema.virtual("item", {
    ref: 'Stock',
    localField: '_id',
    foreignField: 'item_id'
})

itemSchema.statics.deleteRelatedStock = async function(item_id) {
    await Stock.findOneAndDelete({ item_id })
}

itemSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()
    delete itemObject.image
    delete itemObject.__v;
    return itemObject
}

// itemSchema.pre("save", async function (next) {
//     this.populate([{ path: 'brand' }, { path: 'supplier' }]);
//     next();
// })

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
