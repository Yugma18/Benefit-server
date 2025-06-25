const jwt = require('jsonwebtoken');
const TokenModel = require('../models/Token');

class TokenService {
    async generateTokens(payload) {
        return {
            accessToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
                expiresIn: '24h',
            }),
            refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: '30d',
            }),
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken) {
        return TokenModel.deleteOne({ refreshToken });
    }

    async validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        return TokenModel.findOne({ refreshToken });
    }
}

module.exports = new TokenService();
