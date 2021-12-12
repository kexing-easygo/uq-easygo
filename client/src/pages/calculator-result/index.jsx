import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtModal, AtModalContent, AtModalAction } from "taro-ui"
import AssessmentBoard from '../../components/calculator/assessment-board'
import AssessmentList from '../../components/calculator/assessment-list'
import ScoreModal from '../../components/calculator/score-modal'
import BackTop from '../../components/back-top'
import { useDispatch, useSelector } from 'react-redux'
import '../calculator/index.less'
import './index.less'
import { getGPALevel } from '../../utils/courses'
import { saveCourseScore } from '../../services/calculator'
import { getResults, resetAskSave } from '../../features/calculator-slice'
import { fetchSelectedCourses } from '../../services/course'
import { HTML5_FMT } from 'moment'
import { CURRENT_SEMESTER } from '../../utils/constant'


export default function CalculatorResult() {
  const dispatch = useDispatch();
  const { assessments, searchedCourse, askSave } = useSelector(state => state.calculator);
  const { selectedCourses } = useSelector(state => state.course);
  const [totalScore, setTotalScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [gpa, setGpa] = useState(0);
  const searchedSemester = CURRENT_SEMESTER
  useEffect(() => {
    dispatch(resetAskSave());
    // console.log(`"搜索的学期：${searchedSemester}"`) 
    // console.log(`"搜索到的课程：${selectedCourses}"`)
    const results = selectedCourses[CURRENT_SEMESTER].find(course =>
      course.courseCode === searchedCourse)?.results;
    if (!results?.length) return;
    // 将结果合并到assessments中
    dispatch(getResults({
      assessments: assessments,
      results: results
    }))
  }, [searchedCourse, searchedSemester]);

  const handleSaveScore = () => {
    const _calculatedInfo = assessments.map(ass => ({
      description: ass.description,
      // weight: "60%",
      score: ass.score ?? 0,
      totalScore: ass.totalScore ?? 0,
      percent: ass.percent ?? 0.0
    }));
    dispatch(saveCourseScore({
      course: searchedCourse,
      semester: searchedSemester,
      info: _calculatedInfo
    }));
    Taro.navigateBack();
  }

  /**
   * 退出结果页面之前根据用户操作判断是否保存结果
   */
  const handleExitResultPage = () => {
    // 判断是否更改分数
    if (!askSave) {
      Taro.navigateBack();
      return;
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
    setTotalScore(total);
    setGpa(getGPALevel(total));
  }, [assessments]);

  return (
    <View className='calc-container'>
      <NavBar title="计算器" backIcon
        handleClickBackBtn={handleExitResultPage}
      />
      <View className='top-background'>
        <View className='score-board'>
          <View>{`Total Score: ${totalScore}`}</View>
          <View>{searchedSemester}</View>
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
