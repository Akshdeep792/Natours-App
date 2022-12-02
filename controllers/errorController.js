const AppError = require('../utils/appError')
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}, please use another value!`
    return new AppError(message, 400)
}
const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid Input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}
const sendErrordev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error('ERROR 💥', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}
module.exports = (err, req, res, next) => {
    // console.log(err.stack )
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'developement') {
        sendErrordev(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.naem === 'ValidationError') error = handleValidationError(error)
        sendErrorProd(err, res)
    }
}