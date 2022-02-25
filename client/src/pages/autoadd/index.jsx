import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import { AtSearchBar, AtDivider, AtIcon, AtCheckbox, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'
import NavBar from '../../components/navbar/index'
import ColorPicker from '../../components/timetable/color-picker/index'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { callCloud } from "../../utils/cloud";
import { calcCountdown } from "../../utils/countdown";
import { autoAppendAssignments, fetchAssessments } from "../../services/countdown";
import { SEARCHBAR_DEFAULT_PLACEHOLDER } from "../../config.json";

export default function AutoAdd() {
  const [notice, setNotice] = useState(true)
  const [courseCode, setCourseCode] = useState()
  const [currentAssessments, setCurrentAssessments] = useState([])
  // checkbox所有选项
  const [sessions, setSessions] = useState([]);
  // checkbox已被选中的选项
  const [selected, setSelected] = useState([])
  const [assignmentColor, setAssignmentColor] = useState('#FA5151');
  const { currentSemester } = useSelector(state => state.course)
  const {classMode} = useSelector( state => state.user )
  const dispatch = useDispatch()
  /**
   * 点击搜索后，调取本门课的所有assessments
   */
  const onActionClick = async() => {
    setNotice(false)
    const param = {
      course: courseCode,
      semester: currentSemester
    }
    const res = await fetchAssessments(param)
    console.log("auto-add获取 ::: ", res)
    const s = res.map((value, index) => {
      // 只有TBD会显示🕘
      return {value: index, label: value.description, desc: value.date == "需添加时间" ? '🕘' : ''}
    })
    setSessions(s)
    setCurrentAssessments(res)
  }
  /**
   * 用户点击确定后，将原始作业信息，转化成用户的作业信息
   * 添加color、name字段
   */
  const handleConfirm = () => {
    const selectedAssessments = selected.map((value, index) => {
      let ass = currentAssessments[index]
      let param = {
        name: ass.description,
        date: ass.date,
        time: ass.time,
        color: assignmentColor,
        type: ass.assessment_type
      }
      calcCountdown(param, classMode)
      return param
    })
    dispatch(autoAppendAssignments({assignments: selectedAssessments}))
    Taro.navigateBack()
  }

  return (
    <View className='auto-add'>
      <NavBar title='自动添加' backIcon></NavBar>

      <AtSearchBar 
        showActionButton
        value={courseCode}
        onChange={(value) => setCourseCode(value.toUpperCase())}
        onActionClick={onActionClick}
        onConfirm={onActionClick}
        placeholder={SEARCHBAR_DEFAULT_PLACEHOLDER}
      />

      <View className='at-article start-notice' style={notice? '':'display:none;'}>
        <View className='at-article__section'>
          <View className='at-article__h3 h1'>温馨提示</View>
        </View>
        <AtDivider lineColor='#6A90E2'/>
        <View className='at-article__section'>
          <View className='at-article__h3'>最终交付时间以官网时间为准</View>
          <View className='at-article__h3'>请及时核对和更新assessment截止时间</View>
        </View>
      </View>

      <View className='result-section'>
      {sessions.length > 0 &&
        <AtCheckbox
          options={sessions}
          selectedList={selected}
          onChange={(value) => setSelected(value)}
        />
      }
      </View>

      <View className={notice? 'action':'action show'} >
        <AtActionSheetItem>
          <View className='action-notice'>
            <AtIcon value='clock' size='20' color='#999'/>
            <Text style='color: #999; font-size: 26rpx; margin-left:20rpx;'>标注需自主添加时间</Text>
          </View>
          <View className='action-colorpicker'>
            <View>
              <Text style='font-size: 30rpx;'>
                设置颜色
              </Text>
            </View>
            <ColorPicker 
              handleSelection={setAssignmentColor} 
              selectedColor={assignmentColor}/>
          </View>
          <View className='action-buttons'>
            <AtButton size='small' circle={true} type='secondary'
              customStyle={{border: '1px solid #6190E8'}}>
              取消
            </AtButton>
            <AtButton size='small' circle={true} type='primary' onClick={handleConfirm}>
              确认
            </AtButton>
          </View>
        </AtActionSheetItem>
      </View>

    </View>
  )
}