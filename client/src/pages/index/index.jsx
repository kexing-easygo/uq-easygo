import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtActivityIndicator, AtCard } from 'taro-ui'
import { useSelector } from 'react-redux'
import { Swiper, SwiperItem } from '@tarojs/components'
import { getTodayCourses } from '../../services/course'
import { carousel1, carousel2, carousel3, activities, titleImage } from '../../assets/images/index.json'
import { countDownIcon, timeTableIcon, calculaterIcon, courseReviewIcon, alert } from '../../assets/images/icon.json'
import './index.less'
import TodayCourse from '../../components/index/today-course/index'
import NewActivities from '../../components/index/new-activities/index'

export default function Index() {

  return (
    <View className='index-container'>
      <View className='usyd-easygo-title' style={{ paddingTop: Taro.$navBarMarginTop + 'px' }}>
        <Image src={titleImage} />
      </View>
      <Swiper
        className='swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <Image className='carousel-img' src={carousel1} mode="widthFix" />
        </SwiperItem>
        <SwiperItem onClick={() => Taro.navigateTo({ url: '/pages/timetable/index' })}>
          <Image className='carousel-img' src={carousel2} mode="widthFix" />
        </SwiperItem>
        <SwiperItem onClick={() => Taro.navigateTo({ url: '/pages/calculator/index' })}>
          <Image className='carousel-img' src={carousel3} mode="widthFix" />
        </SwiperItem>
      </Swiper>

      <View className='function-entries'>
        <View className='function-icon-view'>
          <Image
            className='function-icon'
            src={calculaterIcon}
            onClick={() => Taro.navigateTo({ url: '/pages/calculator/index' })}
          />
          <View className='title-text'>计算器</View>
        </View>

        <View className='function-icon-view'>
          <Image
            className='function-icon'
            src={countDownIcon}
            onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}
          />
          <View className='title-text'>倒计时</View>
        </View>

        <View className='function-icon-view'>
          <Image
            className='function-icon'
            src={timeTableIcon}
            onClick={() => Taro.navigateTo({ url: '/pages/timetable/index' })}
          />
          <View className='title-text'>课程表</View>
        </View>

        <View className='function-icon-view'>
          <Image
            className='function-icon'
            src={courseReviewIcon}
            onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}
          />
          <View className='title-text'>课评</View>
        </View>

      </View>

      <TodayCourse />
      <NewActivities />
    </View>
  )
}

