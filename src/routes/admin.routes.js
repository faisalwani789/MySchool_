import { Router } from "express";
import { createClass,getClasses } from "../controllers/class.controller";
import { getSubjects,addSubject } from "../controllers/teacher.controller";
import { getRoles,addRole } from "../controllers/roles.controller";
const router=Router()
router.get('/classes',getClasses)
router.post('/classes',createClass)

router.get('/subjects',getSubjects)
router.post('/subjects',addSubject)

router.get('/roles',getRoles)
router.post('/roles',addRole)
export default router