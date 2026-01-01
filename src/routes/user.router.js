import { Router } from "express";
// import { addUser ,getUsers} from "../controllers/user.controller.js";
import { authMiddleware,authRole } from "../middlewares/auth.middleware.js";
import {addUser,getUsers} from "../controllers/user.controller2.js"
import { UserSignIn } from "../controllers/auth.controller.js";
const router=Router()
router.get('/',getUsers)
router.post('/',addUser)
router.post('/signin',UserSignIn)
export default router