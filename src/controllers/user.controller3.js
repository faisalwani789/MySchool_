import { prisma } from '../../lib/prisma.js'
import { addTeacherWithClasses, assignRole, createParent, createUser, upsertStudent } from '../helpers/create.parent.teachers.js'


export const addUsers = async (req, res) => {
    const{roles,user,classes=[],children:rawChildren,parent,teacher}=req.body
    
    const children=Array.isArray(rawChildren) ? rawChildren : []
    try {
        await prisma.$transaction(async (tx) => {
           
            const mainUser =await createUser(tx,user)
            let parentEntity=null
            if(roles.isParent){
                await assignRole(tx,mainUser.id,2)
                parentEntity=await createParent(tx,mainUser,parent)
            }

            
            if(roles.isTeacher){
                 await assignRole(tx,mainUser.id,3)
                const teacherEntity=await addTeacherWithClasses(tx,classes,mainUser,teacher)

            }


            if (roles.isParent && children.length>0) {
                for (const child of children) {
                    const childrenUser = await createUser(tx,child)
                    await assignRole(tx,childrenUser.id,1)
                    //adding student from student users
                    const newStudent = await upsertStudent(tx,childrenUser,child,parentEntity.id)

                }
            }


        })
    
        res.status(201).json({success:true,message:'teacher child parent added successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export const getUsers=async(req,res)=>{
    try {
        await prisma.$transaction(async(tx)=>{
            const users= await tx.user.findMany({
                
            })
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}