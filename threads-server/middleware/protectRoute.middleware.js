import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) return res.status(400).json({ message: "User not found" });

        req.user = user
        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        console.log("Error while authenticating", error.message)
    }
}

export default protectRoute;