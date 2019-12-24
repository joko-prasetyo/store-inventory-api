const express = require("express");
const router = new express.Router();
const Supplier = require("../models/supplier");

router.post("/suppliers", async (req, res) => {
    const supplier = new Supplier(req.body);
    try {
        await supplier.save();
        res.status(201).send(supplier);
    } catch(e) {
        res.status(400).send();
    }
})

router.get("/suppliers", async (req, res) => {
    const suppliers = await Supplier.find({});
    try {
        if (!suppliers.length) throw new Error();
        res.status(200).send(suppliers);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/suppliers/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findOneAndDelete({ _id: req.params.id });
        if(!supplier) return res.status(404).send();
        res.send(supplier);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/suppliers/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['name', 'phone_number', 'address'];

    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id })
        if(!supplier) return res.status(404).send()
        updates.forEach(update => supplier[update] = req.body[update])
        await supplier.save()
        res.send(supplier)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;