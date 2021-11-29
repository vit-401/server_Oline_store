import {Router} from "express"
import userController from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js";
import {body} from "express-validator"

const router = new Router()

router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({min: 3, max: 32}),
    userController.registration)
router.get('/users', authMiddleware, userController.getAll)
router.post('/login', userController.login)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)

export default router
