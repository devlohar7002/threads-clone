import { atom } from 'recoil';

// Define an atom to hold the toast state
const toastAtom = atom({
    key: 'toastAtom', // unique ID for this atom
    default: null,    // initial value of the toast
});

export default toastAtom;
