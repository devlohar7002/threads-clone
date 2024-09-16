import { atom } from "recoil";

const themeAtom = atom({
    key: 'themeAtom',
    default: 'dark'
})

export default themeAtom