import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import { AtSearchBar, AtDivider, AtIcon, AtCheckbox, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'
import NavBar from '../../components/navbar/index'
import ColorPicker from '../../components/countdown/colorpicker/index'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { callCloud } from "../../utils/cloud";
import { calcCountdown } from "../../utils/countdown";
import { autoAppendAssignments } from "../../services/countdown";


export default function AutoAdd() {
  const [notice, setNotice] = useState(true)
  const [courseCode, setCourseCode] = useState('CSSE1001')
  // 获取的所有作业
  const [currentAssessments, setCurrentAssessments] = useState([])
  // checkbox所有选项
  const [sessions, setSessions] = useState([]);
  // checkbox已被选中的选项
  const [selected, setSelected] = useState([])
  const [assignmentColor, setAssignmentColor] = useState('#FA5151');
  const { currentSemester } = useSelector(state => state.course)
  const {classMode} = useSelector( state => state.user )
  const dispatch = useDispatch()
  const onActionClick = async() => {
    setNotice(false)
    const param = {
      course: courseCode,
      semester: currentSemester
    }
    const res = await callCloud('calculator', 'fetchAssessments', {
      ...param
    })
    const result = res.result
    setCurrentAssessments(result)
    console.log("auto-add获取 ::: ", result)
    const s = result.map((value, index) => {
      return {value: index, label: value.description}
    })
    setSessions(s)
  }

  const handleConfirm = () => {
    const selectedAssessments = selected.map((value, index) => {
      let ass = currentAssessments[index]
      let param = {
        name: ass.description,
        date: ass.date.split(" ")[0],
        time: ass.date === "TBD" ? "00:00" : ass.date.split(" ")[1],
        color: assignmentColor,
        type: "Assessment"
      }
      calcCountdown(param, classMode)
      return param
    })
    console.log("用户选择的作业信息 ::: ", selectedAssessments)
    dispatch(autoAppendAssignments({assignments: selectedAssessments}))
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
      />

      <View className='at-article start-notice' style={notice? '':'display:none;'}>
        <View className='at-article__section'>
          <View className='at-article__h3'>温馨提示</View>
        </View>
        <AtDivider lineColor='#6A90E2'/>
        <View className='at-article__section'>
          <View className='at-article__h3'>最终交付时间以官网时间为准</View>
          <View className='at-article__h3'>请及时核对和更新assessment截止时间</View>
        </View>
      </View>
      {sessions.length > 0 &&
          <AtCheckbox
            options={sessions}
            selectedList={selected}
            onChange={(value) => {console.log(value); setSelected(value)}}
          />
      }
      <View className={notice? 'action':'action show'} >
        <AtActionSheetItem>
          <View className='action-notice'>
            <AtIcon value='clock' size='20' color='#999' />
            <Text style='color: #999; font-size: 26rpx;'>标注需自主添加时间</Text>
          </View>
          <View className='action-colorpicker'>
            <View>设置颜色</View>
            <ColorPicker 
              handleSelection={setAssignmentColor} 
              selectedColor={assignmentColor}/>
          </View>
          <View className='action-buttons'>
            <AtButton size='small' circle={true}>取消</AtButton>
            <AtButton size='small' circle={true} onClick={handleConfirm}>确定</AtButton>
          </View>
        </AtActionSheetItem>
      </View>

    </View>
  )
}