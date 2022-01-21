import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import NavBar from '../../components/navbar'
import CalculatorSelector from '../../components/calculator/calculator-selector'
import { calculator } from '../../assets/images/calculator.json'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { getSemesterGPA } from "../../services/calculator";

export default function Calculator() {
  const { gpa } = useSelector(state => state.calculator);
  const { currentSemester, selectedCourses } = useSelector(state => state.course)
  const dispatch = useDispatch()
  // 计算该课程总得分
  // useEffect(() => {
  //   dispatch(getSemesterGPA(currentSemester))
  // }, [currentSemester, selectedCourses])
  return (
    <View className='calc-container'>
      <NavBar title="计算器" backIcon />
      <View className='top-background'>
        <View className='score-board at-article__h2'>
          {/* <View>{`当前学期 GPA: ${gpa}`}</View> */}
          <View></View>
        </View>
        <View className='img-wrapper'>
          <Image className='calculator-img' src={calculator} mode="widthFix" />
          <View className='setting-wrapper'>
            
            <CalculatorSelector />
          </View>
        </View>
      </View>
    </View>
  )
}
