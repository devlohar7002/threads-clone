import React from 'react'
import { useState } from 'react';

function usePreviewImage() {
    const [imgUrl, setImgUrl] = useState(null);


    const handleImageChange = (e) => {
        // if (e.target.files.length <= 0) {
        //     setImgUrl(null)
        // }
        const file = e.target?.files[0] || null
        if (file) {
            // Reader to load the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }

    }
    return {
        handleImageChange, imgUrl, setImgUrl
    }
}

export default usePreviewImage