import { Router } from "express";
import { createClass,getClasses } from "../controllers/class.controller.js";
import { getSubjects,addSubject } from "../controllers/subject.controller.js";
import { getRoles,addRole } from "../controllers/roles.controller.js";
const router=Router()
router.post('/classes',createClass)
router.get('/classes',getClasses)


router.get('/subjects',getSubjects)
router.post('/subjects',addSubject)

router.get('/roles',getRoles)
router.post('/roles',addRole)
export default router