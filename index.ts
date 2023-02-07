import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from 'dotenv';
const cors = require('cors')
const helmet = require("helmet")
const cookieSession = require('cookie-session')
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const database =  require('./utils/database')
const pinoLogger = require('express-pino-logger')
const logger = require('./services/loggerService')
const auth = require('./routes/auth')
const todo = require('./routes/todo')
const formatResponse = require('./utils/standard_response')

const loggerMiddleware = pinoLogger({
    logger: logger,
    autoLogging: true,
})

app.use(express.urlencoded({extended: true}))

app.use(
    cookieSession({
        name: "tsk_session",
        secret: "EFsOh0pxddxJeocSH6XyCy4ccXWSl37EA2pZVGfj1uI=",
        httpOnly: true,
    })
)

app.use(loggerMiddleware)
app.use(express.json())

app.use(helmet())

app.use(cors({
    origin: '*'
}))

app.use(function(req: Request, res: Response, next:NextFunction) {
    res.header(
        'Access-Control-Allow-Headers', 'Origin, Content-Type, Accept'
    ), next();
})

app.use('/api/v1', auth);
app.use('/api/v1', todo);

app.get('*', function (req: Request, res: Response) {
    res.status(404).json(formatResponse(res.statusCode, 'Invalid Route'))
})

app.post('*', function (req: Request, res: Response) {
    res.status(404).json(formatResponse(res.statusCode, 'Invalid Route'))
})

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`)
})
