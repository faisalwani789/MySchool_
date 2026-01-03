import bcrypt from 'bcrypt'
export const createParent = async (tx, newUser, parent) => {
    const Parent = await tx.parent.upsert({
        where: {
            userId: newUser.id || -1
        },
        update: {
            occupation: parent.occupation
        },
        create: {
            userId: newUser.id,
            occupation: parent.occupation,
            contact:parent.contact
        }
    })

    return Parent
}

export const createUser = async (tx, user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const User = await tx.user.upsert({
        where: {
            id: user.id || -1
        },
        update: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            address: user.address,
            password: passwordHash
        },
        create: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: passwordHash,
            address: user.address //same of student/user
        }
        
    })
    return User
}

export const assignRole = async (tx, userId, roleId) => {
     const roleUser= await tx.userRole.upsert({
        where: {
            userId_roleId:{
                userId,
                roleId
            }

        },
        update: {

        },
        create: {
            userId:userId,
            roleId: roleId
        }
    })
    return roleUser
}

export const addTeacherWithClasses = async (tx, classes, newUser,teacherBody) => {
    const teacher = await tx.teacher.upsert({
        where: { userId: newUser.id || -1 },
        update: {
              salary:teacherBody.salary,
            experiance:teacherBody.experiance
        },
        create: {
            userId: newUser.id,
            salary:teacherBody.salary,
            experiance:teacherBody.experiance
        }
    })

    if (newUser.id) {
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
        const classExists = await tx.class.findUnique({
            where: {
                id: tcr.class_id
            }
        })
        if (!classExists) throw new Error("class does not exist")
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
            const subjectExists = await tx.subject.findUnique({
                where: {
                    id: sub
                }
            })
            if (!subjectExists) throw new Error("subject does not exist")
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
}

export const upsertStudent = async (tx,userChildren,child,parentId) => {
    await tx.student.upsert({
        where: { userId: userChildren.id || -1 },
        update: {
            classId: child.class_id,
            rollNo: child.roll_no
        },
        create: {
            rollNo: child.roll_no,
            userId: userChildren.id,
            classId: child.class_id,
            parentId: parentId
        }
    })
}