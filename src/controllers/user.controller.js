import { prisma } from "../../lib/prisma.js"
import bcrypt from 'bcrypt'
export const addUser = async (req, res) => {
    const { id, user, classes, } = req.body
    const { first_name, last_name, roleId, address, roll_no, class_id, email, password, children, occupation } = user
    console.log(email)
    try {
        await prisma.$transaction(async (tx) => {
            if (req.body?.id) {

                //update user
                const user = await tx.user.findUnique({ where: { id: id } })
                if (!user) return res.status(400).send('user does not exist')

                const passwordHash = await bcrypt.hash(password, 10)
                const updateUser = await tx.user.update({
                    where: { id: id },
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        address: address

                    }
                })



                if (roleId === 1) {
                    //updated user can be parent or teacher or student users
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
                else if (roleId === 2) {
                    const userFind = await prisma.user.findUnique({ where: { id: id } })
                    if (!userFind) throw new Error("user does not exist")
                    const parent = await tx.parent.upsert({
                        where:
                            { userId: userFind.id },
                        update: {
                            occupation: occupation
                        },
                        create: {
                            userId: userFind.id,
                            occupation: occupation
                        }
                    })




                    for (const child of children) {
                        //adding student user
                        const passwordHash = await bcrypt.hash(child.password, 10)
                        const childrenUser = await tx.user.upsert({
                            where: {
                                id: child.childUserId
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
                            where: { userId: childrenUser.id },
                            update: {
                                classId: class_id,
                                rollNo: roll_no
                            },
                            create: {
                                rollNo: child.roll_no,
                                userId: childrenUser.id,
                                classId: child.class_id,
                                parentId: parent.id
                            }
                        })

                    }
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
                    const test = await tx.teacherClasses.findFirst({
                        where: {
                            teacherId: teacher.id
                        }
                    })
                    console.log(test)
                    return res.status(201).json({ message: "teacher updated successfully" })
                }
            }

            else {
                //create user
                //user/parent/teacher added 

                const user = await tx.user.findUnique({ where: { email: email } })
                if (user) return res.status(400).send('user already exists')


                const passwordHash = await bcrypt.hash(password, 10)
                const newUser = await tx.user.create({
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        role: roleId,
                        password: passwordHash,
                        address: address
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                })


                if (newUser.role === 2) {
                    //parent user added now add parent to parent table and add its children

                    const newParent = await tx.parent.create({
                        data: {
                            userId: newUser.id,
                            occupation: occupation
                        }
                    })

                    for (const child of children) {
                        //adding student user
                        const passwordHash = await bcrypt.hash(child.password, 10)
                        const childrenUser = await tx.user.create({
                            data: {
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

                        const newStudent = await tx.student.create({
                            data: {
                                rollNo: child.roll_no,
                                userId: childrenUser.id,
                                classId: child.class_id,
                                parentId: newParent.id
                            },
                            select: {
                                rollNo: true
                            }
                        })

                    }

                    return res.status(201).send(`student and its parent with roll no created successfully`)
                }

                if (newUser.role == 3) {
                    //add 
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
                                    classId: tcr.class_id,
                                    teacherId: newTeacher.id
                                }
                            })
                            await tx.teacherClassesSubject.createMany({
                                data: tcr?.subjects.map(sub => ({ teacherClassId: TrClassId.id, subjectId: sub }))
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

export const getUsers = async (req, res) => {
    try {
        await prisma.$transaction(async (tx) => {
            const users = await tx.user.findMany({
                where: {
                    role: {
                        in: [1, 3]
                    },
                    teacher: {
                        teaherClasses: {
                            some: {
                                isActive: true
                            },


                        },

                    }
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true,
                    address: true,
                    student: {
                        select: {
                            rollNo: true,
                            class: {
                                select: {
                                    className: true
                                }
                            },
                            parent: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            first_name: true,
                                            last_name: true,
                                            email: true,
                                        }
                                    },
                                    occupation: true
                                }
                            }
                        }
                    },
                    teacher: {
                        select: {
                            teaherClasses: {
                                select: {
                                    classes: {
                                        select: {
                                            id: true,
                                            className: true,

                                        }
                                    },
                                    teacherClassSubject: {
                                        select: {
                                            subjects: {
                                                select: {
                                                    id: true,
                                                    subjectName: true,

                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }



            })

            return res.status(201).json({
                users
            })
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}
