import UserPost from '../components/UserPost'
import Comment from '../components/Comment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
export default function PostPage() {

    const [currentPost, setCurrentPost] = useState()

    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {

                const response = await axios(`/api/posts/${postId}`)
                setCurrentPost(response.data)

            } catch (error) {

            }
        }
        fetchPost()

        return (() => {
            setCurrentPost(null)
        })
    }, [postId])

    return (
        <>
            {currentPost ?
                <div>
                    <UserPost post={currentPost} />
                    <div>
                        <div className='mt-2 px-6 font-semibold'>Replies</div>
                        {currentPost.replies.map((reply, ind) => (
                            <Comment key={ind} reply={reply} />
                        ))}
                    </div>

                </div>
                : null
            }
        </>
    )
}