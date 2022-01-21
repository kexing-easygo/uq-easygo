import React, { useState, useEffect } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtModal, AtModalContent, AtModalAction } from "taro-ui"
import ProgressBoardNew from '../../components/calculator/progress-board-new'
import AssessmentList from '../../components/calculator/assessment-list'
import ScoreModal from '../../components/calculator/score-modal'
import BackTop from '../../components/back-top'
import { useDispatch, useSelector } from 'react-redux'
import '../calculator/index.less'
import './index.less'
import { getGPALevel } from '../../utils/courses'
import { saveCourseScore } from '../../services/calculator'
import { getResults, resetAskSave } from '../../features/calculator-slice'
import { setSelectedCourses } from '../../features/course-slice'


export default function CalculatorResult() {
  const dispatch = useDispatch();
  const FLOAT_START = 0.27
  const FLOAT_END = 0.5
  const { assessments, searchedCourse, askSave, clickedAss } = useSelector(state => state.calculator);
  const { selectedCourses, currentSemester } = useSelector(state => state.course);
  const [state, setState] = useState(FLOAT_START)
  const [totalScore, setTotalScore] = useState(0);
  const [gpa, setGpa] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const searchedSemester = currentSemester
  const results = selectedCourses[searchedSemester] === undefined ? [] : selectedCourses[searchedSemester].find(course =>
    course.courseCode === searchedCourse)?.results;
  useEffect(() => {
    dispatch(resetAskSave());
    if (!selectedCourses?.searchedSemester && !results?.length) return;
    // 将结果合并到assessments中
    dispatch(getResults({
      assessments: assessments,
      results: results
    }))
    
  }, [searchedCourse, searchedSemester]);
  const handleSaveScore = () => {
    const _calculatedInfo = assessments.map(ass => ({
      description: ass.description,
      weight: ass.weight,
      score: ass.score ?? 0,
      totalScore: ass.totalScore ?? 0,
      percent: ass.percent ?? 0.0
    }));
    dispatch(saveCourseScore({
      course: searchedCourse,
      semester: searchedSemester,
      info: _calculatedInfo
    }));
    dispatch(setSelectedCourses({
      sem: searchedSemester,
      code: searchedCourse,
      info: _calculatedInfo
    }))
    Taro.navigateBack();
  }

  /**
   * 退出结果页面之前根据用户操作判断是否保存结果
   */
  const handleExitResultPage = () => {
    // 判断是否更改分数
    // 如果用户没有选择本门课程
    // 不保存该门课分数
    if (selectedCourses[searchedSemester] === undefined) {
      Taro.navigateBack();
      return
    }
    const index = selectedCourses[searchedSemester].findIndex(course =>
      course.courseCode === searchedCourse)
    if (!askSave) {
      Taro.navigateBack();
      return;
    }
    if (index === -1 ) {
      Taro.navigateBack()
      return
    }
    // 如果更改了分数展示modal询问是否保存
    setShowModal(true);
  }

  // 计算该课程总得分
  useEffect(() => {
    let total = 0;
    assessments.forEach(ass => {
      total += ass.percent ? ass.percent / 100 * ass.weight.split("%")[0] : 0;
    });
    setTotalScore(total.toFixed(2));
    setGpa(getGPALevel(total))
    setState(FLOAT_START + (FLOAT_END - FLOAT_START) * (total / 100))
    
  }, [assessments]);

  return (
    <View className='calc-container'>
      <NavBar title="计算器" backIcon
        handleClickBackBtn={handleExitResultPage}
      />
      <View className='fixed-height'>
        <View className='score-board'>
          <View className='score-board-txt'>{`Total Score: ${totalScore}`}</View>
        </View>
        
        <ProgressBoardNew 
          level={gpa}
          percentage={Math.trunc(totalScore)}
          assessments={assessments}
          state={state}
          />
      </View>
      
      <View className='img-wrapper'>
        <View className='setting-wrapper'>
          <AssessmentList />
        </View>
      </View>

      <View className='setting-view'></View>
      <ScoreModal 
        click={assessments[clickedAss]}
        />
      <BackTop />
      <AtModal isOpened={showModal}>
        <AtModalContent>
          是否保存本门课程的分数？
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => Taro.navigateBack()}>取消</Button>
          <Button onClick={handleSaveScore}>保存</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
