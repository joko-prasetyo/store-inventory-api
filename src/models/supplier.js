const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

supplierSchema.virtual("supplier", {
    ref: 'Item',
    localField: '_id',
    foreignField: 'supplier_id'
})

supplierSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()
    delete itemObject.__v;
    return itemObject
}

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;