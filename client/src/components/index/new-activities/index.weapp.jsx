import React, { memo } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { activities } from '../../../assets/images/index.json'
import Taro  from '@tarojs/taro';

function NewActivities(props) {
  return (
    <AtCard title='最新活动' className='new-activities'>
      <View className='card-content'>
          <View className='activity-wrapper'>
            <Image 
              src={activities[0]} 
              mode="widthFix" 
              onClick={() => {
                Taro.navigateTo({url: "/pages/web-view/index"})
              }}
              />
          </View>
          <View className='activity-wrapper'>
            <Image 
              src={activities[1]} 
              mode="widthFix" 
              onClick={() => {Taro.previewImage({urls: [activities[1]]})}}
              />
          </View>
          <View className='activity-wrapper'>
            <Image 
              src={activities[2]} 
              mode="widthFix" 
              onClick={() => {Taro.previewImage({urls: [activities[2]]})}}
              />
          </View>
      </View>
    </AtCard>
  )
}

export default memo(NewActivities);