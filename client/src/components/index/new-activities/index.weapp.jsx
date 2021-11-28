import React, { memo } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { activities } from '../../../assets/images/index.json'

function NewActivities(props) {
  return (
    <AtCard title='最新活动' className='new-activities'>
      <View className='card-content'>
        {activities.map(activity =>
          <View className='activity-wrapper'>
            <Image src={activity} mode="widthFix" />
          </View>)}
      </View>
    </AtCard>
  )
}

export default memo(NewActivities);