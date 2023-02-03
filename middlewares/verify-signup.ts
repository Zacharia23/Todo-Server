const formatResponse = require('../utils/standard_response');
import express, {Express, NextFunction, Request, Response} from "express";
import {Role, User} from '../models'
const roles = ['admin', 'moderator', 'user']
const checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({
        username: req.body.username
    }).exec((error: any, user: any) => {
        console.log(`user: ${user}`)
        console.log(`error: ${error}`)
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error))
            return;
        }

        if(user) {
            res.status(400).json(formatResponse(res.statusCode, 'Username already exists'))
            return;
        }
        console.log(`${user}`)

        User.findOne({
            email: req.body.email
        }).exec((error: any, user: any) => {
            if (error) {
                res.status(500).json(formatResponse(res.statusCode, error))
                return;
            }

            if(user) {
                res.status(400).json(formatResponse(res.statusCode, 'Email already exists'))
                return;
            }
            next();
        });
    });
};

const checkRolesExist = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if(!roles.includes(req.body.roles[i])) {
                res.status(400).json(formatResponse(res.statusCode, `${req.body.roles[i]} does not exist`))
                return;
            }
        }
    }
    next();
}

module.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExist
}