import mongoose from "mongoose";

const UserTodos = mongoose.model(
    "UserTodos",
    new mongoose.Schema({
        ownership: String,
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        todo: {type: mongoose.Schema.Types.ObjectId, ref: "Todo"},
    })
)

module.exports = UserTodos