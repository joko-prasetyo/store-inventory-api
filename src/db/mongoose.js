const mongoose = require('mongoose')
const devConnect = 'mongodb://localhost:27017/store-inventory-api';
mongoose.connect(devConnect, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})