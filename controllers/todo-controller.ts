import {Todo, TodoItem, UserTodo} from "../models";
import {Request, Response, NextFunction} from "express";
const config = require('../config/auth-config')
const formatResponse = require('../utils/standard_response')


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
                    saveUserTodo(todo, req.body.id);
                    res.status(200).json(formatResponse(res.statusCode, 'Todo saved successfully'));
                }
            })
        })
    })
}

const saveUserTodo = (todo: any, userId:any) => {
    const userTodo = new UserTodo({
        todo: todo,
        user:userId,
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
    UserTodo.find()
        .populate("todo", "-__v")
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

module.exports = {
    savetodo, gettodos, getusertodos
}
