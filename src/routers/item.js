const express = require("express");
const router = new express.Router();
const Item = require("../models/item");
const multer = require("multer");
const sharp = require("sharp");

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload JPG, JPEG, OR PNG file"))
        }

        cb(undefined, true)
    }
})

router.post("/items", async (req, res) => {
    const item = new Item(req.body);
    try {
        await item.save();
        res.status(201).send(item);
    } catch(e) {
        res.status(400).send();
    }
})

router.post("/items/:id/image", upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const item = await Item.findOne({ _id: req.params.id });
    item.image = buffer;
    await item.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

router.get("/items/:id/image", async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id });
        res.set("Content-Type", "image");
        res.send(item.image);
    } catch(e) {
        res.status(404).send({ error: "Image not found" });
    } 
})

router.patch("/items/:id/image",  upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const item = await Item.findOne({ _id: req.params.id });
    item.image = buffer;
    await item.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

router.delete("/items/:id/image", async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id });
        item.image = "";
        await item.save();
        res.send();
    } catch(e) {
        res.status(404).send({ error: "Image not found" });
    } 
})

router.get("/items", async (req, res) => {
    const options_1 = {
        path: 'brand_id',
        options: {
          retainNullValues: false
        }
    };
    const options_2 = {
        path: 'supplier_id',
        options: {
          retainNullValues: false 
        }
    };      
    let items = await Item.find({}).populate(options_1).populate(options_2);
    try {
        res.status(200).send(items);
    } catch(e) {
        res.status(404).send({ result: "Not found" });
    }
})

router.delete("/items/:id", async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id });
        if(!item) return res.status(404).send();
        await Item.deleteRelatedStock(item._id);
        res.send(item);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch("/items/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['itemCode', 'price', 'brand_id', 'supplier_id'];
    const isValid = updates.every(update => allowed.includes(update)) 
    if (!isValid) return res.status(400).send({ error: 'invalid updates!' })
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if(!item) return res.status(404).send()
        updates.forEach(update => item[update] = req.body[update])
        await item.save()
        res.send(item)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;