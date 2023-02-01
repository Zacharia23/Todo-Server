import {Request, Response, NextFunction} from "express";

const express = require('express')
const register = express.Router();
const registerController = require('../controllers/register_controller')
register.post('/register_user', (req: Request, res: Response, next: NextFunction) => {
    registerController.index(req, res)
})

module.exports = register