import {Request, Response, NextFunction} from "express";
const {authJwt} = require('../middlewares')
const express = require('express')
const todo = express.Router();
const todoController = require('../controllers/todo-controller')

todo.post('/save_todo', [authJwt.verifyToken], todoController.savetodo)
todo.post('/get_todos', [authJwt.verifyToken], todoController.gettodos)
todo.post('/get_user_todos', [authJwt.verifyToken], todoController.getusertodos)

module.exports = todo