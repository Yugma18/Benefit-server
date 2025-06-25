const ApiError = require('../exceptions/ApiError');

module.exports = async function (req, res, next) {
    try {
        const usersType = ['admin', 'employer', 'employee'];
        const { roles } = req.user;
        const typeDefinitionArray = usersType.filter((type) =>
            roles.includes(type)
        );
        if (!typeDefinitionArray.length > 0) next(ApiError.AccessError());
        next();
    } catch (e) {
        return next(ApiError.AccessError());
    }
};
