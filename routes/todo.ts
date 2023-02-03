import {Request, Response, NextFunction} from "express";
const {authJwt} = require('../middlewares')
const express = require('express')
const todo = express.Router();
const userController = require('../controllers/user-controller')

todo.post('/save_todo', [authJwt.verifyToken], userController.userBoard)

module.exports = todo