import React from 'react';
import { Textarea } from 'flowbite-react';
import { IoImageOutline } from "react-icons/io5";
import ToastComponent from '../components/ToastComponent';
import { Spinner } from '@radix-ui/themes';

function PostModal() {
    return (
        <div>
            <dialog id="my_modal_2" ref={modalRef} className="modal z-10 shadow-lg bg-zinc-950 bg-opacity-85 ">
                <div className="modal-box bg-zinc-50 border dark:bg-neutral-900 dark:border-zinc-800" >
                    <div className="flex flex-row gap-2 border-zinc-200 dark:border-zinc-800">

                        <div className='flex flex-col gap-2 w-full'>
                            <div className="flex felx-row text-zinc gap-1 items-center">
                                <img className="w-10 h-10 mr-2 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" src={currentUser.profilePic || 'default-avatar.jpg'} alt="" />

                                <span className="font-semibold">{currentUser.username}</span>
                                <img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
                            </div>
                            <Textarea ref={textAreaRef} onChange={handleInputChange} value={inputValue} id="bio" placeholder="What's new?" rows={1} className="hide-scrollbar resize-none rounded-none bg-zinc-50 text-gray-900 text-sm border-0 focus:ring-0 block w-full p-0 dark:bg-neutral-900 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" />
                            {imgUrl && <div className="relative">
                                <img className="rounded-xl py-2 shadow-zinc-400 dark:shadow-zinc-800" src={imgUrl} alt="Display" />
                                <button onClick={(e) => { handleCancel(e) }} className="absolute top-2 right-0 m-2 rounded-full bg-zinc-700 bg-opacity-60 h-6 w-6 p-[5px]  text-zinc-700" aria-label="Remove image">

                                    <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                                </button>
                            </div>}
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <IoImageOutline className='text-zinc-400 dark:text-zinc-500 hover:text-zinc-500 dark:hover:text-zinc-400' />
                                <input id="file-upload" type="file" name="file" className="hidden" onChange={(e) => { handleFileChange(e); }} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div className='flex gap-2 justify-end items-center'>
                        <div className="text-[11px] text-zinc-400">{charCount}/500</div>
                        <button disabled={updating || (!imgUrl && !inputValue)} onClick={handleCreatePost} className={updating || (!imgUrl && !inputValue) ? 'opacity-50 cursor-not-allowed border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm' : 'border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm'}>
                            {updating ?
                                <div className='flex justify-center items-center gap-2'><Spinner />
                                    <div>Posting</div>
                                </div>
                                : <span>Post</span>}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
                {(toast.show) && <ToastComponent error={toast.errorStatus} message={toast.message} />}
            </dialog>
        </div>
    )
}

export default PostModal