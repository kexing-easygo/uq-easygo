import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtModal, AtModalContent, AtFab } from "taro-ui"
import NavBar from '../../components/navbar'
import CalculatorSelector from '../../components/calculator/calculator-selector'
import AssessmentBoard from '../../components/calculator/assessment-board'
import AssessmentList from '../../components/calculator/assessment-list'
import ScoreModal from '../../components/calculator/score-modal'
import BackTop from '../../components/back-top'
import { useSelector } from 'react-redux'
import '../calculator/index.less'
import './index.less'
import { getGPALevel } from '../../utils/courses'

export default function CalculatorResult() {
  const { assessments, searchedCourse } = useSelector(state => state.calculator);
  const [toggleSelector, setToggleSelector] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gpa, setGpa] = useState(0);

  // 计算该课程总得分
  useEffect(() => {
    let total = 0;
    assessments.forEach(ass => {
      total += ass.percent ? ass.percent / 100 * ass.weight.split("%")[0] : 0;
    });
    setTotalScore(total);
    setGpa(getGPALevel(total));
  }, [assessments]);
  return (
    <View className='calc-container'>
      <NavBar title="计算器" backIcon />
      <View className='top-background'>
        <View className='score-board'>
          <View>{`Total Score: ${totalScore}`}</View>
          <View>{`${searchedCourse} GPA: ${gpa}`}</View>
        </View>
        <View className='img-wrapper'>
          <AssessmentBoard assessments={assessments} />
          <View className='setting-wrapper'>
            <AssessmentList />
          </View>
        </View>
      </View>

      <View className='setting-view'></View>

      <ScoreModal />

      <AtModal
        className='calculator-selector-modal'
        isOpened={toggleSelector}
        onClose={() => setToggleSelector(false)}
        onCancel={() => setToggleSelector(false)}
      >
        <AtModalContent>
          <CalculatorSelector />
        </AtModalContent>
      </AtModal>
      <BackTop />
    </View>
  )
}
