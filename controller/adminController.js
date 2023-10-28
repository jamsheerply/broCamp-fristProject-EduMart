const { compareSync } = require("bcrypt")
const adminModel = require("../model/categoryModel")
const categoryModel = require("../model/categoryModel")


const loadCategory = async (req, res) => {
    try {
        res.render("admin/category")
    } catch (error) {
        console.log(error.message + " loadcategory")
    }
}
const insertCategory = async (req, res) => {
    try {
        const trim = req.body.categoryName
        if (trim.trim() === "") {
            res.render("admin/category", { message: "nothing to add" })
        } else {
            const timestamp = Date.now(); // Get the current timestamp
            const date = new Date(timestamp); // Create a Date object from the timestamp
            const formattedDate = date.toLocaleDateString();
            const categoryData = new categoryModel({
                category: req.body.categoryName,
                date: formattedDate
            }) 
            if (categoryData) {
                const up = req.body.categoryName.toUpperCase();
                const low = req.body.categoryName.toLowerCase();
                const upperCase = await categoryModel.findOne({ Category: up })
                const lowerCase = await categoryModel.findOne({ Category: low })
                if (upperCase || lowerCase) {
                    res.render("admin/category", { message: "category already exists" })
                } else {
                    categoryData.save()
                    res.render("admin/category")
                }
            } else {
                res.render("admin/category", { message: "not entered anything" })
            }
        }
    } catch (error) {
        console.log(error.message + " insertCategory")
    }
}

module.exports = {
    loadCategory,
    insertCategory
} 