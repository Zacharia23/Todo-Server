import {Request, Response, NextFunction} from "express";
const { verifySignup } = require('../middlewares')
const controller = require('../controllers/auth-controller')

const express = require('express')
const auth = express.Router();

auth.post('/register_user', [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExist], controller.signup)
auth.post('/user_login', controller.signin)
auth.post('/user_signout', controller.signout)

module.exports = auth