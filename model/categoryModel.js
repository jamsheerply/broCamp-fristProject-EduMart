const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({
    date: { type: String },
    category: { type: String},
})
module.exports = mongoose.model("category", categorySchema);
