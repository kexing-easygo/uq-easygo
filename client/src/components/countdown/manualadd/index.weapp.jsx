import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker} from '@tarojs/components'
import { AtFloatLayout, AtActionSheetItem, AtButton, AtForm, AtInput, AtListItem } from 'taro-ui'
import { useDispatch } from 'react-redux'
import { appendNewCountDown } from '../../../services/countdown'
import ColorPicker from '../../timetable/color-picker'
import './index.less'
import { calcCountdown } from "../../../utils/countdown";

export default function ManualAdd(props) {
  const dispatch = useDispatch()
  const {isOpen, closeManualAdd} = props
  const handleAppend = () => {
    if (assignmentName == undefined || assignmentName.trim() == '') {
      Taro.showToast({title:'未输入标题名称', icon:'none'}); return;
    } 
    if (assignmentDate == undefined || assignmentTime == undefined) 
    {
      Taro.showToast({title:'未选择日期或时间', icon:'none'}); return;
    }
    if (assignmentType == undefined) {
      Taro.showToast({title:'未设置作业类别', icon:'none'}); return;
    }
    const param = {
      name: assignmentName,
      date: assignmentDate,
      time: assignmentTime,
      color: assignmentColor,
      type: assignmentType
    }
    calcCountdown(param)
    try {
      dispatch(appendNewCountDown(param))
      setAssignmentName(null)
      setAssignmentDate(null)
      setAssignmentTime(null)
      setAssignmentType(null)
      setAssignmentColor('#FA5151')
      Taro.showToast({title:'添加成功', icon:'success'})
    } catch(err) {
      Taro.showToast({title:'添加失败', icon:'loading'})
      return;
    }
    closeManualAdd(false)
  }
  const handleClose =  () => {
    closeManualAdd(false)
    setAssignmentName(null)
    setAssignmentDate(null)
    setAssignmentTime(null)
    setAssignmentType(null)
    setAssignmentColor(null)
  }

  const [assignmentName, setAssignmentName] = useState()
  const [assignmentDate, setAssignmentDate] = useState()
  const [assignmentTime, setAssignmentTime] = useState()
  const [assignmentType, setAssignmentType] = useState()
  const [assignmentColor, setAssignmentColor] = useState('#FA5151');
  const types = ['Assessment', 'Exam']
  
  return (
    <AtForm>
   
      <AtFloatLayout className='manualadd-sheet' title='手动添加'
      isOpened={isOpen} onClose={handleClose}>

        {/*<AtActionSheetItem className='sheet-header'>
          <View className='title'>手动添加</View>
          </AtActionSheetItem>*/}

        <AtActionSheetItem className='sheet-item title'>
          <AtInput 
            name='manualadd'
            title='标题名称'
            type='text'
            placeholder={'输入Assessment标题'}
            placeholderStyle='text-align:right;'
            value={assignmentName}
            border={false}
            onBlur={(value)=>{setAssignmentName(value)}}
          />
        </AtActionSheetItem>

        <AtActionSheetItem className='sheet-item'>
          <View>Due Date</View>
          <View style="display:flex;width:50%;">
            <Picker mode='date' onChange={(e)=>setAssignmentDate(e.detail.value)}>
              <AtListItem className='sheet-item-picker' extraText={assignmentDate? assignmentDate:'选择日期'} />
            </Picker>
            <Picker mode='time' onChange={(e)=>setAssignmentTime(e.detail.value)}>
              <AtListItem className='sheet-item-picker' extraText={assignmentTime? assignmentTime:'选择时间'} />
            </Picker>
          </View>
        </AtActionSheetItem>

        <AtActionSheetItem className='sheet-item'>
          <View>Assessment类别</View>
          <Picker mode='selector' range={types} onChange={(e)=>{setAssignmentType(types[e.detail.value])}}>
            <AtListItem className='sheet-item-picker' extraText={assignmentType? assignmentType:'选择类型'} />
          </Picker>
        </AtActionSheetItem>

        <AtActionSheetItem className='sheet-item'>
          <View className='color-select'>设置颜色</View>
          <ColorPicker handleSelection={setAssignmentColor} selectedColor={assignmentColor}/>
        </AtActionSheetItem>

        <AtActionSheetItem className='sheet-item'>
          <View className='buttons'>
            <AtButton size='small' circle={true} type='secondary' 
            customStyle={{border: '1px solid #6190E8'}}
            onClick={handleClose}>
              取消
            </AtButton>
            <AtButton size='small' circle={true} type='primary' 
            onClick={handleAppend}>
              确认
            </AtButton>
          </View>
        </AtActionSheetItem>
      </AtFloatLayout>
    </AtForm>
  )
}