import { prisma } from "../../lib/prisma.js"
export const createClassSubject = async (req, res) => {
    const { classes } = req.body


    try {
        const result = await prisma.$transaction(async (tx) => {
            for (const cls of classes) {
                const savedClass = cls.id ? await tx.class.update({
                    where: { id: cls.id },
                    data: { className: cls.className },

                }) : await tx.class.create({
                    data: {
                        className: cls.className
                    }
                })
                if(!Array.isArray(cls.subjects)) continue //no subjects sent 

                for (const sub of cls.subjects) {
                    let savedSubject
                    if (sub.id) {
                        await tx.subject.update({
                            where: { id: sub.id },
                            data: { subjectName: sub.subjectName }
                        
                        })
                    }
                    else {
                        savedSubject = await tx.subject.create({
                            data: {
                                subjectName: sub.subjectName
                            }
                        })
                        await tx.classSubjects.upsert({
                            where: {
                                classId_subjectId:{
                                    classId:savedClass.id,
                                    subjectId:savedSubject.id
                                }
                               
                            },
                            update: {},
                            create: {
                                classId: savedClass.id,
                                subjectId: savedSubject.id
                            }
                        })
                    }


                }
            }
        })
        res.json({ success: true, data: result })
    } catch (error) {
        return res.status(500).send(error.message)
    }

}
export const getClasses = async (req, res) => {

    try {
        if (req.body?.id) {
            const getClass = await prisma.class.findUnique({
                where: {
                    id: req.body.id

                },
                include:{
                    class:true,
                    subject:true
                }
            })
            return res.status(201).json({ getClass })
        }
        const classes = await prisma.class.findMany({
            include:{
                    classSubjects:true
                }
        })
        return res.status(201).json({ classes })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

