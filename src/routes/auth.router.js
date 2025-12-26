import { Router } from "express";
import { UserSignIn } from "../controllers/auth.controller.js";
const router=Router()

router.post('/',UserSignIn)

export default router