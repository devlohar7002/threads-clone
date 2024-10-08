import User from "../models/user.model.js";
import Post from '../models/post.model.js';
import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose";

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body
        if (!postedBy || !text) {
            return res.status(400).json({ message: "PostedBy and text fields are required" })
        }

        const user = await User.findById(postedBy);

        if (!user) return res.status(400).json({ message: "User not found" });

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters` })
        }

        if (img) {
            const uploadResult = await cloudinary.uploader
                .upload(img)
            img = uploadResult.secure_url
        }

        const post = {
            postedBy,
            text,
            img
        }

        const newPost = new Post(post)
        await newPost.save()

        res.status(201).json({ message: "Post created successfully", newPost })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find the post to delete
        const post = await Post.findById(req.params.id).session(session);
        if (!post) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user is authorized to delete the post
        if (post.postedBy.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ error: "Unauthorized to delete post" });
        }

        // Remove the post's reference from the parent post's replies array
        if (post.replyTo) {
            const parentPost = await Post.findById(post.replyTo).session(session);
            if (parentPost) {
                parentPost.replies.pull(post._id);
                await parentPost.save({ session });
            }
        }

        // Handle replies to the post being deleted
        if (post.replies && post.replies.length > 0) {
            for (let replyId of post.replies) {
                await deletePostRecursively(replyId, session);
            }
        }

        // Delete any associated image from Cloudinary (outside transaction)
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(imgId);
            } catch (cloudinaryError) {
                // Log the error or handle it as needed
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
            }
        }

        // Delete the post
        await Post.findByIdAndDelete(req.params.id).session(session); // Triggers pre/post middleware if any

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        // Abort the transaction on error
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
    }
};


const deletePostRecursively = async (postId, session) => {
    const post = await Post.findById(postId).session(session);
    if (post) {
        // Recursively delete replies
        if (post.replies && post.replies.length > 0) {
            for (let replyId of post.replies) {
                await deletePostRecursively(replyId, session);
            }
        }

        // Remove reference from parent post if applicable
        if (post.replyTo) {
            const parentPost = await Post.findById(post.replyTo).session(session);
            if (parentPost) {
                parentPost.replies.pull(post._id);
                await parentPost.save({ session });
            }
        }

        // Delete any associated image from Cloudinary (outside transaction)
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(imgId);
            } catch (cloudinaryError) {
                // Log the error or handle it as needed
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
            }
        }

        // Delete the post
        await Post.findByIdAndDelete(postId).session(session);
    }
};

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // Like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// const replyToPost = async (req, res) => {
//     try {
//         const { text } = req.body;
//         const postId = req.params.id;
//         const userId = req.user._id;
//         const userProfilePic = req.user.profilePic;
//         const username = req.user.username;

//         if (!text) {
//             return res.status(400).json({ error: "Text field is required" });
//         }

//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ error: "Post not found" });
//         }

//         const reply = { userId, text, userProfilePic, username };

//         post.replies.push(reply);
//         await post.save();

//         res.status(200).json(reply);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

const replyToPost = async (req, res) => {
    try {
        // const postId = req.params.id;

        const { postedBy, text, postId } = req.body;

        console.log(postId)

        if (!postedBy || !text) {
            return res.status(400).json({ message: "PostedBy and text fields are required" })
        }

        const user = await User.findById(postedBy);

        if (!user) return res.status(400).json({ message: "User not found" });

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters` })
        }
        const parentPost = await Post.findById(postId);
        if (!parentPost) {
            return res.status(404).json({ message: 'Parent post not found.' });
        }


        const replyPost = new Post({
            postedBy: postedBy,
            text: text,
            replyTo: postId
        });

        await replyPost.save();

        parentPost.replies.push(replyPost._id);
        await parentPost.save();


        res.status(201).json({
            message: 'Reply posted successfully.',
            reply: replyPost,
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const getFeedPosts = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        if (feedPosts.length <= 10) {
            const posts = await Post.aggregate([
                {
                    $match: {
                        postedBy: { $ne: new mongoose.Types.ObjectId(userId) }, // Exclude current user
                    },
                },
                { $sample: { size: 10 } },
            ]).sort({ createdAt: -1 });

            feedPosts.push(...posts);
        }
        res.status(200).json(feedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



export { createPost, getPost, deletePost, getUserPosts, likeUnlikePost, replyToPost, getFeedPosts }; 