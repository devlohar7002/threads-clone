import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userAtom from '../atoms/userAtom';
import { useState } from 'react';
import ToastComponent from './ToastComponent';
import UpdateProfilePage from '../pages/UpdateProfilePage';

function SignupCard() {
    const setAuthScreenState = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom)
    const { toast, showToast } = useShowToast();

    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/users/login', inputs);

            if (response.data.error) {
                showToast(true, response.data.error)
            }
            localStorage.setItem("user", JSON.stringify(response.data))
            setUser(response.data)

        } catch (error) {
            if (error?.response?.data?.error) {
                showToast(true, error.response.data.error)
            } else {
                showToast(true, "Something went wrong")
            }
            console.error('Signin error:', error);
        }
    };
    return (

        <div className="flex flex-col items-center justify-center w-[350px] md:w-[400px] p-4 ">

            <div className="w-full bg-white rounded-lg shadow-lg dark:shadow-zinc-950 border dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-900 dark:border-zinc-900">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Login
                    </h1>
                    <div className="space-y-4 md:space-y-6" >

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input onChange={(e) => setInputs({ ...inputs, username: e.target.value })} type="text" name="username" id="username" className="bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" placeholder="username" required="" />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={(e) => setInputs({ ...inputs, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-zinc-50 border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-zinc-300 focus:border-zinc-300 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" required="" />
                        </div>


                        <button onClick={handleFormSubmit} className="w-full text-white bg-zinc-800 hover:bg-zinc-950 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-black dark:bg-zinc-300 dark:hover:bg-zinc-200 ">Sign In</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Dont have an account? <button onClick={() => setAuthScreenState('signup')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Signup here</button>
                        </p>
                    </div>
                </div>
            </div>

            {(toast.show) && <ToastComponent error={toast.errorStatus} message={toast.message} />}
        </div>

    )
}

export default SignupCard