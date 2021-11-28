import React, { memo, useState } from 'react'
import Taro, { usePageScroll } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { AtFab } from 'taro-ui'

function BackTop(props) {
  const [visible, setVisible] = useState(false);
  usePageScroll(res => {
    if (res.scrollTop > 200) setVisible(true);
    else setVisible(false);
  });

  return (
    <AtFab
      className={`fab ${visible ? 'active' : 'inactive'}`}
      size="small"
      onClick={() =>
        Taro.pageScrollTo({ scrollTop: 0, duration: 300 })}
    >
      <Text className='at-fab__icon at-icon at-icon-chevron-up'></Text>
    </AtFab>
  )
}
export default memo(BackTop);