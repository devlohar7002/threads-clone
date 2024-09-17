import React, { useState } from 'react'
import { Text, Flex } from '@radix-ui/themes'
import Actions from './Actions'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import formatPostDate from '@/lib/formatPostDate'
import { Link } from 'react-router-dom'


function Comment({ reply }) {

    const [currentReply, setCurrentReply] = useState()
    const [postedByUser, setPostedByUser] = useState("")




    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${reply}`)

                setCurrentReply(response.data)
                if (response.data) {
                    const res = await axios.get(`/api/users/profile/${response.data.postedBy}`);
                    setPostedByUser(res.data);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchPost()

    }, [reply])

    // useEffect(() => {
    //     if (currentReply) {
    //         const fetchUser = async () => {
    //             try {
    //                 const response = await axios.get(`/api/users/profile/${currentReply.postedBy}`);
    //                 console.log('User data:', response.data);
    //                 console.log(currentReply._id)
    //                 setPostedByUser(response.data);
    //             } catch (error) {
    //                 console.error('Error fetching user:', error.message);
    //             }
    //         };

    //         fetchUser();
    //     }
    // }, [currentReply]);

    const navigate = useNavigate()

    const handlePostClick = () => {
        try {
            navigate(`/${postedByUser.username}/post/${currentReply._id}`)
        } catch (error) {
            console.log(error.message)
        }
    }

    if (!postedByUser || !currentReply) return null
    return (
        <>
            <div className="flex flex-row p-6 gap-4 border-b-[1px] border-zinc-200 dark:border-zinc-800">
                {/* <Avatar img="/zuck-avatar.png" alt="avatar of Jese" rounded /> */}
                <Link to={'/' + postedByUser.username}>
                    <div className='flex justify-center min-w-11'>
                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" src={`${postedByUser?.profilePic}` || '/default-avatar.jpg'} alt="" />
                    </div>
                </Link>


                <div className='flex flex-col'>
                    <div className="flex felx-row text-zinc gap-1 items-center">
                        <Link to={'/' + postedByUser.username}>
                            <span className="font-semibold hover:underline">{postedByUser.username}</span>
                        </Link>
                        <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                        <span className="text-zinc-400 mx-2 text-sm">{formatPostDate(currentReply.createdAt)}</span>
                    </div>
                    <div className='break-all whitespace-normal w-full cursor-pointer' onClick={handlePostClick}>
                        {currentReply.text}
                    </div>

                    <div className='py-[10px] mx-[-6px]'>
                        <Actions post={currentReply} />
                    </div>
                </div>
            </div >
        </>
    )
}

export default Comment