import {Request, Response, NextFunction} from "express";
const formatResponse = require('../utils/standard_response');
const allAccess = (req:Request, res:Response) => {
    res.status(200).json(formatResponse(res.statusCode, 'Public content'))
}

const userBoard = (req:Request, res:Response) => {
    res.status(200).json(formatResponse(res.statusCode, 'User content'))
}

const adminBoard = (req:Request, res:Response) => {
    res.status(200).json(formatResponse(res.statusCode, 'Admin content'))
}

const moderatorBoard = (req:Request, res:Response) => {
    res.status(200).json(formatResponse(res.statusCode, 'Moderator content'))
}

module.exports = {
    allAccess, userBoard, adminBoard, moderatorBoard
}