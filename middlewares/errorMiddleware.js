const ApiError = require('../exceptions/ApiError');
module.exports = function (err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err });
    }
    return res.status(500).json({ message: 'unknown error', errors: err });
};
