const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");
const User = require("./user");

const listingSchema = new Schema({
    company: String,
    model: String,
    type: String,
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
      },
    price: Number,
    location: String,
    reviews:  [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    try {
        if (listing) {
            await review.deleteMany({ _id: { $in: listing.reviews } });
        }
    } catch (error) {
        console.error("Error deleting associated reviews:", error);
    }
});


const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;