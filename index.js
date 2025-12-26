import express from "express"
import adminRoutes from './src/routes/admin.routes.js'
import userRoutes from './src/routes/user.router.js'
import authRoutes from './src/routes/auth.router.js'


const app=express()
import { configDotenv } from "dotenv"
configDotenv()
const port=process.env.PORT

app.use(express.json())
app.use('/users',userRoutes)
app.use('/signin',authRoutes)
app.use('/admin',adminRoutes)

app.listen(port,()=>{
    console.log('listening to port '+port)
})