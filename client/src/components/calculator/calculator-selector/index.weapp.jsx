import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtIcon, AtActionSheet, AtActionSheetItem, AtRadio } from 'taro-ui'
import { fetchAssessments } from '../../../services/calculator'
import { SEMESTERS } from '../../../utils/constant'
import { useDispatch } from 'react-redux'
import './index.less'
import { setSearchedCourse } from '../../../features/calculator-slice'
import { debounce } from '../../../utils/opt'

/**
 * 计算器中选择学期和课程代码
 * @param {object} props 
 */
export default function CalculatorSelector(props) {

  const dispatch = useDispatch();
  const [semester, setSemester] = useState(''); // 默认值应为当前学期
  const [courseCode, setCourseCode] = useState('');
  const [toggleActionSheet, setToggleActionSheet] = useState(false);

  const semesterOptions = SEMESTERS.map(sem => {
    return {
      label: sem,
      value: sem
    }
  })

  const handleSearchAssessment = async () => {
    if (semester.length === 0) {
      await Taro.showToast({
        title: "请选择学期",
        icon: "none"
      })
      return;
    }
    if (courseCode.length === 0) {
      await Taro.showToast({
        title: "请填写课程代码",
        icon: "none"
      })
      return;
    }
    const params = {
      courseCode: courseCode,
      semester: semester
    }
    dispatch(setSearchedCourse(courseCode));
    dispatch(fetchAssessments(params));
  }

  return (
    <View className='selector-container'>
      <View className='semester-selector input-element'>
        <Input
          className='calculator-input'
          placeholder={'选择学期'}
          value={semester}
          disabled
        />
        <View
          className='icon-btn'
          onClick={() => setToggleActionSheet(true)}>
          <AtIcon className="at-fab__icon at-icon at-icon-menu"></AtIcon>
        </View>
      </View>

      <View className='course-selector input-element'>
        <Input
          className='calculator-input'
          type='text'
          value={courseCode}
          placeholder={'课程代码'}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
        />
        <View
          className='icon-btn'
          onClick={debounce(handleSearchAssessment, 1000)}
        >GO</View>
      </View>

      <AtActionSheet
        isOpened={toggleActionSheet}
        cancelText='确定'
        title='选择学期'
        onCancel={() => setToggleActionSheet(false)}
        onClose={() => setToggleActionSheet(false)}
      >
        <AtRadio
          options={semesterOptions}
          value={semester}
          onClick={setSemester}
        />
      </AtActionSheet>
    </View>
  )
}
