const mongoose = require('mongoose')
// const devConnect = 'mongodb://localhost:27017/store-inventory-api';
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})