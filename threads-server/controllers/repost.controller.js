import Post from '../models/post.model.js';
import Repost from "../models/repost.model.js";
import User from '../models/user.model.js';

const repostPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;


        const existingRepost = await Repost.findOne({ user: userId, post: postId });
        if (existingRepost) {
            return res.status(400).json({ error: 'You have already reposted this post' });
        }

        const post = await Post.findById(postId)
        if (!post) {
            await Repost.deleteOne({ _id: existingRepost._id });
            return res.status(400).json({ error: 'Post does not exist' })
        }

        // Create a new repost
        const repost = new Repost({ user: userId, post: postId });
        await repost.save();

        res.status(200).json({ message: 'Post reposted successfully', repost, post });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const getUserReposts = async (req, res) => {
    try {

        const { username } = req.params;

        const user = await User.findOne({ username }).select("-password")

        if (!user) return res.status(400).json({ message: "User not found" });


        const reposts = await Repost.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate('post')
            .exec();

        if (!reposts || reposts.length === 0) {
            return res.status(404).json({ error: 'No reposts found for this user' });
        }

        res.status(200).json(reposts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const removeRepost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        // Find the repost by user and post
        const repost = await Repost.findOne({ user: userId, post: postId });

        if (!repost) {
            return res.status(404).json({ error: 'Repost not found' });
        }

        const post = await Post.findById(postId)
        if (!post) {
            await Repost.deleteOne({ _id: repost._id });
            return res.status(400).json({ error: 'Post does not exist' })
        }

        // Remove the repost
        await Repost.deleteOne({ _id: repost._id });

        res.status(200).json({ message: 'Repost removed successfully' });
    } catch (error) {
        console.log("error in removeRepost", error.message)
    }
}






export { repostPost, getUserReposts, removeRepost }; 