const jwt = require('jsonwebtoken')
const config = require('../config/auth-config')
import {Role, User} from '../models'
const formatResponse = require('../utils/standard_response');
import {Request, Response, NextFunction} from "express";

interface ISessionDef {
    token: string,
}
interface IGetUserAuthInfoRequest extends Request {
    userId: string,
    session: ISessionDef,
}
const verifyToken = (req:IGetUserAuthInfoRequest, res:Response, next:NextFunction) => {
    let token = req.session.token;

    if(!token) {
        return res.status(403).json(formatResponse(res.statusCode, `No token provided`))
    }

    jwt.verify(token, config.secret, (error: any, decoded:any) => {
        if(error) {
            return res.status(401).json(formatResponse(res.statusCode, `Unauthorized`))
        }
        req.userId = decoded.id;
        next();
    })
}

const isAdmin = (req:IGetUserAuthInfoRequest, res:Response, next:NextFunction) => {
    User.findById(req.userId).exec((error:any, user:any) => {
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error))
            return
        }
        Role.find({_id: {$in: user.roles}}, (error:any, roles:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error))
                return
            } else {
                for(let i = 0; i < roles.length; i++) {
                    if(roles[i].name === 'admin') {
                        next();
                        return;
                    }
                }
                res.status(403).json(formatResponse(res.statusCode, 'Requires admin role'))
                return;
            }
        })
    })
}

const isModerator = (req:IGetUserAuthInfoRequest, res:Response, next:NextFunction) => {
    User.findById(req.userId).exec((error:any, user:any) => {
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error))
            return
        }
        Role.find({_id: {$in: user.roles}}, (error:any, roles:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error))
                return
            } else {
                for(let i = 0; i < roles.length; i++) {
                    if(roles[i].name === 'moderator') {
                        next();
                        return;
                    }
                }
                res.status(403).json(formatResponse(res.statusCode, 'Requires moderator role'))
                return;
            }
        })
    })
}

module.exports = {
    isAdmin, isModerator, verifyToken
}

