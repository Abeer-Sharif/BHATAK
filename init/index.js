const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');
const express = require("express");
const app = express();



async function startServer() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bhatak");
        console.log("connected to db");
        app.listen(8080, () => {
        console.log("server is running on port 8080")
});
    }catch (error) {
        console.log("error connecting to database:", error);
    }
};
startServer();
const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6a4d3fc8bfb36091d7d12d56'}))
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();
