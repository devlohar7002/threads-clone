import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import userAtom from '../atoms/userAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import useShowToast from '../hooks/useShowToast';
import ToastComponent from '../components/ToastComponent';
import { useNavigate } from 'react-router-dom';
import globalErrorAtom from "../atoms/globalErrorAtom";
import { Skeleton } from '@radix-ui/themes';
import UserSkeleton from '../components/UserSkeleton';
import currentPageAtom from '../atoms/currentPageAtom';
import newPostAtom from '../atoms/newPostAtom';
import UserReplies from '@/components/UserReplies';
import UserReposts from '@/components/UserReposts';

function UserPage() {
  // const user = useRecoilValue(userAtom);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([])
  const [userReposts, setUserReposts] = useState([])
  const { username } = useParams()
  const [loading, setLoading] = useState(true)

  const { toast, showToast } = useShowToast()
  const setGlobalError = useSetRecoilState(globalErrorAtom)

  const setCurrentPage = useSetRecoilState(currentPageAtom)

  const newPost = useRecoilValue(newPostAtom)
  const setNewPost = useSetRecoilState(newPostAtom)

  const curretnUser = useRecoilValue(userAtom)

  // useEffect(() => {
  //   setCurrentPage('Profile')
  // }, [setCurrentPage])

  const location = useLocation();
  const isRepliesPage = location.pathname.endsWith('/replies');
  const isRepostsPage = location.pathname.endsWith('/reposts');


  useEffect(() => {
    const getUser = async () => {
      try {

        const response = await axios.get(`/api/users/profile/${username}`)
        setUser(response.data)
        if (username === curretnUser.username) {
          setCurrentPage('Profile')
        } else {
          setCurrentPage(username)
        }

      } catch (error) {
        setGlobalError(true)
      }
    }

    const getUserPosts = async () => {
      try {

        const response = await axios.get(`/api/posts/user/${username}`)
        if (!isRepliesPage) {
          setUserPosts(response.data.filter((ele) => !ele.replyTo))
        } else {
          setUserPosts(response.data.filter((ele) => ele.replyTo))
        }

        // console.log(userPosts)

      } catch (error) {
        setGlobalError(true)
      }
    }

    getUser()
    getUserPosts()

    setLoading(false)
    // setTimeout(() => { setLoading(false) }, 1000)
    // return () => {
    //   setNewPost(null);
    // };

  }, [username, loading, newPost, isRepliesPage])

  useEffect(() => {
    const fetchReposts = async () => {
      try {
        const response = await axios.get(`/api/reposts/repost/feed/${username}`)
        // console.log(response.data)
        const postsArray = response.data.map(repost => repost.post);

        setUserReposts(postsArray)
        console.log(userReposts)
      } catch (error) {

      }
    }

    if (isRepostsPage) {
      fetchReposts()
    }
  }, [loading, isRepostsPage])



  if (!user) {
    return null
  }

  if (!user || loading) {
    return (
      <div className=''>
        <UserSkeleton />
      </div>)
  }

  return (
    <>
      <UserHeader user={user} />

      {isRepostsPage ? userReposts.map((post) => <UserReposts key={post._id} post={post} />)
        :
        userPosts.map((post) => (
          isRepliesPage ? <UserReplies key={post._id} post={post} /> : <UserPost key={post._id} post={post} />
        ))
      }


      {toast.show && <ToastComponent error={toast.errorStatus} message={toast.message} />}

    </>
  )
}

export default UserPage
