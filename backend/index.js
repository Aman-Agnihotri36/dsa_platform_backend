import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import connectDB from './utils/db.js'
// import cookieParser from 'cookie-parser'
import userRouter from './routes/user.route.js'


import path from 'path'
dotenv.config({})
const app = express()

// const corsOptions = {
//     origin: 'https://jobportel.onrender.com',  // Replace with your frontend's URL
//     credentials: true,  // Allow credentials (cookies, authentication headers)
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify the allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
// };

const _dirname = path.resolve()


// app.use(cors(corsOptions));
// app.use(cookieParser());
app.use(express.json())

// Many modern web applications send and receive data in JSON format. This middleware ensures that the JSON data is properly parsed and available in your route handlers.
app.use(express.urlencoded({ extended: true }))


// apis

app.use("/api/v1/user", userRouter)
// app.use("/api/v1/company", compayRoute)
// app.use("/api/v1/job", jobRouter)
// app.use("/api/v1/application", applicationRouter)

// app.use(express.static(path.join(_dirname, "/frontend/dist")))
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
// })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    // connectDB()
    console.log(`Server is running at port ${PORT}`)
})
