
import {Role, User} from "../models";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import {Request, Response, NextFunction} from "express";
const config =  require("../config/auth-config");
const formatResponse = require('../utils/standard_response');

const signup = (req:Request, res:Response) => {
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((error:any, user:any) => {
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error))
            return;
        }
        if(req.body.roles) {
            Role.find({name: {$in: req.body.roles}}, (error:any, roles:any) => {
                if(error) {
                    res.status(500).json(formatResponse(res.statusCode, error))
                    return;
                }
                user.roles = roles.map((role:any) => role._id)
                user.save((error:any) => {
                    if(error) {
                        res.status(500).json(formatResponse(res.statusCode, error))
                        return;
                    } else {
                        res.status(200).json(formatResponse(res.statusCode, 'user registered successfully'))
                    }
                })
            })
        } else {
            Role.findOne({name: "user"}, (error: any, role: any) => {
                if(error) {
                    res.status(500).json(formatResponse(res.statusCode, error));
                    return;
                }
                user.roles = [role._id];
                user.save((error: any) => {
                    if(error) {
                        res.status(500).json(formatResponse(res.statusCode, error));
                        return;
                    } else {
                        res.status(200).json(formatResponse(res.statusCode, 'User was registered successfully!'));
                    }
                })
            })
        }
    })
}

const signin = (req:Request, res:Response) => {
    User.findOne({
        username: req.body.username,
    }).populate("roles", "-__v")
        .exec((error:any, user:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error));
            }
            if(!user) {
                return res.status(404).json(formatResponse(res.statusCode, 'User Not Found!'));
            }

            const passwordValidity = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if(!passwordValidity) {
                return res.status(401).json(formatResponse(res.statusCode, 'Invalid Password!'));
            }

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400
            });

            const authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            req.session.token = token;

            const userData = ({id: user._id, username: user.username, email: user.email, role: authorities, token: token})

            return res.status(200).json(formatResponse(res.statusCode, 'Login Success', userData));
        })
}

const signout = async (req:Request, res:Response) => {
    try{
        req.session = null;
        return res.status(200).json(formatResponse(res.statusCode, 'Successfully Signed out'));
    } catch (error) {
        this.next(error);
    }
}

module.exports = {
    signup,signin, signout
}