import {Request, Response, NextFunction} from "express";

const express = require('express')
const login = express.Router();

login.post('/register_user', (req: Request, res: Response, next: NextFunction) => {
    res.send(`Success`)
})

module.exports = login