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
import { Container, Skeleton, Separator } from '@radix-ui/themes'
import PostSkeleton from './PostSkeleton'



function UserReplies({ post: post_ }) {
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

    const [parentPost, setParentPost] = useState()
    const [parentPostUser, setParentPostUser] = useState()

    useEffect(() => {

        const getParentPost = async () => {
            try {

                const response = await axios.get(`/api/posts/${post.replyTo}`)
                setParentPost(response.data)
                const res = await axios.get(`/api/users/profile/${response.data.postedBy}`)
                setParentPostUser(res.data)

            } catch (error) {
                showToast(true, error.message)
            }
        }
        getParentPost()
    }, [post])

    useEffect(() => {

        const getParentPost = async () => {
            try {
                const res = await axios.get(`/api/users/profile/${parentPost.postedBy}`)
                setParentPostUser(res.data)

            } catch (error) {
                showToast(true, error.message)
            }
        }
        getParentPost()
    }, [parentPost])

    const navigate = useNavigate()

    const handlePostClick = (user, post) => {
        try {

            // navigate(`/${postedByUser.username}/post/${post._id}`)
            navigate(`/${user.username}/post/${post._id}`)
        } catch (error) {

        }
    }

    if (!post || !parentPost) return null

    return (

        <div className="relative flex flex-row p-6 gap-4 border-b-[1px] border-zinc-200 dark:border-zinc-800 ">
            <div className='bg-zinc-200 dark:bg-zinc-700 left-[42px]'
                style={{
                    position: 'absolute',

                    top: 80,
                    bottom: 180,
                    width: '2px',

                }}
            ></div>

            {
                !post || !postedByUser || loading ?
                    <PostSkeleton />
                    :
                    <>
                        <div className='flex flex-col gap-4 justify-center w-full'>



                            <div className='flex gap-4 justify-between w-full'>
                                <Link to={currentUser.username !== parentPostUser?.username ? '/' + parentPostUser?.username : '#'}>
                                    <div className='flex justify-center min-w-11 cursor-pointer'>
                                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={parentPostUser?.profilePic || '/default-avatar.jpg'} alt="" />
                                    </div>
                                </Link>


                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-row text-zinc gap-2 items-center">

                                            <Link to={currentUser.username !== parentPostUser?.username ? '/' + parentPostUser?.username : '#'}>
                                                <div className='flex justify-center items-center gap-1 hover:underline'>
                                                    <span className="font-semibold">{parentPostUser?.username}</span>
                                                    <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                                                </div>
                                            </Link>


                                            <span className="text-zinc-400 mx-1 text-sm">{formatPostDate(parentPost?.createdAt)}</span>
                                        </div>

                                        {currentUser._id === parentPostUser?._id &&
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                                        <BsThreeDots className="w-4 h-4 text-black dark:text-white cursor-pointer" />
                                                    </div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item className="bg-dropdown" onClick={deletePost}>Delete</DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>}

                                    </div>

                                    <div className='break-all whitespace-normal' onClick={() => handlePostClick(parentPostUser, parentPost)}>
                                        {parentPost?.text}
                                    </div>

                                    {parentPost?.img && <Flex onClick={() => handlePostClick(parentPostUser, parentPost)}>
                                        <div className="max-h-96 overflow-hidden border-zinc-200 dark:border-zinc-800 my-2 rounded-lg flex justify-center items-center">
                                            <img className="max-w-full max-h-full object-scale-down" src={parentPost.img} alt="Post Content" />
                                        </div>
                                    </Flex>}


                                    <div className='py-[10px] mx-[-6px]'>
                                        <Actions post={parentPost} />
                                    </div>
                                </div>
                            </div>

                            {/* <Separator orientation="vertical" /> */}
                            {/* <div
                                className="h-full min-h-[1em] mx-[20px] w-[3px] bg-neutral-100 dark:bg-white/10">
                            </div> */}

                            <div className='flex gap-4 justify-between w-full'>
                                <Link to={currentUser.username !== postedByUser.username ? postedByUser.username : '#'}>
                                    <div className='flex justify-center min-w-11 cursor-pointer'>
                                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={postedByUser.profilePic || '/default-avatar.jpg'} alt="" />
                                    </div>
                                </Link>

                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-row text-zinc gap-2 items-center">

                                            <Link to={currentUser.username !== postedByUser.username ? postedByUser.username : '#'}>
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
                                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                                        <BsThreeDots className="w-4 h-4 text-black dark:text-white cursor-pointer" />
                                                    </div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item className="bg-dropdown" onClick={deletePost}>Delete</DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>}

                                    </div>

                                    <div className='break-all whitespace-normal' onClick={() => handlePostClick(postedByUser, post)}>
                                        {post.text}
                                    </div>

                                    {post.img && <Flex onClick={() => handlePostClick(postedByUser, post)}>
                                        <img className=" border-zinc-200 dark:border-zinc-800 my-2 rounded-lg" src={post.img} alt="" />
                                    </Flex>}


                                    <div className='py-[10px] mx-[-6px]'>
                                        <Actions post={post} />
                                    </div>
                                </div>
                            </div>



                        </div>



                        {/* <div className='flex flex-col w-full'>
                            <div className='flex gap-4 w-full'>
                                <Link to={currentUser.username !== parentPostUser?.username ? parentPostUser?.username : '#'}>
                                    <div className='flex justify-center min-w-11 cursor-pointer'>
                                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={parentPostUser?.profilePic || '/default-avatar.jpg'} alt="" />
                                    </div>
                                </Link>
                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-row text-zinc gap-2 items-center">
                                          
                                            <Link to={currentUser.username !== parentPostUser?.username ? parentPostUser?.username : '#'}>
                                                <div className='flex justify-center items-center gap-1 hover:underline'>
                                                    <span className="font-semibold">{parentPostUser?.username}</span>
                                                    <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                                                </div>
                                            </Link>


                                            <span className="text-zinc-400 mx-1 text-sm">{formatPostDate(parentPost?.createdAt)}</span>
                                        </div>

                                        {currentUser._id === parentPostUser?._id &&
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                                        <BsThreeDots className="w-4 h-4 text-black dark:text-white cursor-pointer" />
                                                    </div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item className="bg-dropdown" onClick={deletePost}>Delete</DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>}

                                    </div>

                                    <div className='break-all whitespace-normal' onClick={handlePostClick}>
                                        {parentPost?.text}
                                    </div>

                                    {parentPost?.img && <Flex onClick={handlePostClick}>
                                        <img className=" border-zinc-200 dark:border-zinc-800 my-2 rounded-lg" src={parentPost?.img} alt="" />
                                    </Flex>}


                                    <div className='py-[10px] mx-[-6px]'>
                                        <Actions post={parentPost} />
                                    </div>
                                </div>
                            </div>



                            <div className='flex gap-4 w-full'>
                                <Link to={currentUser.username !== postedByUser.username ? postedByUser.username : '#'}>
                                    <div className='flex justify-center min-w-11 cursor-pointer'>
                                        <img className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={postedByUser.profilePic || '/default-avatar.jpg'} alt="" />
                                    </div>
                                </Link><div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className="flex flex-row text-zinc gap-2 items-center">
                                           
                                            <Link to={currentUser.username !== postedByUser.username ? postedByUser.username : '#'}>
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
                                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                                        <BsThreeDots className="w-4 h-4 text-black dark:text-white cursor-pointer" />
                                                    </div>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item className="bg-dropdown" onClick={deletePost}>Delete</DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>}

                                    </div>

                                    <div className='break-all whitespace-normal' onClick={handlePostClick}>
                                        {post.text}
                                    </div>

                                    {post.img && <Flex onClick={handlePostClick}>
                                        <img className=" border-zinc-200 dark:border-zinc-800 my-2 rounded-lg" src={post.img} alt="" />
                                    </Flex>}


                                    <div className='py-[10px] mx-[-6px]'>
                                        <Actions post={post} />
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </>

            }


        </div>

    )
}

export default UserReplies
