import { prisma } from "../../lib/prisma.js"
export const createClass = async (req, res) => {
    const { id, classes,className } = req.body
    try {
        if (id) {
            //update
            const classExists = await prisma.class.findUnique({
                where: {
                    id: id
                }
            })
            if (!classExists) throw new Error('class does not exist')
            await prisma.class.update({
                where: {
                    id: id
                },
                data:{
                    className:className
                }
            })
            return res.status(201).json({ msg: 'class updated  successfully with subjects' })
        }
        else {
            const newClass = await prisma.class.createMany({
                data: classes
            })
            return res.status(201).json({ msg: 'classes added successfully with subjects', })
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}
export const getClasses = async (req, res) => {
      try {
        const classes= await prisma.class.findMany({
            
        })
        return res.status(201).json({classes})
    } catch (error) {
          return res.status(500).json({ msg: error.message })
    }
}