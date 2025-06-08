import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// CORS configuration
const corsOptions = {
  origin: [
    'https://prescripto-sand-xi.vercel.app',  // Frontend
    'https://prescripto-cwh4.vercel.app',     // Admin
    'http://localhost:5173',                  // Frontend local
    'http://localhost:5174'                   // Admin local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'aToken', 'dToken'],
  credentials: true,
  optionsSuccessStatus: 204
}

// middlewares
app.use(express.json())
app.use(cors(corsOptions))

// Handle preflight requests
app.options('*', cors(corsOptions))

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))