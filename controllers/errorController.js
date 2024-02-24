const statusCodes = require("http-status-codes");

exports.respondSourceNotFound = (req, res) => {
    let errorCode = statusCodes.NOT_FOUND;
    res.status(errorCode);
    res.render("error", {errorCode:errorCode})
}

exports.respondInternalError = (error, req, res, next) => {
    let errorCode = statusCodes.INTERNAL_SERVER_ERROR;
    console.log(error);
    res.status(errorCode);
    res.render("error", {errorCode:errorCode});
}