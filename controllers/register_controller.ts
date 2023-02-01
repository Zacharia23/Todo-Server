import {Request, Response, NextFunction} from "express";

exports.index = function (req:Request, res:Response) {
    res.status(200).send(`Index of registration`)
}

exports.create = function (req:Request, res:Response) {
    res.status(200).send(`Create user controller`)
}