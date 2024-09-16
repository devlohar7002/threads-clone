import { atom } from "recoil";

const currentPageAtom = atom({
    key: 'currentPageAtom',
    default: 'Home'
})

export default currentPageAtom