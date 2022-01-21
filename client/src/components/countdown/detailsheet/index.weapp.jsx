import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker} from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtButton, AtInput, AtListItem } from 'taro-ui'
import { useDispatch } from 'react-redux'
import { updateCountDown } from '../../../services/countdown'
import ColorPicker from '../colorpicker/index'
import './index.less'

export default function DetailSheet(props) {
  const dispatch = useDispatch()
  const {aid, name, date, time, color, type, isOpen, onClose, setDetailSheet} = props

  const [assignmentName, setAssignmentName] = useState()
  const [assignmentDate, setAssignmentDate] = useState()
  const [assignmentTime, setAssignmentTime] = useState()
  const [assignmentType, setAssignmentType] = useState()
  const [assignmentColor, setAssignmentColor] = useState()
  const types = ['Assessment', 'Exam']
  
  const update = () => {
    dispatch(updateCountDown(
      {
        'aid': aid,
        'color': assignmentColor? assignmentColor:color,
        'name': assignmentName? assignmentName:name,
        'date': assignmentDate? assignmentDate:date,
        'time': assignmentTime? assignmentTime:time
      }
    ))
    Taro.showToast({title:'修改成功', icon:'success'})
    setAssignmentName(null)
    setAssignmentDate(null)
    setAssignmentTime(null)
    setAssignmentType(null)
    setAssignmentColor(null)
    setDetailSheet(false)
  }

  return (
    <AtActionSheet className='detail-sheet' isOpened={isOpen} onClose={onClose}>

      <AtActionSheetItem className='sheet-item'>
        <AtInput 
          name='detailsheet'
          title='标题名称'
          type='text'
          placeholder={name}
          value={assignmentName}
          onBlur={(value)=>{setAssignmentName(value)}}
        />
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>Due Date</View>
        <View style="display:flex;width:50%;">
          <Picker mode='date' onChange={(e)=>setAssignmentDate(e.detail.value)}>
            <AtListItem extraText={assignmentDate? assignmentDate:date} />
          </Picker>
          <Picker mode='time' onChange={(e)=>setAssignmentTime(e.detail.value)}>
            <AtListItem extraText={assignmentTime? assignmentTime:time} />
          </Picker>
        </View>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>Assessment类别</View>
        <Picker mode='selector' range={types} onChange={(e)=>{setAssignmentType(types[e.detail.value])}}>
          <AtListItem extraText={assignmentType? assignmentType:types[0]} />
        </Picker>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View>设置颜色</View>
        <ColorPicker selectedColor={color} handleSelection={setAssignmentColor} />
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <View className='buttons'>
          <AtButton size='small' circle={true} onClick={update}>确认</AtButton>
          <AtButton size='small' circle={true} onClick={onClose}>取消</AtButton>
        </View>
      </AtActionSheetItem>
    </AtActionSheet>
  )
}