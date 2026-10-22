import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import questionRoutes from './routes/question.js'
import dns from "node:dns";
import userroutes from './routes/auth.js'
import answerRoutes from './routes/answer.js'
dns.setServers(["8.8.8.8"]);
const app = express()
dotenv.config()
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
const corsOptions = {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
};
app.use(cors(corsOptions))
app.get('/', (req, res) => {
    res.send("Stak-Overflow Clone Working...")
})
app.use('/user', userroutes)
app.use('/question', questionRoutes)
app.use('/answer', answerRoutes)
const PORT = process.env.PORT || 5000
const databaseUrl = process.env.MONGO_URL

mongoose.connect(databaseUrl).then(
    () => {
        console.log("Mongo db connection Successfull")
        app.listen(PORT, () => { console.log(`Server running on Port ${PORT} `) })

    }).catch((err) => console.error(`MongoDb Connection Failed , Reason :: ${err.message} `))
