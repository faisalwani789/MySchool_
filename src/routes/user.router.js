import { Router } from "express";
import { addUser ,getUsers} from "../controllers/user.controller.js";
const router=Router()
router.get('/',getUsers)
router.post('/',addUser)
export default router