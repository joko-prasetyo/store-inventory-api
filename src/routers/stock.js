const express = require("express");
const router = new express.Router();
const Stock = require("../models/stock");

router.post("/stocks", async (req, res) => {
    const stock = new Stock(req.body);
    try {
        await stock.save();
        res.status(201).send(stock);
    } catch(e) {
        res.status(400).send();
    }
})

router.get("/stocks", async (req, res) => {
    const stocks = await Stock.find({});
    try {
        if (!stocks.length) throw new Error();
        res.status(200).send(stocks);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/stocks/:id", async (req, res) => {
    try {
        const stock = await Stock.findOneAndDelete({ item_id: req.params.id });
        if(!stock) return res.status(404).send();
        await Item.findOneAndDelete({ _id: stock.item_id });
        res.send(stock);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/stocks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['size', 'quantity', 'item_id'];

    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const stock = await Stock.findOne({ _id: req.params.id })
        if(!stock) return res.status(404).send()
        updates.forEach(update => stock[update] = req.body[update])
        await stock.save()
        res.send(stock)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;