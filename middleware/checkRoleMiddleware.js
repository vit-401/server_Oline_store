import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config()


export default (role) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({message: "User not logged in"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                return res.status(401).json({message: "no access"})
            }
            req.user = decoded
            next()

        } catch (err) {
            res.status(401).json({message: "User not logged in"})
        }
    }

}