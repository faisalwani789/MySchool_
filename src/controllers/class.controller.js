import { prisma } from "../../lib/prisma.js"
export const createClass = async (req, res) => {
    const { className ,id } = req.body
    console.log(id)
    try {
        if (req.body?.id) {
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
            return res.status(201).json({ msg: 'class updated  successfully' })
        }
        else {
            const checkClass = await prisma.class.findUnique({
                where: {
                    className: className
                }
            })
            if (checkClass) throw new Error('class already exists')
            const newClass = await prisma.class.create({
                data:{
                    className:className
                }
            })
            return res.status(201).json({ msg: 'classes added successfully' })
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}
export const getClasses = async (req, res) => {
     const{id}=req.body
      try {
        if(req.body.id){
             const getClass= await prisma.class.findUnique({
            where:{
                id:id
            }
        })
        return res.status(201).json({getClass})
        }
        const classes= await prisma.class.findMany({})
        return res.status(201).json({classes})
    } catch (error) {
          return res.status(500).json({ msg: error.message })
    }
}

