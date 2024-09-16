import { atom } from "recoil";

const globalErrorAtom = atom({
    key: 'globalErrorAtom',
    default: false
})

export default globalErrorAtom