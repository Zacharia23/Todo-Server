function getStandardResponse(status: Number, message: String, data: any) {
    return {
        status: status,
        message: message,
        data: data
    }
}

module.exports = getStandardResponse