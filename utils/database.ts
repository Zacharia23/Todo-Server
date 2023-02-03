const mongoose = require('mongoose')
const logger = require('../services/loggerService')
const mongo_url = process.env.MONGO_ATLAS;
import {Role, User, Todo, TodoItem} from '../models'

mongoose.set("strictQuery", false)
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info(`Connected to MongoDB`)
    initial();
}).catch((error: any) => {
    logger.error(`Mongodb connection failed:  ${error}`);
    process.exit();
})

const initial = () => {
  Role.estimatedDocumentCount((error: any, count: any) => {
      if (!error && count === 0) {
          new Role({name: "user"}).save((error: any) => {
              if(error) {
                  logger.error(`failed to save: ${error}`)
              } else {
                  logger.info(`added 'user' to roles collection`)
              }
          });
          new Role({name: "moderator"}).save((error: any) => {
              if(error) {
                  logger.error(`failed to save: ${error}`)
              } else {
                  logger.info(`added 'moderator' to roles collection`)
              }
          });
          new Role({name: "admin"}).save((error: any) => {
              if(error) {
                  logger.error(`failed to save: ${error}`)
              } else {
                  logger.info(`added 'admin' to roles collection`)
              }
          });
      }
  })
}