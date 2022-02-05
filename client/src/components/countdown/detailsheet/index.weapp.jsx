import React, { memo, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker} from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtButton, AtInput, AtListItem } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { updateCountDown } from '../../../services/countdown'
import { closeDetailSheet } from "../../../features/countdown-slice";
import ColorPicker from '../../timetable/color-picker'
import './index.less'

export default function DetailSheet(props) {
  const dispatch = useDispatch()
  const { clickedAss, showDetailSheet } = useSelector(state => state.countdown)
  const [assignmentName, setAssignmentName] = useState(clickedAss.name)
  const [assignmentDate, setAssignmentDate] = useState(clickedAss.date)
  const [assignmentTime, setAssignmentTime] = useState(clickedAss.time)
  const [assignmentType, setAssignmentType] = useState(clickedAss.type)
  const [assignmentColor, setAssignmentColor] = useState(clickedAss.color)
  const types = ['Assessment', 'Exam']
  useEffect(() => {
    // console.log(clickedAss)
    setAssignmentName(clickedAss.name)
    setAssignmentDate(clickedAss.date)
    setAssignmentTime(clickedAss.time)
    setAssignmentType(clickedAss.type)
    setAssignmentColor(clickedAss.color)
  }, [clickedAss])
  const update = () => {
    // 判断是否做修改
    const newAssignment = {...clickedAss}
    newAssignment['color'] = assignmentColor
    newAssignment['name']= assignmentName
    newAssignment['date']= assignmentDate
    newAssignment['time']= assignmentTime
    newAssignment['type']= assignmentType
    const param = {
      assignment: newAssignment
    }
    dispatch(updateCountDown(param))
    dispatch(closeDetailSheet())
  }
  return (
    <AtActionSheet className='detail-sheet' isOpened={showDetailSheet} onClose={() => dispatch(closeDetailSheet())}>

      <AtActionSheetItem className='sheet-item'>
        <AtInput 
          name='detailsheet'
          title='标题名称'
          type='text'
          placeholder={showDetailSheet && clickedAss.name}
          value={showDetailSheet && clickedAss.name}
          onBlur={(value)=>{
            setAssignmentName(value)
          }}
        />
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>Due Date</View>
        <View style="display:flex;width:50%;">
          <Picker mode='date' onChange={(e)=>{
              setAssignmentDate(e.detail.value)
            }}>
            <AtListItem extraText={showDetailSheet && clickedAss.date} />
          </Picker>
          <Picker mode='time' onChange={(e)=> {setAssignmentTime(e.detail.value)}}>
            <AtListItem extraText={showDetailSheet && clickedAss.time} />
          </Picker>
        </View>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>Assessment类别</View>
        <Picker mode='selector' range={types} onChange={(e)=>{setAssignmentType(types[e.detail.value])}}>
          <AtListItem extraText={showDetailSheet && clickedAss.type} />
        </Picker>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>设置颜色</View>
        {showDetailSheet && 
          <ColorPicker 
          selectedColor={clickedAss.color} 
          handleSelection={setAssignmentColor} 
          />
        }
        
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View className='buttons'>
          <AtButton size='small' circle={true} onClick={update}>确认</AtButton>
          <AtButton size='small' circle={true} onClick={() => dispatch(closeDetailSheet())}>取消</AtButton>
        </View>
      </AtActionSheetItem>
    </AtActionSheet>
  )
}