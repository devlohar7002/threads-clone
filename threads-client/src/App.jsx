import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { useEffect, useState } from 'react';
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ErrorPage from './pages/ErrorPage';
import globalErrorAtom from "./atoms/globalErrorAtom";
import isNonAcrollableAtom from "./atoms/isNonScrollableAtom";
import Sidebar from "./components/Sidebar";
import enlagedImageAtom from './atoms/enlagedImageAtom';

export default function App() {
  const user = useRecoilValue(userAtom);
  // const user = null;
  const globalError = useRecoilValue(globalErrorAtom)
  const isNonScrollable = useRecoilValue(isNonAcrollableAtom)
  const enlargedImage = useRecoilValue(enlagedImageAtom)

  useEffect(() => {
    const handleWheel = (event) => {
      const scrollableDiv = document.getElementById('scrollableDiv');
      // Check if the scroll is happening over the scrollableDiv or not
      if (scrollableDiv) {
        let deltaY = event.deltaY;
        scrollableDiv.scrollTop += deltaY / 1.5;
        event.preventDefault();  // Prevent default to stop the normal scroll behavior
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <BrowserRouter>

      <div className=" !contain-none h-screen flex justify-center items-center ">
        {!enlargedImage && <nav className="fixed top-0 z-10 w-full">
          <Header />
        </nav>}
        {user && !isNonScrollable && !enlargedImage && <Sidebar />}

        {globalError ? <ErrorPage /> :

          <div id="scrollableDiv" className={user && !isNonScrollable ? "fixed top-36 left-0 right-0 bottom-0 pb-32 min-[840px]:pb-16 overflow-y-scroll hide-scrollbar h-full min-h-screen m-auto max-w-[640px] border-[1px] shadow-lg dark:shadow-zinc-950 border-zinc-200 dark:border-neutral-800 rounded-t-[40px] bg-white dark:bg-neutral-900" : "flex flex-col justify-center items-center dark:text-white "}>
            <Routes>
              {user && <Route path="/auth" element={<Navigate to={`/${user.username}`} replace />} />}
              <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to={`/auth`} replace />} />
              {user && <Route path="/" element={<HomePage />} />}
              {!user && <Route path="/auth" element={<AuthPage />} />}
              {user && <Route path="/:username" element={<UserPage />}>
                <Route path="replies" element={<UserPage />} />
                <Route path="reposts" element={<UserPage />} />
              </Route>}
              {user && <Route path="/:username/post/:postId" element={<PostPage />} />}
              <Route path="*" element={<Navigate to={user ? `/${user.username}` : "/auth"} replace />} />
            </Routes>
          </div>
        }
      </div>


    </BrowserRouter>
  );
}
