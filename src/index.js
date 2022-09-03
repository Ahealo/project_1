import React from 'react'

import { createRoot } from 'react-dom/client'
import 'antd-mobile/dist/antd-mobile.css'
import './index.css'
import './assets/fonts/iconfont.css'
//应该把组件导入放到样式导入之后，避免样式覆盖问题
import App from './App'
//导入react-virtualized组件的样式
import 'react-virtualized/styles.css'
import './utils/url.js'

createRoot(document.getElementById('root')).render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
