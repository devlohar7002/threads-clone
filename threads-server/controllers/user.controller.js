import User from '../models/user.model.js';
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const signupUser = async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) return res.status(400).json({ error: "All fields are mandatory" })

        if (password.length < 6) return res.status(400).json({ error: "Password should be minimum 6 characters" })

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) return res.status(400).json({ error: "Email is not valid" })

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(409).json({
                error: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        })

        await newUser.save()

        if (newUser) {

            generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({
                error: "Invalid user data"
            })
        }

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
        console.log("Error in signupUser", err.message)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: "Invalid password"
            })
        }



        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        })


    } catch (err) {
        res.status(500).json({
            error: err.message
        })
        console.log("Error in loginUser", err.message)
    }
}

const logoutUser = (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
        console.log("Error in logoutUser", err.message)
    }
}

const followUnfollowUser = async (req, res, next) => {
    let session;

    try {
        session = await mongoose.startSession();  // Start a session
        session.startTransaction();  // Start a transaction
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id == req.user._id) {
            return res.status(400).json({ error: "You cannot follow/unfollow youself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing === true) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
        }

        await session.commitTransaction();  // Commit the transaction

        res.status(200).json({ message: "Follow/Unfollow successfull" })

    } catch (err) {
        if (session) {
            await session.abortTransaction();  // Abort the transaction on error
        }

        session.endSession();
        res.status(500).json({
            error: err.message
        })
        console.log("Error in followUnfollowUser", err.message)
    } finally {
        if (session) {
            session.endSession();  // Always end the session
        }
    }
}

const updateUser = async (req, res, next) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);

        if (!user) return res.status(400).json({ error: "user not found" })


        const isPasswordSame = await bcrypt.compare(password, user.password);


        if ((name === user.name && username === user.username && (isPasswordSame || !password) && bio === user.bio && (!profilePic || profilePic === user.profilePic))) {
            return res.status(400).json({ error: "Nothing to update" });
        }


        if (req.params.id !== userId.toString()) {
            return res.status(400).json({ error: "Not allowed to update profile of other users" })
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword
        }

        if (password && password.length < 6) {
            return res.status(400).json({ error: "Minimum password length is 6" })
        }

        if (profilePic && profilePic !== user.profilePic) {

            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0])
                    .catch(console.log("Not found on web"))
            }

            const uploadResult = await cloudinary.uploader
                .upload(
                    profilePic
                )
            profilePic = uploadResult.secure_url;
        }



        user.name = name || user.name
        user.email = email || user.email
        user.profilePic = profilePic || user.profilePic
        user.username = username || user.username
        user.bio = bio

        user = await user.save()
        user.password = null;

        res.status(200).json({
            message: "Profile updated successfully", user
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getUserProfile = async (req, res) => {
    // We will fetch user profile either with username or userId
    // query is either username or userId
    const { query } = req.params;

    try {
        let user;

        // query is userId
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            // query is username
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }

        if (!user) return res.status(404).json({ error: "User not found" });


        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getUserProfile: ", err.message);
    }
};

const randomUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(currentUserId) }, // Exclude current user
                },
            },
            { $sample: { size: 5 } },
        ]);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, randomUser };