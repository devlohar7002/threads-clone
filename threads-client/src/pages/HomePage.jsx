import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@radix-ui/themes'
import { Link } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import UserSkeleton from '../components/UserSkeleton';
import UserPost from '../components/UserPost';
import { Spinner } from '@radix-ui/themes';
import { Textarea } from 'flowbite-react';
import { IoImageOutline } from "react-icons/io5";
import ToastComponent from '../components/ToastComponent';
import usePreviewImage from '../hooks/usePreviewImage';
import currentPageAtom from '../atoms/currentPageAtom';
import { UserCrousel } from '../components/UserCrousel';
import newPostAtom from '../atoms/newPostAtom';
import { useCallback } from 'react';


function HomePage() {
    const currentUser = useRecoilValue(userAtom)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const { toast, showToast } = useShowToast()
    const modalRef = useRef(null);
    const textAreaRef = useRef(null);


    const [inputValue, setInputValue] = useState("");

    const [charCount, setCharCount] = useState(0);
    const [updating, setUpdating] = useState(false)



    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

    const handleFileChange = (event) => {
        handleImageChange(event);
        event.target.value = null;
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        if (newValue.length <= 500) {
            setInputValue(newValue);
            setCharCount(newValue.length);
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    const handleCancel = (event) => {
        event.target.value = null;
        event.target.files = [];
        setImgUrl(null)
        handleImageChange(event);
    };

    const newPost = useRecoilValue(newPostAtom)
    const setNewPost = useSetRecoilState(newPostAtom)

    const handleCreatePost = async () => {
        try {
            setUpdating(true)

            const response = await axios.post('api/posts/create', {
                postedBy: currentUser._id,
                text: inputValue,
                img: imgUrl
            })
            setInputValue("")
            setImgUrl(null)
            modalRef.current.close();
            showToast(false, "Post created successfully!");
        } catch (error) {
            showToast(true, error.message)
        } finally {
            setUpdating(false)
        }
    }

    const [lastCreatedAt, setLastCreatedAt] = useState(null);

    const observer = useRef();
    const lastPostRef = useRef();

    const lastPostObserver = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {

                    getFeedPosts(); // Fetch new posts when the last post is visible
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading] // Dependency on loading state
    );

    const [hasMorePosts, setHasMorePosts] = useState(true);


    const getFeedPosts = async () => {
        if (!hasMorePosts || loading) return;

        setLoading(true)
        try {
            const response = await axios.get('/api/posts/post/feed', {
                params: {
                    lastCreatedAt: lastCreatedAt // Send the last createdAt timestamp for pagination
                }
            })

            setLastCreatedAt(response.data.lastCreatedAt);
            setHasMorePosts(response.data.hasMorePosts);

            if (lastPostRef.current) {
                lastPostRef.current.scrollIntoView({ behavior: 'smooth' });
            }


            if (newPost) {
                setPosts((prevPosts) => [newPost, ...prevPosts, ...response.data.feedPosts]);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...response.data.feedPosts]);
            }


        } catch (error) {
            showToast(true, error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        getFeedPosts()
        // return () => {
        //     setNewPost(null);
        // };
    }, [newPost])


    const setCurrentPage = useSetRecoilState(currentPageAtom)

    useEffect(() => {
        setCurrentPage('Home')
    }, [setCurrentPage])

    // if (loading) {
    //     return (
    //         <div className=''>
    //             <UserSkeleton />
    //         </div>)
    // }

    // if (posts.length === 0) {
    //     return (
    //         <>
    //             <div className='flex justify-between items-center py-4 px-6 border-b dark:border-zinc-800 border-zinc-200'>
    //                 <div className='flex justify-center items-center gap-4 text-zinc-400 dark:text-zinc-500'>
    //                     <img className="rounded-full w-10 h-10 object-cover border dark:border-zinc-700" src={`${currentUser?.profilePic || 'default-avatar.jpg'}`} alt="Avatar" />

    //                     <button onClick={() => {
    //                         document.getElementById('my_modal_2').showModal()

    //                     }}>What's new?</button>
    //                 </div>

    //                 <button onClick={() => {
    //                     document.getElementById('my_modal_2').showModal()

    //                 }} className='border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm'>

    //                     <span>Post</span>
    //                 </button>
    //             </div>

    //             <div className='p-6 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500'>
    //                 <div>Your feed looks empty</div>
    //                 <div>Please follow users to see posts</div>
    //             </div >

    //             {/* <div className='px-20 md:p-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500'>
    //                 <UserCrousel />
    //             </div > */}

    //         </>
    //     )
    // }
    return (
        <>
            <div className='flex justify-between items-center py-4 px-6 border-b dark:border-zinc-800 border-zinc-200 w-full'>
                <div className='flex justify-center items-center gap-4 text-zinc-400 dark:text-zinc-500 w-full'>
                    <img className="rounded-full w-10 h-10 object-cover border dark:border-zinc-700" src={`${currentUser?.profilePic || 'default-avatar.jpg'}`} alt="Avatar" />

                    <button onClick={() => {
                        document.getElementById('my_modal_2').showModal()

                    }}>What's new?</button>
                </div>

                <button onClick={() => {
                    document.getElementById('my_modal_2').showModal()

                }} className='border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm'>

                    <span>Post</span>
                </button>
            </div>
            {/* {posts.map((post, index) => (
                <UserPost key={post._id} post={post} />
            ))} */}

            {posts.map((post, index) => {
                if (index + 1 === posts.length) {
                    return (
                        <div ref={lastPostObserver} key={post._id}>
                            <UserPost post={post} />
                        </div>
                    );
                } else {
                    return (
                        <div ref={index === posts.length - 2 ? lastPostRef : null} key={post._id}>
                            <UserPost post={post} />
                        </div>
                    );
                }
            })}

            {loading &&
                <div className=''>
                    <UserSkeleton />
                </div>}

            <dialog id="my_modal_2" ref={modalRef} className="modal z-10 shadow-lg bg-zinc-950 bg-opacity-85">
                <div className="modal-box bg-zinc-50 border dark:bg-neutral-900 dark:border-zinc-800" >
                    <div className="flex flex-row gap-2 border-zinc-200 dark:border-zinc-800">

                        <div className='flex flex-col gap-2 w-full'>
                            <div className="flex felx-row text-zinc gap-1 items-center">
                                <img className="w-10 h-10 mr-2 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" src={currentUser.profilePic || 'default-avatar.jpg'} alt="" />

                                <span className="font-semibold">{currentUser.username}</span>
                                <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                            </div>
                            <Textarea ref={textAreaRef} onChange={handleInputChange} value={inputValue} id="bio" placeholder="What's new?" rows={1} className="hide-scrollbar resize-none rounded-none bg-zinc-50 text-gray-900 text-sm border-0 focus:ring-0 block w-full p-0 dark:bg-neutral-900 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" />
                            {imgUrl && <div className="relative">
                                <img className="rounded-xl py-2 shadow-zinc-400 dark:shadow-zinc-800" src={imgUrl} alt="Display" />
                                <button onClick={(e) => { handleCancel(e) }} className="absolute top-2 right-0 m-2 rounded-full bg-zinc-700 bg-opacity-60 h-6 w-6 p-[5px]  text-zinc-700" aria-label="Remove image">

                                    <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                                </button>
                            </div>}
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <IoImageOutline className='text-zinc-400 dark:text-zinc-500 hover:text-zinc-500 dark:hover:text-zinc-400' />
                                <input id="file-upload" type="file" name="file" className="hidden" onChange={(e) => { handleFileChange(e); }} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div className='flex gap-2 justify-end items-center'>
                        <div className="text-[11px] text-zinc-400">{charCount}/500</div>
                        <button disabled={updating || (!imgUrl && !inputValue)} onClick={handleCreatePost} className={updating || (!imgUrl && !inputValue) ? 'opacity-50 cursor-not-allowed border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm' : 'border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm'}>
                            {updating ?
                                <div className='flex justify-center items-center gap-2'><Spinner />
                                    <div>Posting</div>
                                </div>
                                : <span>Post</span>}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
                {(toast.show) && <ToastComponent error={toast.errorStatus} message={toast.message} />}
            </dialog>
            {toast.show && <ToastComponent error={toast.errorStatus} message={toast.message} />}

        </>
    )
}

export default HomePage