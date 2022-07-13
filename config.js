const mongoose = require('mongoose');
require('dotenv').config();

(async function() {
    const uri = `mongodb+srv:${process.env.MONGO_URI}`;
    await mongoose.connect(uri)
    console.log('DB is connected')  
})()