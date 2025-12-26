import { prisma } from "../../lib/prisma"
export const addSubject=async(req,res)=>{
const{id,subjects,subjectName}=req.body
 try {
        if (id) {
            //update
            const classExists = await prisma.subject.findUnique({
                where: {
                    id: id
                }
            })
            if (!classExists) throw new Error('subject does not exist')
            await prisma.subject.update({
                where: {
                    id: id
                },
                data:{
                    subjectName:subjectName
                }
            })
            return res.status(201).json({ msg: 'subject updated  successfully with subjects' })
        }
        else {
            const newSubject = await prisma.subject.createMany({
                data: subjects
            })
            return res.status(201).json({ msg: 'subjects added successfully with subjects', })
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
export const getSubjects=async(req,res)=>{
     try {
        const subjects= await prisma.subject.findMany({
            
        })
        return res.status(201).json({subjects})
    } catch (error) {
          return res.status(500).json({ msg: error.message })
    }
}