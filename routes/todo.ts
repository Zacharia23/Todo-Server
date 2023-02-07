import {Request, Response, NextFunction} from "express";
const {authJwt} = require('../middlewares')
const express = require('express')
const todo = express.Router();
const todoController = require('../controllers/todo-controller')

todo.post('/save_todo', [authJwt.verifyToken], todoController.savetodo)
todo.post('/get_todos', [authJwt.verifyToken], todoController.gettodos)
todo.post('/get_user_todos', [authJwt.verifyToken], todoController.getusertodos)
todo.post('/send_invite', [authJwt.verifyToken], todoController.sendInvite)
todo.post('/get_invited_todos', [authJwt.verifyToken], todoController.getUserInvitedTodos)
todo.get('/confirmation/:token' , todoController.handleConfirmation)

module.exports = todo