import path from "path";
import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import repostRoutes from "./routes/repost.route.js"
import { v2 as cloudinary } from "cloudinary"

dotenv.config();

connectDB();
const app = express()


const PORT = process.env.PORT || 8000;

const __dirname = path.resolve()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// app.use(express.json()); //allows to parse the incoming data from request body
// app.use(express.urlencoded({ extended: true }))

// For JSON
app.use(express.json({ limit: '50mb' }));  // Increase JSON body size

// For URL-encoded data
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/reposts", repostRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/threads-client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'threads-client', 'dist', 'index.html'))
    })
}


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))