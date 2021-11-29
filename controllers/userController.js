import ApiError from "../error/ApiError.js";
import bcrypt from "bcrypt"
import models from "../models/models.js"
import dotenv from "dotenv";
import userService from "../service/user-service.js";
import {validationResult} from "express-validator"
import tokenService from "../service/token-service.js";


dotenv.config()


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("validation Error", errors.array()))
            }
            const {email, password, role} = req.body

            const data = await userService.registration(email, password, role)
            res.cookie(
                'refreshToken',
                data.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            )
            return res.json(data)
        } catch (e) {
            next(e)
        }
    }


    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie(
                'refreshToken',
                userData.tokens.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            )
            return res.json(userData)
        } catch (e) {
            next(ApiError.internal(e))
        }

    }



    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            throw new Error(e)
        }

    }

    async getAll(req, res, next) {
        try {
            const users = await models.User.findAll({attributes:["email","id", "role"]})

            return res.json(users)
        } catch (e) {
            throw new Error(e)
        }
    }
    async refresh(req, res, next) {
        try {
         const {refreshToken} = req.cookies
            const user_data = await userService.refresh(refreshToken)
            res.cookie(
                'refreshToken',
                user_data.tokens.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            )
            return res.json(user_data)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()