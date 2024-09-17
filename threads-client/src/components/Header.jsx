import { useState, useEffect } from "react"
import DarkModeButton from "./DarkModeButton"
import { useRecoilValue, useRecoilState } from "recoil"
import themeAtom from "../atoms/themeAtom"
import currentPageAtom from "../atoms/currentPageAtom"
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom"
import userAtom from "@/atoms/userAtom"

export default function Header() {
    const themeState = useRecoilValue(themeAtom)
    const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom)
    const [currentUser, setCurentUser] = useRecoilState(userAtom)

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        // Remove the user from localStorage on logout
        localStorage.removeItem("user");
        setCurrentPage("");
        setCurentUser(null)
        setTimeout(() => {
            navigate('/auth');
        }, 1000);
    }


    return (
        <>
            <div className="flex p-4 px-6 z-50 justify-between items-center w-full ">
                <Link to='/'>
                    <div className=" cursor-pointer">
                        <img className="w-[30px] " src={themeState === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} alt="Light Logo" />
                    </div>

                </Link>

                <div className="font-semibold">{currentPage}</div>
                {/* <DarkModeButton /> */}
                {user && <div>
                    <IoLogOutOutline onClick={handleLogout} className="w-[34px] h-[34px] cursor-pointer" />
                </div>}

            </div>
        </>
    )
}
