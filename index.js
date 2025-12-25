import express from "express"
const app=express()
import { configDotenv } from "dotenv"
configDotenv()
const port=process.env.PORT


app.listen(port,()=>{
    console.log('listening to port '+port)
})