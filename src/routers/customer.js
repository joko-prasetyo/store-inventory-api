const express = require("express");
const router = new express.Router();
const Customer = require("../models/customer");

router.post("/customers", async (req, res) => {
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(201).send(customer);
    } catch(e) {
        res.status(400).send();
    }
})

router.get("/customers", async (req, res) => {
    const customers = await Customer.find({});
    try {
        if (!customers.length) throw new Error();
        res.status(200).send(customers);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/customers/:id", async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id });
        if(!customer) return res.status(404).send();
        res.send(customer);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/customers/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['name', 'phone_number', 'address', 'total_visited'];

    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const customer = await Customer.findOne({ _id: req.params.id })
        if(!customer) return res.status(404).send()
        updates.forEach(update => customer[update] = req.body[update])
        await customer.save()
        res.send(customer)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;