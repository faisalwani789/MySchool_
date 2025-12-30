import { prisma } from "../../lib/prisma.js"
import bcrypt from 'bcrypt'
export const addUser = async (req, res) => {
    const { user, classes, parent } = req.body
    const { id , first_name, last_name, roleId, address, email, password } = user
    const { occupation, children } = parent
    let newUser

    try {
        await prisma.$transaction(async (tx) => {
            // const user = await tx.user.findUnique({ where: { email: email } })
            // if (user) return res.status(400).send('user already exists')

            if (req.body.user.id) {
                 newUser = await tx.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        address: address
                    }

                })
            }
            else {
                const passwordHash = await bcrypt.hash(password, 10)
                 newUser = await tx.user.create({
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        role: roleId,
                        password: passwordHash,
                        address: address
                    }
                })
            }


            if (newUser.role === 2 || roleId === 2) {
                //parent user added now add parent to parent table and add its children
                // const parentFind = await tx.parent.findUnique({ where: { userId: id } })
                const ParentC = await tx.parent.upsert({
                    where: {
                        userId: newUser.id || -1
                    },
                    update: {
                        occupation: occupation
                    },
                    create: {
                        userId: newUser.id,
                        occupation: occupation
                    }
                })

            if(children){
                for (const child of children) {

                    //adding student user
                    const passwordHash = await bcrypt.hash(child.password, 10)
                    const childrenUser = await tx.user.upsert({
                        where: {
                            id: child.childUserId || -1
                        },
                        update: {
                            first_name: child.first_name,
                            last_name: child.last_name,
                            email: child.email,
                            address: child.address
                        },
                        create: {
                            first_name: child.first_name,
                            last_name: child.last_name,
                            email: child.email,
                            role: child.roleId,
                            password: passwordHash,
                            address: child.address //same of student/user
                        },
                        select: {
                            id: true,
                            email: true,
                            role: true
                        }
                    })

                    //adding student from student users

                    const newStudent = await tx.student.upsert({
                        where: { userId: childrenUser.id || -1 },
                        update: {
                            classId: child.class_id,
                            rollNo: child.roll_no
                        },
                        create: {
                            rollNo: child.roll_no,
                            userId: childrenUser.id,
                            classId: child.class_id,
                            parentId: ParentC.id
                        }
                    })

                }
            }    
                

                return res.status(201).send(`student and its parent with roll no created successfully`)
            }


            else {
                const teacher = await tx.teacher.upsert({
                    where: { userId: id || -1 },
                    update: {},
                    create: {
                        userId: newUser.id,
                    }
                })

                if (id) {
                    //updating teacher class and subjects
                    await tx.teacherClasses.updateMany({
                        where: { teacherId: teacher.id },
                        data: { isActive: false }

                    })



                    const teacherClassIds = await tx.teacherClasses.findMany({
                        where: { teacherId: teacher.id },
                        select: { id: true }
                    })


                    if (teacherClassIds.length) {
                        await tx.teacherClassesSubject.updateMany({
                            where: {
                                teacherClassId: {
                                    in: teacherClassIds.map(tc => tc.id)
                                }
                            },
                            data: { isActive: false }
                        })
                    }
                }




                for (const tcr of classes || []) {
                    const TrClassId = await tx.teacherClasses.upsert({
                        where: {
                            teacherId_classId: {
                                teacherId: teacher.id,
                                classId: tcr.class_id
                            }

                        },
                        update: {
                            isActive: true
                        },
                        create: {
                            teacherId: teacher.id,
                            classId: tcr.class_id
                        }
                    })

                    for (const sub of tcr.subjects || []) {
                        await tx.teacherClassesSubject.upsert({
                            where: {
                                teacherClassId_subjectId: {
                                    teacherClassId: TrClassId.id,
                                    subjectId: sub
                                }

                            },
                            update: {
                                isActive: true
                            },
                            create: {
                                teacherClassId: TrClassId.id,
                                subjectId: sub
                            }
                        })
                    }
                }

                return res.status(201).json({ message: "teacher created/updated successfully" })
            }

        })

    } catch (error) {
        res.status(500).send(error.message)
    }
}