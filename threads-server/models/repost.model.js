import mongoose from "mongoose";

const repostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
}, {
    timestamps: true
})

const Repost = mongoose.model('Repost', repostSchema);
export default Repost;