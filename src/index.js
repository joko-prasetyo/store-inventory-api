const express = require("express");
require("./db/mongoose")
const app = express();
const PORT = process.env.PORT || 3000;
const routerBrand = require("./routers/brand");
const routerItem = require("./routers/item");
const routerStock = require("./routers/stock");
const routerCustomer = require("./routers/customer");
const routerSupplier = require("./routers/supplier");
const routerSale = require("./routers/sale");

app.use(express.json());
app.use(routerBrand);
app.use(routerItem);
app.use(routerStock);
app.use(routerCustomer);
app.use(routerSupplier);
app.use(routerSale);

app.get("*", (req, res) => {
    res.send({
        error: "Page not found"
    })
})

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
})

module.exports = app