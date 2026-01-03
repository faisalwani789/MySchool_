import { Router } from "express";
import { createClassSubject,getClasses } from "../controllers/class.controller.js";
import { getSubjects,addSubject } from "../controllers/subject.controller.js";
import { getRoles,addRole } from "../controllers/roles.controller.js";

import { authMiddleware,authRole } from "../middlewares/auth.middleware.js";
import { addMarks, getMarks } from "../controllers/marks.controller.js";
const router=Router()
router.post('/classes',createClassSubject)
router.get('/classes',getClasses)


router.get('/subjects',authMiddleware,authRole(4),getSubjects)
router.post('/subjects',authMiddleware,authRole(4),addSubject)

router.get('/roles',getRoles)
router.post('/roles',addRole)

router.get('/marks',getMarks)
router.post('/marks',addMarks)
export default router