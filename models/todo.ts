import mongoose from "mongoose";
const Todo = mongoose.model(
    "Todo",
    new mongoose.Schema({
        title: String,
        priority: String,
        description: String,
        date: String,
        time: String,
        items: [
            {type: mongoose.Schema.Types.ObjectId, ref: "TodoItem"}
        ]
    })
)

module.exports = Todo