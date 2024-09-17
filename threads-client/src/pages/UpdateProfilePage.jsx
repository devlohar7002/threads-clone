import React, { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import { FaPlus } from "react-icons/fa";
import { Textarea, FileInput, Label } from 'flowbite-react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../hooks/usePreviewImage';
import useShowToast from '../hooks/useShowToast';
import ToastComponent from '../components/ToastComponent';
import axios from 'axios';
import isNonAcrollableAtom from '../atoms/isNonScrollableAtom';
import { Spinner } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi";

function UpdateProfilePage() {
    const [inputsChange, setInputsChange] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [user, setUser] = useRecoilState(userAtom)
    const [updating, setUpdating] = useState(false)

    const setIsNonScrollable = useSetRecoilState(isNonAcrollableAtom)

    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        bio: user.bio,
        password: "",
        email: user.email,
        profilePic: user.profilePic
    })

    useEffect(() => {
        setIsNonScrollable(true)
        return () => {
            setIsNonScrollable(false);
        };
    }, [])

    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

    useEffect(() => {
        if (imgUrl) {
            setInputs(prev => ({ ...prev, profilePic: imgUrl }));
        }
    }, [imgUrl]);

    const handleFileChange = (event) => {
        handleImageChange(event)
        event.target.value = null;
    };

    useEffect(() => {
        const inputsHaveChanged = checkForChanges(inputs, user);
        setInputsChange(inputsHaveChanged);
    }, [inputs]);

    const { toast, showToast } = useShowToast();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setUpdating(true)
            const response = await axios.put(`/api/users/update/${user._id}`, inputs);

            if (response.data.error) {
                showToast(true, response.data.error)
            }

            localStorage.setItem("user", JSON.stringify(response.data.user))
            setUser(response.data.user)
            showToast(false, response.data.message)
            setInputsChange(false)

        } catch (error) {
            if (error?.response?.data?.error) {
                showToast(true, error.response.data.error)
            } else {
                showToast(true, "Something went wrong")
            }
            console.error('Signin error:', error);
        } finally {
            setUpdating(false)
        }
    };

    return (
        <div className='flex flex-col gap-1'>
            <div className='flex justify-start '>
                <Link to="/" className='bg-white dark:bg-[#111114] shadow-md border dark:border-zinc-800 rounded-full p-1'>
                    <BiArrowBack className='w-4 h-4' />
                </Link></div>

            <div className="flex flex-col justify-center items-center gap-1 border  max-w-sm w-[350px] md:w-[400px] bg-white rounded-lg shadow-lg dark:shadow-zinc-950 dark:border md:mt-0 sm:max-w-md p-6 dark:bg-zinc-900 dark:border-zinc-900">
                <div className="flex flex-col justify-center items-center gap-1">
                    <img className="rounded-full w-24 h-24 shadow-sm shadow-zinc-400 dark:shadow-zinc-800 object-cover" src={imgUrl || user.profilePic || '/default-avatar.jpg'} />
                    <Text className='font-bold'>{user.name}</Text>
                </div>

                <form onSubmit={handleFormSubmit} className='w-full'>
                    <div className='w-full flex flex-col gap-2 mt-4'>
                        <div className='w-full'>
                            <input onChange={(e) => {
                                setInputs({ ...inputs, name: e.target.value });
                                setInputsChange(true)
                            }} value={inputs.name} type="text" name="name" id="name" className=" bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" placeholder="Name" required="" />
                        </div>

                        <div className='w-full'>
                            <input onChange={(e) => {
                                setInputs({ ...inputs, username: e.target.value })
                                setInputsChange(true)
                            }} value={inputs.username} type="text" name="username" id="username" className="bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" placeholder="Username" required="" />
                        </div>

                        <div>
                            <input value={inputs.email} disabled type="email" name="email" id="email"
                                className="bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-800 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                                placeholder="name@gmail.com" required="" />
                        </div>


                        <Textarea onChange={(e) => {
                            setInputs({ ...inputs, bio: e.target.value })
                            setInputsChange(true)
                        }} value={inputs.bio} id="bio" placeholder="Update bio" rows={2} className="bg-zinc-50 border resize-none border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" />

                        <div>
                            <input onChange={(e) => {
                                setInputs({ ...inputs, password: e.target.value })
                                setInputsChange(true)
                            }} value={inputs.password} type="password" name="password" id="password" placeholder="New Password" className="bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" required="" />
                        </div>


                        <div className='flex flex-col gap-2'>
                            <label htmlFor="file-upload" className="flex flex-row items-center gap-2 bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700 dark:focus:border-zinc-700 cursor-pointer">
                                <FaPlus />
                                <span>Select Profile Image</span>
                                <input id="file-upload" type="file" name="file" className="hidden" onChange={(e) => {
                                    handleFileChange(e)
                                    setInputsChange(true)
                                }} accept="image/*" />
                            </label>

                        </div>



                        <button
                            className={`w-full flex justify-center items-center text-white bg-zinc-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                            ${!inputsChange || updating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-950 dark:text-black dark:bg-zinc-300 dark:hover:bg-zinc-200'}`}
                            disabled={!inputsChange || updating}
                        >
                            {updating ?
                                <div className='flex justify-center items-center gap-2'><Spinner />
                                    <div>Uploading</div>
                                </div>
                                : <span>Upload</span>}
                        </button>
                    </div>
                </form>

            </div>

        </div>

    );
}

export default UpdateProfilePage;

function checkForChanges(currentInputs, originalUser) {
    return currentInputs.name !== originalUser.name ||
        currentInputs.username !== originalUser.username ||
        currentInputs.bio !== originalUser.bio ||
        currentInputs.password.length > 0 || // Assuming password is initially empty and only checked if filled
        currentInputs.profilePic !== originalUser.profilePic;
}