import {prisma} from "../../lib/prisma.js"

export const addRole=async(req,res)=>{
    const{id,role}=req.body
    try {
        if(id){
            const updateRole=await prisma.role.update({
                where:{
                    id:id
                },
                data:{
                    role:role
                }
            })
             return res.status(201).json({ message: "role updated successfully" })
        }
        else{
              const newRole=await prisma.role.create({
               
                data:{
                    role:role
                }
            })
             return res.status(201).json({ message: "role added successfully" })
        }
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
export const getRoles=async(req,res)=>{
    
    try {
        const roles= await prisma.role.findMany({
            
        })
        return res.status(201).json({roles})
    } catch (error) {
          return res.status(500).json({ msg: error.message })
    }
}