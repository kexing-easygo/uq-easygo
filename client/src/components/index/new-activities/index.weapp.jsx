import React, { memo } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import {ACTIVITY1_URL, ACTIVITY2_URL, ACTIVITY3_URL} from '../../../config.json'
import Taro from '@tarojs/taro';
import { useSelector } from 'react-redux'
import { activities } from '../../../assets/images/index.json'


function NewActivities(props) {
  // const {activity1, activity2, activity3} = useSelector(state => state.resource)
  // const activities = [activity1, activity2, activity3]
  return (
    <AtCard title='最新活动' className='new-activities'>
      <View className='card-content'>
          <View className='activity-wrapper'>
            <Image 
              src={activities[0]} 
              mode="widthFix" 
              onClick={() => {
                if (ACTIVITY1_URL == "") {
                  Taro.previewImage({urls: [activities[0]]})
                } else {
                  Taro.navigateTo({url: "/pages/web-view/index?url=" + ACTIVITY1_URL})
                }
              }}
              />
          </View>
          <View className='activity-wrapper'>
            <Image 
              src={activities[1]} 
              mode="widthFix" 
              onClick={() => {
                if (ACTIVITY2_URL == "") {
                  Taro.previewImage({urls: [activities[1]]})
                } else {
                  Taro.navigateTo({url: "/pages/web-view/index?url=" + ACTIVITY2_URL})
                }
              }}
              />
          </View>
          <View className='activity-wrapper'>
            <Image 
              src={activities[2]} 
              mode="widthFix" 
              onClick={() => {
                if (ACTIVITY3_URL == "") {
                  Taro.previewImage({urls: [activities[2]]})
                } else {
                  Taro.navigateTo({url: "/pages/web-view/index?url=" + ACTIVITY3_URL})
                }
              }}
              />
          </View>
      </View>
    </AtCard>
  )
}

export default memo(NewActivities);