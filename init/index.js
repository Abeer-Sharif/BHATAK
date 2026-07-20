if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// console.log("MAP_TOKEN:", process.env.MAPBOX);
// console.log("MONGO_URL:", process.env.MONGO_URL);

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Listing = require("../models/listing");
const initData = require("./data.js");

const mapToken = process.env.MAPBOX;

const geocodingClient = mbxGeocoding({
    accessToken: mapToken,
});

async function initDB() {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB Atlas");

        // Delete old listings
        await Listing.deleteMany({});

        const ownerId = new mongoose.Types.ObjectId(
            "6a5bc495b68ba70b86a2601b"
        );

        const listings = [];

        for (let obj of initData.data) {

            const response = await geocodingClient
                .forwardGeocode({
                    query: `${obj.location}, ${obj.country}`,
                    limit: 1,
                })
                .send();

            obj.owner = ownerId;

            if (response.body.features.length > 0) {
                obj.geometry = response.body.features[0].geometry;
            }

            listings.push(obj);

            console.log(`Added: ${obj.title}`);
        }

        await Listing.insertMany(listings);

        console.log("Database initialized successfully!");

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

initDB();