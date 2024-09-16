import { useState, useEffect } from "react"
import DarkModeButton from "./DarkModeButton"
import { useRecoilValue } from "recoil"
import themeAtom from "../atoms/themeAtom"
import currentPageAtom from "../atoms/currentPageAtom"

export default function Header() {
    const themeState = useRecoilValue(themeAtom)
    const currentPage = useRecoilValue(currentPageAtom)



    return (
        <>
            <div className="flex p-4 px-6 z-50 justify-between items-center w-full ">
                <img className="w-[34px] cursor-pointer" src={themeState === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} alt="Light Logo" />
                <div className="font-semibold">{currentPage}</div>
                <DarkModeButton />
            </div>
        </>
    )
}
