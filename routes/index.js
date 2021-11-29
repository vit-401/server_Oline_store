import {Router} from "express"
import deviceRouter from "./deviceRouter.js"
import typeRouter from "./typeRouter.js"
import userRouter from "./userRouter.js"
import brandRouter from "./brandRouter.js"
import testRouter from "./testRouter.js"

const router = new Router()

router.use('/user',userRouter)
router.use('/type',typeRouter)
router.use('/brand',brandRouter)
router.use('/device',deviceRouter)
router.use('/test',testRouter)

export default router