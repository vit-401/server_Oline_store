import ApiError from "../error/ApiError.js";
import bcrypt from "bcrypt"
import models from "../models/models.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config()

const generateJWT = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: "24h"}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email && !password) {
            return next(ApiError.badRequest("bad email or password"))
        }
        const candidate = await models.User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest("user with this email already exist"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await models.User.create({email, role, password: hashPassword})
        const basket = await models.Basket.create({userId: user.id})
        const jwtToken = generateJWT(user.id, user.email, user.role)
        return res.json({token: jwtToken})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await models.User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal("user with this email was not found"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal("Incorrect password"))
        }
        const jwtToken = generateJWT(user.id, user.email, user.role)
        return res.json({token: jwtToken})

    }

    async check(req, res, next) {
        const jwtToken = generateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token: jwtToken})

    }
}

export default new UserController()