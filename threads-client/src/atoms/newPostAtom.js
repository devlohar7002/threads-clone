import { atom } from "recoil";

const newPostAtom = atom({
    key: 'newPostAtom',
    default: null
})

export default newPostAtom