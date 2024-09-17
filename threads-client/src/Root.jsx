import React, { useEffect } from 'react'
import { Theme } from '@radix-ui/themes';
import App from './App.jsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { ThemeProvider } from 'next-themes';
import { RecoilRoot } from 'recoil';
import themeAtom from "./atoms/themeAtom"
import { useRecoilValue } from 'recoil';
import { useState } from 'react';

function Root() {
    const themeState = useRecoilValue(themeAtom);



    return (
        <>

            <Theme appearance={themeState}>
                <App className="w-dvh bg-white dark:bg-[#111114]" />
            </Theme>

        </>
    )
}

export default Root