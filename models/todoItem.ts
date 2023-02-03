import mongoose from "mongoose";
const TodoItem = mongoose.model(
    "TodoItem",
    new mongoose.Schema({
        item: String,
        status: String,
    })
)

module.exports = TodoItem;