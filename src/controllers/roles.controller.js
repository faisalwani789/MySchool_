import { prisma } from "../../lib/prisma.js"

export const addRole = async (req, res) => {
    const { id, role } = req.body
    try {
        if (id) {
            const updateRole = await prisma.roles.update({
                where: {
                    id: id
                },
                data: {
                    role: role
                }
            })
            return res.status(201).json({ message: "role updated successfully" })
        }
        else {
            const roleExists= await prisma.roles.findFirst({where:{role:role}})
            if(roleExists)throw new Error('role already exists')
            const newRole = await prisma.roles.create({

                data: {
                    role: role
                }
            })
            return res.status(201).json({ message: "role added successfully" })
        }

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
export const getRoles = async (req, res) => {
    const { id } = req.body
    try {
        if (req.body.id) {
            const roles = await prisma.roles.findUnique({
                where: {
                    id: id
                }
            })
            return res.status(201).json({ roles })
        }
        else {
            const rolesList = await prisma.roles.findMany({})
            return res.status(201).json({ rolesList })
        }

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
