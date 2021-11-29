import models from "../models/models.js"
import ApiError from "../error/ApiError.js";
import tokenService from "../service/token-service.js";
import mailService from "./mailService.js";
import bcrypt from "bcrypt"
import {v4} from "uuid"
import dotenv from "dotenv";

dotenv.config()

class UserService {
    async registration(email, password, role) {
        if (!email && !password) {
            throw ApiError.badRequest("bad email or password")
        }
        const candidate = await models.User.findOne({where: {email}})
        if (candidate) {
            throw ApiError.badRequest("user with this email already exist")
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = v4();
        const user = await models.User.create({
            email,
            role,
            password: hashPassword,
            isActivated: false,
            activationLink: activationLink
        })
        await mailService.sendActivationMail(user.email, `${process.env.API_URL}/api/user/activate/${activationLink}`)

        await models.Basket.create({userId: user.id})

        // const tokens = tokenService.generateTokens({
        //
        //     id: user.id,
        //     email: user.email,
        //     role: user.role
        // })
        // await tokenService.saveToken(user.id, tokens.refreshToken)

        return {
            message:"click to link active"
        }
    }

    async activate(activationLink) {
        const user = await models.User.findOne({where: {activationLink}})
        if (!user) {
            throw ApiError.badRequest("is not correct link to activate")
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await models.User.findOne({where: {email}})
        if (user.isActivated === false) {
            throw ApiError.internal("you are not activate account")
        }
        if (!user) {
            throw ApiError.internal("user with this email was not found")
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            throw ApiError.internal("Incorrect password")
        }
        const tokens = tokenService.generateTokens({

            id: user.id,
            email: user.email,
            role: user.role
        })
        await tokenService.saveToken(user.id, tokens.refreshToken)
        const user_data = await models.User.findOne({where: {email}, attributes: ["email", "id", "role"]})
        return {tokens, user_data}
    }

    async refresh(refreshToken) {
        const tokenFromDB = tokenService.validationRefreshToken(refreshToken)
        const user_data = await tokenService.findToken(refreshToken)
        if (!tokenFromDB || !user_data || !refreshToken) {
            throw ApiError.badRequest('user is not authorization')
        }
        const user = await models.User.findOne({where: {id: user_data.userId}, attributes: ["email", "id", "role"]})
        const tokens = tokenService.generateTokens({
            id: user.id,
            email: user.email,
            role: user.role
        })
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return {tokens, user}

    }
}

export default new UserService()