import { prisma } from "../../lib/prisma.js"

export const addMarks = async (req, res) => {
    try {
        await prisma.$transaction(async (tx) => {
            for (const sub of req.body.subMarks || []) {
                await tx.marks.upsert({
                    where: {
                        id: sub.id || -1
                    },
                    update: {
                        marksObt: sub.marks
                    },
                    create: {
                        studentId: req.body.studentId,
                        subjectId: sub.subjectId,
                        marksObt: sub.marks

                    }
                })

            }

        })
        res.status(201).send('marks added ')

    } catch (error) {
        res.status(500).send(error.message)
    }
}
export const getMarks = async (req, res) => {
 
    try {
        let marksInfo
        if (req.body?.id) {
            marksInfo = await prisma.student.findFirst({
                where: {
                    id: req.body.id
                },
                include: {
                    marks: true
                }
            })
        }
        else {
            marksInfo = await prisma.student.findMany({
                include: {
                    marks: true
                }
            })
        }


        res.json({ marksInfo })

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}