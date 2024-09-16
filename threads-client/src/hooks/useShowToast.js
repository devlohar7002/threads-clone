import { useState } from 'react';

function useShowToast() {
    const [toast, setToast] = useState({ show: false, errorStatus: false, message: '' });

    const showToast = (errorStatus, message) => {
        setToast({ show: true, errorStatus, message });

        // Automatically hide the toast after a few seconds
        setTimeout(() => {
            setToast({ show: false, errorStatus: false, message: '' });
        }, 3000); // 3 seconds, for example
    };

    return { toast, showToast };
}

export default useShowToast;
