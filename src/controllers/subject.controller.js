import { prisma } from "../../lib/prisma.js"
export const addSubject = async (req, res) => {
    const{subjectName}=req.body
    try {
        if (req.body?.id) {
            //update
            const subjectExists = await prisma.subject.findUnique({
                where: {
                    id: req.body.id
                }
            })
            if (!subjectExists) throw new Error('subject does not exist')
            await prisma.subject.update({
                where: {
                    id: req.body.id
                },
                data: {
                    subjectName: subjectName
                }
            })
            return res.status(201).json({ msg: 'subject updated  successfully ' })
        }
        else {
            const sub = await prisma.subject.findFirst({
                where: {
                    subjectName: subjectName
                }
            })
            if (sub) throw new Error('subject already exists')
            const newSubject = await prisma.subject.create({
                data: {
                    subjectName: subjectName
                }
            })
            return res.status(201).json({ msg: 'subjects added successfully' })
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
export const getSubjects = async (req, res) => {
    try {
        if(req.body?.id){
            //get single user
              const subject = await prisma.subject.findUnique({
            where: {
                id: req.body.id
            }
        })
        return res.status(201).json({ subject })

        }
        else{
            const subjects = await prisma.subject.findMany({})
        return res.status(201).json({ subjects })
        }

        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
