import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Carousel } from 'flowbite-react'
import { Text, Flex } from '@radix-ui/themes'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast';
import ToastComponent from './ToastComponent'
import axios from 'axios'
import userAtom from '@/atoms/userAtom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { DropdownMenu } from '@radix-ui/themes'
import { BsThreeDots } from "react-icons/bs";
import { Spinner } from '@radix-ui/themes'
import { Container, Skeleton } from '@radix-ui/themes'
import PostSkeleton from './PostSkeleton'
import { MdDeleteOutline } from "react-icons/md";
import enlagedImageAtom from '@/atoms/enlagedImageAtom'
import { useParams } from 'react-router-dom'



function UserRepost({ post: post_ }) {
    const [post, setPost] = useState(post_)
    function formatPostDate(createdAt) {
        const postDate = new Date(createdAt);
        const now = new Date();
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerWeek = msPerDay * 7;

        const elapsed = now - postDate;

        // Just now (less than 1 minute)
        if (elapsed < msPerMinute) {
            return 'just now';
        }

        // Less than 1 hour ago
        if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        // Same day check
        if (now.toDateString() === postDate.toDateString()) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }

        // Same week check
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday - (startOfToday.getDay() * msPerDay));
        const postStartOfDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());

        if (postStartOfDay >= startOfWeek) {
            const daysAgo = Math.floor(elapsed / msPerDay);
            return daysAgo + 1 + (daysAgo + 1 === 1 ? ' day ago' : ' days ago');
        }

        // Older than this week
        return postDate.toLocaleDateString('en-GB');  // Formats as dd/mm/yyyy
    }

    const { toast, showToast } = useShowToast();
    const [postedByUser, setPostedByUser] = useState("")
    const currentUser = useRecoilValue(userAtom)
    const [loading, setLoading] = useState(false)

    const { username } = useParams()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const setEnlargedImage = useSetRecoilState(enlagedImageAtom)
    const enlargedImage = useRecoilValue(enlagedImageAtom)

    const toggleImageModal = () => {
        setIsModalOpen(!isModalOpen);
        setEnlargedImage(!enlargedImage)
    }

    const deletePost = async () => {
        if (loading) return
        setLoading(true)
        try {
            const response = await axios.delete(`/api/posts/${post._id}`)
            console.log(response.data)
            showToast(false, "Post deleted")
            setPost(null)
        } catch (error) {
            showToast(true, error.message)
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {

        const getUser = async () => {
            try {

                const response = await axios.get(`/api/users/profile/${post.postedBy}`)

                setPostedByUser(response.data)
                setLiked(response.data.likes.includes(_id))
            } catch (error) {
                showToast(true, error.message)
            }
        }
        getUser()
    }, [post])

    const navigate = useNavigate()

    const handlePostClick = () => {
        try {

            // navigate(`/${postedByUser.username}/post/${post._id}`)
            navigate(`/${postedByUser.username}/post/${post._id}`)
        } catch (error) {

        }
    }

    if (!post) return null

    return (

        <div className="flex flex-row p-6 gap-4 border-b-[1px] border-zinc-200 dark:border-zinc-800 ">

            {
                !post || !postedByUser || loading ?
                    <PostSkeleton />
                    :
                    <>
                        <div className='flex flex-col gap-4 w-full'>
                            <div className='flex items-center gap-1 text-neutral-400 text-sm'>

                                <div className='mr-2'><RepostSVG /></div>
                                <div className='font-semibold'>{username} </div>
                                <div>reposted</div>
                            </div>
                            <div className='flex flex-row gap-4 w-full'>
                                <Link to={currentUser.username !== postedByUser.username ? `/${postedByUser.username}` : '#'}>
                                    <div className='flex justify-center min-w-11 cursor-pointer'>
                                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={postedByUser.profilePic || '/default-avatar.jpg'} alt="" />
                                    </div>
                                </Link><div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-row text-zinc gap-2 items-center">
                                            {/* <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" src="/zuck-avatar.png" alt="" /> */}
                                            <Link to={currentUser.username !== postedByUser.username ? `/${postedByUser.username}` : '#'}>
                                                <div className='flex justify-center items-center gap-1 hover:underline'>
                                                    <span className="font-semibold">{postedByUser.username}</span>
                                                    <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                                                </div>
                                            </Link>


                                            <span className="text-zinc-400 mx-1 text-sm">{formatPostDate(post.createdAt)}</span>
                                        </div>

                                        {currentUser._id === postedByUser._id &&
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full ">
                                                        <BsThreeDots className="w-4 h-4 text-black dark:text-white cursor-pointer" />
                                                    </div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item className="bg-dropdown text-red-400 hover:text-red-400" onClick={deletePost}>
                                                        <div className='flex justify-between items-center gap-6'>
                                                            <div>
                                                                Delete
                                                            </div>
                                                            <MdDeleteOutline />
                                                        </div>


                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>}

                                    </div>

                                    <div className='break-all whitespace-normal' onClick={handlePostClick}>
                                        {post.text}
                                    </div>

                                    {post.img && <Flex onClick={toggleImageModal}>
                                        <div onClick={toggleImageModal} className="max-h-96 overflow-hidden border-zinc-200 dark:border-zinc-800 my-2 rounded-lg flex justify-center items-center">
                                            <img className="max-w-full max-h-full object-scale-down" src={post.img} alt="Post Content" />
                                        </div>

                                        {/* <div class="flex justify-center items-center max-h-96 overflow-hidden border-zinc-200 dark:border-zinc-800 my-2 rounded-lg">
                                    <img className="min-w-full min-h-full object-contain " src={post.img} alt="Descriptive Alt Text" />
                                </div> */}

                                        {/* <img className=" border-zinc-200 dark:border-zinc-800 my-2 rounded-lg" src={post.img} alt="" /> */}
                                    </Flex>}

                                    {/* {isModalOpen && (
                                <div className="fixed inset-0 bg-black flex justify-center items-center" onClick={toggleImageModal}>
                                    <img src={post.img} alt="Enlarged post" className="max-w-full max-h-full" />
                                </div>
                            )} */}

                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-black  flex justify-center items-center" onClick={toggleImageModal} style={{ zIndex: 9999 }}>
                                            {/* <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();  // Prevent modal from closing when clicking the button
                                                toggleImageModal();
                                            }}
                                            className="absolute top-5 right-5 z-50 text-white p-2 rounded-md focus:outline-none "
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                        <img src={post.img} alt="Enlarged post" className="max-w-full max-h-full" />
                                    </div> */}

                                            <div className="relative flex justify-center items-center">
                                                <img
                                                    src={post.img}
                                                    alt="Enlarged post"
                                                    className="object-scale-down h-auto max-h-screen md:max-w-screen"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();  // Prevent modal from closing when clicking the button
                                                        toggleImageModal();
                                                    }}
                                                    className="absolute top-2 right-2 m-2 rounded-full bg-zinc-700 bg-opacity-60 p-1 text-white"
                                                    aria-label="Close image"
                                                    style={{ zIndex: 50 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                                        <path d="M18 6L6 18M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className='py-[10px] mx-[-6px]'>
                                        <Actions post={post} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

            }


        </div>

    )
}

const RepostSVG = () => {
    return (
        <svg
            aria-label='Repost'
            color='currentColor'
            fill='currentColor'
            height='18'
            role='img'
            viewBox='0 0 24 24'
            width='18'
        >
            <title>Repost</title>
            <path
                fill=''
                d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
            ></path>
        </svg>
    );
};

export default UserRepost
