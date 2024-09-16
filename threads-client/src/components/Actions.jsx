import { Flex, Text } from "@radix-ui/themes";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import useShowToast from "@/hooks/useShowToast";
import ToastComponent from "./ToastComponent";
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import { Textarea } from 'flowbite-react';
import { Spinner } from "@radix-ui/themes";
import { Link } from 'react-router-dom'
import formatPostDate from "@/lib/formatPostDate";
import { Separator } from "@radix-ui/themes";
import { DropdownMenu } from "@radix-ui/themes";

const Actions = ({ post: post_ }) => {

	const currentUser = useRecoilValue(userAtom);
	const user = useRecoilValue(userAtom)
	const { toast, showToast } = useShowToast()
	const [post, setPost] = useState(post_)
	const [liked, setLiked] = useState(post?.likes.includes(user._id))
	const [isLiking, setIsLiking] = useState(false)
	const [isReplying, setIsReplying] = useState(false)

	const modalRef = useRef(null);
	const textAreaRef = useRef(null);
	const profilePicRef1 = useRef(null);
	const profilePicRef2 = useRef(null);

	const [inputValue, setInputValue] = useState("");
	const [charCount, setCharCount] = useState(0);
	const [updating, setUpdating] = useState(false)
	const [lineBottom, setLineBottom] = useState(145);





	const handleInputChange = (event) => {
		const newValue = event.target.value;
		if (newValue.length <= 500) {
			setInputValue(newValue);
			setCharCount(newValue.length);
			textAreaRef.current.style.height = "auto";
			textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
			setLineBottom(145 + (textAreaRef.current.scrollHeight - 20));
		}
	};

	const [postedByUser, setPostedByUser] = useState("")
	useEffect(() => {

		const getUser = async () => {
			try {

				const response = await axios.get(`/api/users/profile/${post.postedBy}`)

				setPostedByUser(response.data)
				// setLiked(response.data.likes.includes(user._id))
			} catch (error) {
				showToast(true, error.message)
			}
		}
		getUser()
	}, [post])

	const handleReply = async () => {
		if (!user) return showToast(true, "You must be logged in")
		if (isReplying) return;
		setIsReplying(true)
		try {
			setUpdating(true)
			console.log("postId sent", post._id)
			const response = await axios.put(`/api/posts/reply`, {
				postedBy: currentUser._id,
				text: inputValue,
				postId: post._id
			})
			console.log(response.data)
			setPost({ ...post, replies: [...post.replies, response.data.reply._id] })
			setInputValue("")
			modalRef.current.close();
			showToast(false, "Replied to post!");
		} catch (error) {
			showToast(true, error.message)
		} finally {
			setUpdating(false)
			setIsReplying(false)
		}
	}

	const handleLikeAndUnlike = async (event) => {
		if (!user) return showToast(true, "You must be logged in")
		if (isLiking) return
		setIsLiking(true)
		try {
			const response = await axios.put(`/api/posts/like/${post._id}`)
			console.log(response.data)

			if (!liked) {
				setPost({ ...post, likes: [...post.likes, user._id] })
			} else {
				setPost({ ...post, likes: post.likes.filter(id => id !== user._id) })
			}
			setLiked(!liked)
		} catch (error) {
			showToast(true, error.message)
		} finally {
			setIsLiking(false)
		}

	};

	const handlePostClick = (user, post) => {
		try {

			// navigate(`/${postedByUser.username}/post/${post._id}`)
			navigate(`/${user.username}/post/${post._id}`)
		} catch (error) {

		}
	}

	const handleRepost = async () => {
		try {

		} catch (error) {

		}
	}




	return (
		<>
			<div className="flex flex-col gap-2">
				<Flex gap="3" align="center" justify="start" onClick={(e) => e.preventDefault()}>
					<Flex justify={"center"} align={"center"} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-8 h-8 cursor-pointer text-zinc-500">
						<svg
							aria-label='Like'
							color={liked ? "rgb(237, 73, 86)" : ""}
							fill={liked ? "rgb(237, 73, 86)" : "transparent"}
							height='18'
							role='img'
							viewBox='0 0 24 22'
							width='18'
							onClick={(e) => handleLikeAndUnlike(e)}
						>
							<path
								d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
								stroke='currentColor'
								strokeWidth='2'
							></path>
						</svg>
					</Flex>
					<Flex gap="0" justify={"center"} align={"center"} >
						<Flex justify={"center"} align={"center"} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-8 h-8 cursor-pointer text-zinc-500">
							<svg
								aria-label='Comment'
								color=''
								fill=''
								height='18'
								role='img'
								viewBox='0 0 24 24'
								width='18'
								onClick={() => {
									document.getElementById(post._id).showModal()

								}}
							>
								<title>Comment</title>
								<path
									d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
									fill='none'
									stroke='currentColor'
									strokeLinejoin='round'
									strokeWidth='2'
								></path>
							</svg>
						</Flex>

					</Flex>


					<Flex justify={"center"} align={"center"} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-8 h-8 cursor-pointer text-zinc-500">


						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full ">
									<RepostSVG className="w-4 h-4 text-black dark:text-white cursor-pointer" />
								</div>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item className="bg-dropdown" onClick={handleRepost}>
									<div className='flex justify-between items-center gap-6'>
										Repost
										<div>

											<RepostSVG />
										</div>

									</div>


								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>

					</Flex>


					<Flex justify={"center"} align={"center"} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-8 h-8 cursor-pointer text-zinc-500">
						<ShareSVG />
					</Flex>
				</Flex>

				<Flex gap="3" align={"center"} className=" text-zinc-400 text-sm mx-[6px]">
					<Text>{post.likes.length} likes</Text>
					<div className="bg-zinc-400 w-[3px] h-[3px] rounded-full">
					</div>
					<Text>{post.replies.length} replies</Text>
				</Flex>

				{toast.show && <ToastComponent error={toast.errorStatus} message={toast.message} />}
			</div>

			<dialog id={post._id} ref={modalRef} className="modal z-10 shadow-lg bg-zinc-950 bg-opacity-85 ">

				<div className="modal-box  bg-zinc-50 border dark:bg-neutral-900 dark:border-zinc-800" >

					{/* <div className='bg-zinc-200 dark:bg-zinc-700 left-[42px]'
						style={{
							position: 'absolute',
							top: 80,
							width: '2px',
							bottom: lineBottom,

						}}
					></div> */}

					<div className='flex gap-4 mx-[-2px] justify-center w-full py-4 px-4 rounded-xl bg-neutral-200 shadow-sm dark:bg-neutral-800'>
						<Link to={currentUser.username !== postedByUser?.username ? '/' + postedByUser?.username : '#'}>
							<div className='flex justify-center min-w-11 cursor-pointer'>
								<img ref={profilePicRef1} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 hover:scale-105" src={postedByUser?.profilePic || '/default-avatar.jpg'} alt="" />
							</div>
						</Link>


						<div className='flex gap-2 pt-2 flex-col justify-center w-full'>
							<div className='flex  justify-between w-full'>
								<div className="flex flex-row text-zinc gap-2 items-center">

									<Link to={currentUser.username !== postedByUser?.username ? '/' + postedByUser?.username : '#'}>
										<div className='flex justify-center items-center gap-1 hover:underline'>
											<span className="font-semibold">{postedByUser?.username}</span>
											<img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
										</div>
									</Link>


									<span className="text-zinc-400 mx-1 text-sm">{formatPostDate(post?.createdAt)}</span>
								</div>



							</div>

							<div className='break-all whitespace-normal' onClick={() => handlePostClick(postedByUser, post)}>
								{post?.text}
							</div>

							{post?.img && <Flex onClick={() => handlePostClick(postedByUser, post)}>
								<img className="max-h-96 overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-lg" src={post?.img} alt="" />
							</Flex>}
						</div>
					</div>





					<div className="flex flex-row py-4 px-4 gap-2 border-zinc-200 dark:border-zinc-800">

						<div className='flex flex-col gap-2 w-full'>
							<div className="flex felx-row text-zinc gap-2 items-center">
								<img ref={profilePicRef2} className="w-10 h-10 mr-2 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover" src={currentUser.profilePic || 'default-avatar.jpg'} alt="" />

								<span className="font-semibold">{currentUser.username}</span>
								<img className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800" src="/verified.png" alt="" />
							</div>
							<Textarea ref={textAreaRef} onChange={handleInputChange} value={inputValue} id="bio" placeholder={`Reply to ${postedByUser.username}...`} rows={1} className="hide-scrollbar resize-none rounded-none bg-zinc-50 text-gray-900 text-sm border-0 focus:ring-0 block w-full p-0 dark:bg-neutral-900 dark:border-zinc-800 dark:placeholder-zinc-500 dark:text-white dark:focus:ring-zinc-700 dark:focus:border-zinc-700" />

						</div>
					</div>
					<div className='flex gap-2 justify-end items-center'>
						<div className="text-[11px] text-zinc-400">{charCount}/500</div>
						<button disabled={updating || (!inputValue)} onClick={handleReply} className={updating || (!inputValue) ? 'opacity-50 cursor-not-allowed border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm' : 'border border-zinc-300 dark:border-zinc-700 font-semibold py-2 px-4 rounded-xl text-sm'}>
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
			</dialog >



		</>

	);
};

export default Actions;

const RepostSVG = () => {
	return (
		<svg
			aria-label='Repost'
			color='currentColor'
			fill='currentColor'
			height='18'
			role='img'
			viewBox='0 0 24 24'
			width='18'
		>
			<title>Repost</title>
			<path
				fill=''
				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
			></path>
		</svg>
	);
};

const ShareSVG = () => {
	return (
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='18'
			role='img'
			viewBox='0 0 24 24'
			width='18'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>
	);
};
