import { prisma } from "../../lib/prisma.js"
export const addUser = async (req, res) => {
    const { id, user, classes, } = req.body
    const { first_name, last_name, roleId, address, roll_no, class_id, email, password, parent } = user
    try {
        await prisma.$transaction(async (tx) => {
            if (req.body?.id) {

                //update user
                const user = await tx.user.findUnique({ where: { id: id } })
                if (!user) return res.status(400).send('user does not exist')


                const updateUser = await tx.user.update({
                    where: { id: id },
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        address: address

                    },
                    select: {
                        role: true,
                        id: true
                    }
                })

                if (updateUser.role === 2) {
                    //update student
                    const studet = await tx.student.findUnique({ where: { userId: id } })
                    if (!studet) return res.status(400).send('student does not exist')
                    //how to update parent and student

                    const updateStudent = await tx.student.update({
                        where: { userId: id },
                        data: {
                            classId: class_id,
                            rollNo: roll_no
                        },
                        select: {
                            rollNo: true
                        }
                    })
                    return res.status(201).json({ message: "student updated successfully" })
                }
                else if (roleId === 3) {

                    //update parent
                    const parent = await tx.parent.findUnique({ where: { userId: updateUser.id } })
                    if (!parent) return res.status(400).send('no user found')
                    await tx.parent.update({
                        where: { userId: updateUser.id },
                        data: {
                            occupation: parent.occupation
                        }
                    })
                     return res.status(201).json({ message: "parent updated successfully" })
                }
                else {
                    const teacher = await tx.teacher.findUnique({ where: { userId: id } })
                    if (!teacher) res.status(400).send('teacher does not exist')


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

                    return res.status(201).json({ message: "teacher updated successfully" })
                }
            }

            else {
                //create user

                const user = await tx.user.findUnique({ where: { email: email } })
                if (user) return res.status(400).send('user already exists')


                const passwordHash = await bcrypt.hash(password, 10)
                const newUser = await tx.user.create({
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        roleId: roleId,
                        password: passwordHash,
                        address: address
                    },
                    select: {
                        id: true,
                        email: true,
                        roleId: true
                    }
                })


                if (newUser.role === 2) {
                    //first add parent user then student
                    //add student
                    //create parent user
                    const passwordHash = await bcrypt.hash(parent.password, 10)
                    const newParentUser = await tx.user.create({
                        data: {
                            first_name: parent.first_name,
                            last_name: parent.last_name,
                            email: parent.email,
                            roleId: parent.roleId,
                            password: passwordHash,
                            address: address //same of student/user
                        },
                        select: {
                            id: true,
                            email: true,
                            roleId: true
                        }
                    })

                    const newParent = await tx.parent.create({
                        data: {
                            userId: newParentUser.id,
                            occupation: parent.occupation
                        }
                    })

                    const newStudent = await tx.student.create({
                        data: {
                            rollNo: roll_no,
                            userId: newUser.id,
                            classId: class_id,
                            parent: newParent.id
                        },
                        select: {
                            rollNo: true
                        }
                    })
                    return res.status(201).send(`student and its parent with roll no ${newStudent.rollNo}created successfully`)
                }

                else {
                    //add teacher
                    const newTeacher = await tx.teacher.create({
                        data: {
                            userId: newUser.id,
                        },
                        select: {
                            id: true
                        }
                    })

                    if (req.body?.classes) {
                        for (const tcr of classes) {
                            console.log(tcr.class_id)
                            const TrClassId = await tx.teacherClasses.create({
                                data: {
                                    teacher: {
                                        connect: {
                                            id: newTeacher.id
                                        }
                                    },
                                    class: {
                                        connect: {
                                            id: tcr.class_id
                                        }
                                    }
                                }
                            })
                            await tx.teacherClassesSubject.createMany({
                                data: tcr?.subjects.map(sub => ({ teacherClassId: TrClassId.id, subject_id: sub }))
                            })
                        }
                        return res.status(201).json({ msg: 'teacher added successfully with subjects', })
                    }

                    res.status(201).send('teacher added successfully without subjects')
                }

            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}
