import {Todo, TodoItem, UserTodo, User} from "../models";
import {Request, Response, NextFunction} from "express";
const config = require('../config/auth-config')
const emailConfig = require('../config/email-config')
const formatResponse = require('../utils/standard_response')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const savetodo = (req:Request, res:Response) => {
    const todo = new Todo({
        title: req.body.title,
        priority: req.body.priority,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
    });
    todo.save((error:any, todo:any) => {
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error))
            return;
        }
        TodoItem.insertMany(req.body.items, (error: any, item:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error));
                return;
            }
            todo.items = item.map((_item:any) => _item.id)
            todo.save((error:any) => {
                if(error) {
                    res.status(500).json(formatResponse(res.statusCode, error));
                    return;
                } else {
                    const ownership: string = 'owner';
                    saveUserTodo(todo, req.body.id, ownership);
                    res.status(200).json(formatResponse(res.statusCode, 'Todo saved successfully'));
                }
            })
        })
    })
}

const saveUserTodo = (todo: any, userId: any, ownership: string) => {
    const userTodo = new UserTodo({
        todo: todo,
        user:userId,
        ownership: ownership
    });
    userTodo.save((error: any, userTodo:any) => {
        if(error) {
            console.log(error)
        } else {
            console.log(userTodo)
        }
    })
};

const getusertodos = (req:Request, res:Response) => {
    const userid = req.body.userid;
    UserTodo.find({user: userid})
        .populate({
            path: 'todo',
            populate: {
                path: 'items'
            }
        })
        .exec((error:any, userTodo:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error));
            } else {
                return res.status(200).json(formatResponse(res.statusCode, 'Todos fetched Successfully', userTodo));
            }
        })
}

const gettodos = (req:Request, res:Response) => {
    Todo.find().populate("items", "-__v").exec((error:any, todo:any) => {
        if(error) {
            res.status(500).json(formatResponse(res.statusCode, error));
        }
        return res.status(200).json(formatResponse(res.statusCode, 'Todos fetched Successfully', todo));
    })
}

const sendInvite = (req:Request, res:Response) => {
    User.findOne({email: 'justine@gmail.com'}).exec((error:any, user:any) => {
        console.log(user._id);
        const todoId = '63dfe6c1092876f905e1434c'
        Todo.findById(todoId).exec((error:any, todo:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error));
            } else {
                console.log(`TodoID: ${todo._id}`)
                sendInviteEmail(user._id, todoId, res, req)
            }

        })
    })
}

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
    }
})
const sendInviteEmail = (id: any, todoId: string, res:Response, req:Request) => {
    const mailToken = jwt.sign({id: id, todoId: todoId}, emailConfig.secret, {
        expiresIn: 86400
    });
    const url = `http://localhost:8000/api/v1/confirmation/${mailToken}`
    transporter.sendMail({
        to: 'dalali.manoni@proton.me',
        subject: 'Invited to Task',
        html: `<p> Please click this link to accept invitation <a target="_blank" href="${url}"> ${url} </a></p>`
    }).then((r: any) => {
        return res.status(200).json(formatResponse(res.statusCode, 'Invitation sent successfully'));
    })
}

const handleConfirmation = (req:Request, res:Response) => {

    jwt.verify(req.params.token, emailConfig.secret, (error: any, decodedData:any) => {
        if(error) {
            return res.status(403).json(formatResponse(res.statusCode, `Token verification error`))
        }
        const ownership = 'invited'
        Todo.findById(decodedData.todoId).exec((error:any, todo:any) => {
            console.log(`Here is the todo: ${todo}`)
            saveUserTodo(todo, decodedData.id, ownership);
        })

    });
    return res.redirect('http://localhost:5173')
}

const getUserInvitedTodos = (req:Request, res:Response) => {
    const user = req.body.userId
    UserTodo.find({user: user})
        .populate({
            path: 'todo',
            populate: {
                path: 'items'
            }
        })
        .exec((error:any, userTodo:any) => {
            if(error) {
                res.status(500).json(formatResponse(res.statusCode, error));
            } else {
                return res.status(200).json(formatResponse(res.statusCode, 'Todos fetched Successfully', userTodo));
            }
        })
}

module.exports = {
    savetodo, gettodos, getusertodos, sendInvite, handleConfirmation, getUserInvitedTodos
}

