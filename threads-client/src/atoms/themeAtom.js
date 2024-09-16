import { atom } from "recoil";

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme)
    return savedTheme || 'dark';
};

const themeAtom = atom({
    key: 'themeAtom',
    default: getInitialTheme()
})

export default themeAtom