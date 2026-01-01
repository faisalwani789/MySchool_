import { Router } from "express";
import { createClass,getClasses } from "../controllers/class.controller.js";
import { getSubjects,addSubject } from "../controllers/subject.controller.js";
import { getRoles,addRole } from "../controllers/roles.controller.js";

import { authMiddleware,authRole } from "../middlewares/auth.middleware.js";
const router=Router()
router.post('/classes',authMiddleware,authRole(4),createClass)
router.get('/classes',authMiddleware,authRole(4),getClasses)


router.get('/subjects',authMiddleware,authRole(4),getSubjects)
router.post('/subjects',authMiddleware,authRole(4),addSubject)

router.get('/roles',getRoles)
router.post('/roles',addRole)
export default router