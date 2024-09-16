import React from 'react'
import SignupCard from '../components/SignupCard';
import SigninCard from '../components/SigninCard'
import authScreenAtom from '../atoms/authAtom';
import { useRecoilValue, useRecoilState } from 'recoil';

function AuthPage() {
    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <div className='flex justify-center items-center '>
            {(authScreenState === 'login') ? <SigninCard /> : <SignupCard />}

        </div>
    )
}

export default AuthPage