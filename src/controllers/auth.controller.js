import { prisma } from "../../lib/prisma.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
export const UserSignIn=async(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
        res.status(400).send("please enter valid details")
    }
    try {
         await prisma.$transaction(async (tx) => {
        const user= await tx.user.findUnique({where:{email:email}})
        if(!user) throw new Error("user not found")
    
        const userAuth= await bcrypt.compare(password,user.password)
 
        if(!userAuth)  return res.status(400).send("invalid credentials")
        const token= jwt.sign({email,id:user.id,name:user.first_name +user.last_name},process.env.JWT_KEY,{expiresIn:'24h'})
      res.status(200).json({message:'login successfull',token})

    })
    } catch (error) {
        res.status(400).send(Error.message)
    }
   
    
}