import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'

dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(()=> { 
        console.log('Connected success');
    })
    .catch((err)=>{
        console.log(err);
    })

const app = express()

app.listen(3003, ()=> {
    console.log('Server is runnig on port 3003');
})

app.use('/api/user', userRoutes)