import { prisma } from "../../lib/prisma.js"
export const addSubject = async (req, res) => {
    const { id, subjectName } = req.body
    try {
        if (req.body.id) {
            //update
            const classExists = await prisma.subject.findUnique({
                where: {
                    id: id
                }
            })
            if (classExists) throw new Error('subject does not exist')
            await prisma.subject.update({
                where: {
                    id: id
                },
                data: {
                    subjectName: subjectName
                }
            })
            return res.status(201).json({ msg: 'subject updated  successfully ' })
        }
        else {
            const sub = await prisma.subject.findUnique({
                where: {
                    subjectName: subjectName
                }
            })
            if (!sub) throw new Error('subject already exists')
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
    const { id } = req.body
    try {
        if(req.body?.id){
            //get single user
              const subject = await prisma.subject.findUnique({
            where: {
                id: id
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
