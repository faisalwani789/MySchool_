import { prisma } from "../../lib/prisma.js"
import bcrypt from 'bcrypt'
export const addUser = async (req, res) => {
    const { user, classes, parent } = req.body
    const { id, first_name, last_name, roleId, address, email, password } = user
    const { occupation, children } = parent
    let newUser

    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { email: email } })
            if (req.body?.user?.id ) {
                if (!user) throw new Error('user does not exist')
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
                if(newUser.role===4) return res.status(201).send('admin updated successfully')
            }
            else {

                if (user) return res.status(400).send('user already exists')

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
                if(newUser.role===4) return res.status(201).send('admin added successfully')
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

                if (children) {
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


                return res.status(201).send(`student and its parent  created successfully`)
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
                    const classExists= await tx.class.findUnique({
                        where:{
                            id:tcr.class_id
                        }
                    })
                    if(!classExists)throw new Error ("class does not exist")
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
                         const subjectExists= await tx.subject.findUnique({
                        where:{
                            id:sub
                        }
                    })
                    if(!subjectExists)throw new Error ("subject does not exist")
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

                return res.status(201).json({ message: "teacher created / updated successfully" ,success:true})
            }

        })

    } catch (error) {
        res.status(500).send(error.message)
    }
}
export const getUsers = async (req, res) => {

    let users
    try {
        const BaseQuery = {
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



        }
        const findOne = {
            id: req.body?.id,
            role: {
                in: [1, 2, 3, 4]
            },
            OR: [
                {
                    student: {
                          none: {},
                    }
                },
                {
                    teacher: {
                        teaherClasses: {
                            some: {
                                isActive: true
                            }
                        }
                    }
                }
            ]


        }
        await prisma.$transaction(async (tx) => {
            if (req.body?.id) {

                users = await tx.user.findUnique({
                    where: findOne,
                    ...BaseQuery
                })
            }
            else {
                users = await tx.user.findMany({
                    where: {
                        role: {
                            in: [1, 2, 3,4]
                        },
                        OR: [
                            {
                                student: {
                                    is:null
                                }
                            },
                            {
                                teacher:{
                                    is:null
                                }
                            },
                            {
                                teacher: {
                                    teaherClasses: {
                                        some: {
                                            isActive: true
                                        }
                                    }
                                }
                            }
                        ]

                    },
                    ...BaseQuery,
                    orderBy: {
                        createdAT: 'desc'
                    }


                })
            }


            return res.status(201).json({
                users
            })
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
