import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@radix-ui/themes/styles.css';
import Root from './Root.jsx';
import { RecoilRoot } from 'recoil';




createRoot(document.getElementById('root')).render(

  <RecoilRoot>
    <Root />
  </RecoilRoot>,
)
