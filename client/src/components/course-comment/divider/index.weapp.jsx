import React from 'react'
import { View } from '@tarojs/components'
import './index.less'

/*
灰色横线
*/
export default function Divider(props) {
  const {width} = props;
  return(<View className='divider' style={{width:width}}></View>)
}