import {Router} from "express"
import testController from "../controllers/testController.js"

const router = new Router()

router.post('/',  testController.create)
router.get('/', testController.getAll)

export default router