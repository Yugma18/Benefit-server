const ApiError = require('../exceptions/ApiError');
const TokenService = require('../services/TokenService');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) return next(ApiError.UnauthorizedError());
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) return next(ApiError.UnauthorizedError());
        const user = await TokenService.validateAccessToken(accessToken);
        if (!user) return next(ApiError.UnauthorizedError());

        req.user = user;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
