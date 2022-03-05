import React, { useEffect, Component } from 'react'
import Taro from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss'
import './app.less'
import './icon.css'
import { getLoginStatus } from './services/login'
import store from './store'
import { Provider } from 'react-redux'


export default function App(props) {
  useEffect(() => {
    (async () => {
        Taro.$instance = Taro.getCurrentInstance();
        const info = await Taro.getSystemInfo({})
        Taro.$navBarMarginTop = info.statusBarHeight || 0
    })()
  }, [])
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}
