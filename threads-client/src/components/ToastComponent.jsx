import React from 'react';

const ToastComponent = ({ error, message }) => {
    return (
        <>
            {error == true ? <div id="toast-bottom-right" className="z-50 fixed flex justify-center items-center max-w-xs text-wrap p-4 space-x-4 text-white bg-red-800 divide-x rtl:divide-x-reverse divide-zinc-200 rounded-lg shadow right-5 bottom-5 dark:bg-red-950" role="alert">
                <div className="text-sm font-normal">{message}</div>
            </div>
                :
                <div id="toast-bottom-right" className="z-50 fixed flex justify-center items-center max-w-xs text-wrap p-4 space-x-4  divide-x rtl:divide-x-reverse  rounded-lg shadow right-5 bottom-16 min-[840px]:bottom-5 text-zinc-400 divide-gray-700 bg-zinc-800" role="alert">
                    <div className="text-sm font-normal">{message}</div>
                </div>}


        </>
    );
};

export default ToastComponent;


