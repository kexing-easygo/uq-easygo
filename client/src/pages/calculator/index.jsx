import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import NavBar from '../../components/navbar'
import CalculatorSelector from '../../components/calculator/calculator-selector'
import CourseList from '../../components/calculator/course-list'
import { calculator } from '../../assets/images/calculator.json'
import { useSelector } from 'react-redux'
import './index.less'
import { getGPALevel } from '../../utils/courses'

export default function Calculator() {
  const { assessments } = useSelector(state => state.calculator);
  const [gpa, setGpa] = useState(0);

  // 计算该课程总得分
  useEffect(() => {
    let total = 0;
    assessments.forEach(ass =>
      total += ass.percent ? ass.percent / 100 * ass.weight.split("%")[0] : 0);
    setGpa(getGPALevel(total));
  }, [assessments]);
  return (
    <View className='calc-container'>
      <NavBar title="计算器" backIcon />
      <View className='top-background'>
        <View className='score-board at-article__h2'>
          <View>{`Cumulative GPA: ${gpa}`}</View>
        </View>
        <View className='img-wrapper'>
          <Image className='calculator-img' src={calculator} mode="widthFix" />
          <View className='setting-wrapper'>
            <CourseList />
            <CalculatorSelector />
          </View>
        </View>
        <View className='setting-view'></View>
      </View>
    </View>
  )
}
