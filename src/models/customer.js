const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    total_visited: {
        type: Number,
        default: 1
    }
}, {
    timestamps: false
});

customerSchema.virtual("customer", {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'customer_id'
})

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;