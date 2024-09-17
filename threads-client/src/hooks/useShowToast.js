import { useRecoilState } from 'recoil';
import toastAtom from '@/atoms/toastAtom';

function useShowToast() {
    const [toast, setToast] = useRecoilState(toastAtom);

    const showToast = (errorStatus, message) => {
        // Set the toast with the provided values
        setToast({ errorStatus, message });

        // Automatically hide the toast after a few seconds
        setTimeout(() => {
            // Reset the toast value to null after 3 seconds
            setToast(null);
        }, 3000); // 3 seconds
    };

    return { toast, showToast };
}

export default useShowToast;
