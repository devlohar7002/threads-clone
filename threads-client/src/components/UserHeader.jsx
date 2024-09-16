import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Text, Flex, DropdownMenu } from "@radix-ui/themes";
import { Modal, Button } from "flowbite-react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import ToastComponent from "./ToastComponent";
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from '@radix-ui/themes';

export default function UserHeader({ user }) {
    const currentUser = useRecoilValue(userAtom);
    const { username } = useParams();
    const { toast, showToast } = useShowToast();
    const [openModal, setOpenModal] = useState(false);
    const [following, setFollowing] = useState(user.followers.includes(currentUser._id))
    const [updating, setUpdating] = useState(false)

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL);
        showToast(false, "Link Copied");
    };

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast(true, "Please login to follow")
            return
        }
        setUpdating(true)
        try {
            const response = await axios.post(`/api/users/follow/${user._id}`)

            if (following) {
                showToast(false, `Unfollwed ${user.username}`);
                user.followers.pop()
            } else {
                showToast(false, `Follwed ${user.username}`);
                user.followers.push(currentUser._id)
            }
            setFollowing((prev) => !prev)
        } catch (error) {
            showToast(true, error.message);
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col gap-1'>
                        <div className="text-2xl font-bold">{user?.name}</div>
                        <div>{user?.username}</div>
                    </div>

                    <button onClick={() => setOpenModal(true)} className="flex justify-center items-center">
                        <img className="rounded-full w-14 h-14 object-cover" src={`${user?.profilePic || '/default-avatar.jpg'}`} alt="Avatar" />
                    </button>
                </div>
                <div className='mt-4'>{user?.bio}</div>

                <Flex justify="between" align="center" className="text-zinc-400">
                    <Flex gap="2" justify="between" align="center" maxWidth={"80%"}>

                        <Text wrap="nowrap">{user?.followers?.length || 0} followers</Text>
                        <div className="bg-zinc-400 w-[3px] h-[3px] rounded-full">
                        </div>

                        {/* <Text truncate className="hover:underline cursor-pointer">
                            instagram.com
                        </Text> */}
                        <Text wrap="nowrap">{user?.following?.length || 0} following</Text>

                    </Flex>

                    <Flex>
                        <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                            <BsInstagram className="w-6 h-6 text-black dark:text-white cursor-pointer" />
                        </div>
                        {currentUser._id !== user._id &&
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                        <CgMoreO className="w-6 h-6 text-black dark:text-white cursor-pointer" />
                                    </div>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content >
                                    <DropdownMenu.Item className="bg-dropdown" onClick={copyURL}>Copy Link</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        }
                    </Flex>

                </Flex>

                {currentUser._id === user._id &&
                    <div className='flex justify-between items-center text-center w-full gap-4 '>
                        <Link to={'/update'} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Edit Profile</Link>
                        <button onClick={copyURL} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Share Profile</button>
                    </div>
                }

                {currentUser._id !== user._id &&
                    <div className='flex justify-between items-center text-center w-full gap-4 '>
                        {!following ? <button disabled={updating} onClick={handleFollowUnfollow} className='flex items-center justify-center gap-2 border w-full text-sm font-semibold  bg-zinc-800 text-white dark:bg-zinc-50 dark:text-black rounded-xl py-[6px]'>
                            {updating ? <Spinner /> : <span>Follow</span>}

                        </button>
                            : <button disabled={updating} onClick={handleFollowUnfollow} className='flex items-center justify-center border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>
                                {updating ? <Spinner /> : <span>Following</span>}
                            </button>
                        }
                        <button onClick={copyURL} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Share Profile</button>
                    </div>
                }

            </div>
            <div className="grid grid-cols-2 justify-center text-center items-center font-[450]">
                <NavLink
                    to={`/${username}`}
                    className={({ isActive }) =>
                        isActive ? 'text-zinc-900 border-b pb-4 border-zinc-900 dark:text-white dark:border-white' : 'text-zinc-400 border-b pb-4  dark:border-zinc-800'
                    }
                    end
                >
                    Threads
                </NavLink>
                <NavLink
                    to={`/${username}/replies`}
                    className={({ isActive }) =>
                        isActive ? 'text-zinc-900 border-b pb-4 border-zinc-900 dark:text-white dark:border-white' : 'text-zinc-400 border-b pb-4  dark:border-zinc-800'
                    }
                >
                    Replies
                </NavLink>

                {toast.show && <ToastComponent error={toast.errorStatus} message={toast.message} />}
            </div>

        </div>
    );
}
