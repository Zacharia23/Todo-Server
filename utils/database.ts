const mongoose = require('mongoose')
const logger = require('../services/loggerService')
const mongo_url = process.env.MONGO_ATLAS;

mongoose.set("strictQuery", false)
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error: any) => {
    if(error) {
        throw error;
    } else {
        logger.info(`Connected to mongoDB`);
    }
})