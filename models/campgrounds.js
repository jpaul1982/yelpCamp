const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",        },
            username: String
    },
    
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);