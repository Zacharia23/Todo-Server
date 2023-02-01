import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const database =  require('./utils/database')
const pinoLogger = require('express-pino-logger')
const logger = require('./services/loggerService')
const register = require('./routes/register')
const formatResponse = require('./utils/standard_response')

const loggerMiddleware = pinoLogger({
    logger: logger,
    autoLogging: true,
})

app.use(loggerMiddleware)
app.use(express.json())

app.use('/api/v1', register);

app.get('*', function (req: Request, res: Response) {
    res.status(404).json(formatResponse(res.statusCode, 'Invalid Route'))
})

app.post('*', function (req: Request, res: Response) {
    res.status(404).json(formatResponse(res.statusCode, 'Invalid Route'))
})

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`)
})
