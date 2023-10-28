const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    Name: { type: String, required: true, },
    Description: { type: String, required: true },

    Image: [{
        Child_four: { type: String },
        Child_one: { type: String },
        Child_three: { type: String },
        Child_two: { type: String },
        Main: { type: String },
    }],
    Status: { type: String, enum: ['draft', 'published', 'out_of_stock', 'low_quantity'] },
    Product_added: { type: Date },
    Price: { type: Number, required: true },
    Rating: { type: Number },
    Product_details: {
        Brand: { type: String },
        Manufacturer: { type: String },
    },
}, { timestamps: true });

module.exports=mongoose.model("Product", productSchema);