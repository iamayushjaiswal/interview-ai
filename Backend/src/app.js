const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Simple request logger
app.use((req, res, next) => {
    console.log(`[Backend] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
})
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175"
]

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""))
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        const cleanOrigin = origin.replace(/\/$/, "")
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        if (cleanOrigin.startsWith("http://localhost:") || cleanOrigin.startsWith("http://127.0.0.1:")) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

// Root health check route for Render
app.get("/", (req, res) => {
    res.status(200).json({ message: "Interview AI Backend API is running successfully!" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app