import dotenv from "dotenv";
import jwt from "jsonwebtoken"

import models from "../models/models.js";

dotenv.config()

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            {expiresIn: "45s"}
        )
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            {expiresIn: "30d"}
        )
        return {accessToken, refreshToken}
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await models.Token.findOne({where:userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await models.Token.create({userId, refreshToken})
        return token
    }

    validationAccessToken(token) {
        try {
            const user_data = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
            return user_data
        } catch (e) {
            return null

        }
    }

    validationRefreshToken(token) {
        try {
            const user_data = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
            return user_data
        } catch (e) {
            return null
        }
    }

    findToken(token) {
        try {
            const isTokenSet = models.Token.findOne({where:{refreshToken:token}})
            return isTokenSet
        } catch (e) {
            return null
        }
    }
}

export default new TokenService()