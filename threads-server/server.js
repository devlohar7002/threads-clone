import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import { v2 as cloudinary } from "cloudinary"

dotenv.config();

connectDB();
const app = express()


const PORT = process.env.PORT || 8000;

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


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))