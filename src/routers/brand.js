const express = require("express");
const router = new express.Router();
const Brand = require("../models/brand");

router.post("/brands", async (req, res) => {
    const brand = new Brand(req.body);
    try {
        await brand.save();
        res.status(201).send(brand);
    } catch(e) {
        res.status(400).send();
    }
})

router.get("/brands", async (req, res) => {
    const brands = await Brand.find({});
    try {
        if (!brands.length) throw new Error();
        res.status(200).send(brands);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/brands/:id", async (req, res) => {
    try {
        const brand = await Brand.findOneAndDelete({ _id: req.params.id });
        if(!brand) return res.status(404).send();
        res.send(brand);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/brands/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['name', 'origin'];

    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const brand = await Brand.findOne({ _id: req.params.id })
        if(!brand) return res.status(404).send()
        updates.forEach(update => brand[update] = req.body[update])
        await brand.save()
        res.send(brand)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;