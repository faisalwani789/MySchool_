import jwt from 'jsonwebtoken'
export const authMiddleware=async(req,res,next)=>{
    const token= req.headers['authorization']
    if(!token) return res.send('please login')
    const decoded=jwt.verify(token,process.env.JWT_KEY)
    req.user=decoded
    // console.log(req.user)
    next()
}
export const authRole=(...roles)=>{
  return (req,res,next)=>{
  
    console.log("role"+req.user.role)
    if(!req.user|| !roles.includes(req.user.role)){
        
      return res.status(403).json({
        message:`forbidden`
      })
    }
    
    next()
  }
}