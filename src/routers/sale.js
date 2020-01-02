const express = require("express");
const router = new express.Router();
const Sale = require("../models/sale");
const Item = require("../models/item");

router.post("/sales", async (req, res) => {
    let sale = new Sale(req.body);
    try {
        const item = await Item.findById(req.body.item_id);
        if (!item) return res.status(400).send({ error: "Item is not exists, please create a new one" });
        sale.item_id = item;       
        await Sale.checkQuantityAndSave(sale, res);
        res.status(201).send(sale);
    } catch(e) {
        res.status(400).send();
    }
})

router.get("/sales", async (req, res) => {
    let sales = await Sale.find({}).populate("customer_id");
    // sales.filter(sale => sale.customer_id != null && sale.item_id != null)
    try {
        if (!sales.length) throw new Error();
        res.status(200).send(sales);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/sales/:id", async (req, res) => {
    try {
        const sale = await Sale.findOneAndDelete({ _id: req.params.id });
        if(!sale) return res.status(404).send();
        res.send(sale);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/sales/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['note_number', 'customer_id', 'item_id', 'item_size', 'item_quantity'];

    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const sale = await Sale.findOne({ _id: req.params.id })
        const before = sale.item_quantity;
        if(!sale) return res.status(404).send()
        updates.forEach(update => sale[update] = req.body[update])
        await Sale.updateQuantityAndSave(sale, res, before);
        res.send(sale)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;