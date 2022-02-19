import React, { useState, memo, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout, AtList, AtListItem, AtModal, AtInput, AtButton } from "taro-ui"
import ColorPicker from '../color-picker'
import { toggleDisplayDetail } from '../../../features/course-slice'
import { deleteClass, updateClass } from '../../../services/course'
import { CURRENT_SEMESTER, DEFAULT_REMARK } from '../../../utils/constant'
import { computeEndTime, convert2CST } from '../../../utils/time'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { getClassCode } from "../../../utils/courses";

export default function SessionDetails(props) {

  const { clickedClass, displayDetail, currentSemester } = useSelector(state => state.course);
  const CURRENT_SEMESTER = currentSemester
  const { classMode } = useSelector(state => state.user);
  const [remark, setRemark] = useState(clickedClass.remark ?? DEFAULT_REMARK); // 备注信息
  const [isEditing, setIsEditing] = useState(false);
  const [remarkNote, setRemarkNote] = useState(clickedClass.remark ?? DEFAULT_REMARK);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(clickedClass.background);
  const [startTime, setStartTime] = useState(clickedClass.start_time);
  const [endTime, setEndTime] = useState(clickedClass.endTime);
  const dispatch = useDispatch();

  const toggleEditRemark = () => {
    setIsEditing(true);
    setRemarkNote("");
  }

  const handleEditRemark = (value) => {
    setRemark(value)
    return value;
  }

  const confirmEditRemark = () => {
    setRemarkNote(remark);
    setIsEditing(false);
  }

  const handleDeleteClass = () => {
    const courseCode = clickedClass.subject_code.split("_")[0]
    const args = {
      classId: clickedClass._id,
      semester: CURRENT_SEMESTER,
      courseCode: courseCode
    }
    dispatch(deleteClass(args));
    setModalOpened(false);
    dispatch(toggleDisplayDetail());
  }

  const handleConfirmEdit = async () => {
    if (clickedClass.background === currentBackground
      && (clickedClass.remark === remark || clickedClass.remark === undefined)) {
      await Taro.showToast({
        title: "更改颜色或修改备注后可以点击按钮保存哦~",
        icon: "none",
      })
      return;
    }
    const _classInfo = {
      _id: clickedClass._id,
      background: currentBackground,
      remark: remark
    }
    const courseCode = clickedClass.subject_code.split("_")[0]
    dispatch(updateClass({
      semester: CURRENT_SEMESTER,
      courseCode: courseCode,
      classInfo: _classInfo
    }));
    dispatch(toggleDisplayDetail())
  }

  // 更新备注
  useEffect(() => {
    setRemark(clickedClass.remark ?? DEFAULT_REMARK)
    setRemarkNote(clickedClass.remark ?? DEFAULT_REMARK)
    const newStartTime = classMode === 'External' ? convert2CST(clickedClass.start_time) : clickedClass.start_time;
    const _endTime = computeEndTime(newStartTime, clickedClass.duration);
    setStartTime(newStartTime);
    setEndTime(_endTime);
    setCurrentBackground(clickedClass.background);
  }, [clickedClass]);
  return (
    <View>
      <AtFloatLayout
        isOpened={displayDetail}
        title="课程详情"
        onClose={() => dispatch(toggleDisplayDetail())}
      >
        <AtList>
          <AtListItem
            title='名称'
            note={displayDetail && `${getClassCode(clickedClass._id)}`}
          />
          <AtListItem
            title='颜色'
            note={displayDetail &&
              <ColorPicker
                handleSelection={setCurrentBackground}
                selectedColor={clickedClass.background}
              />}
          />
          <AtListItem
            title='地点'
            note={displayDetail && clickedClass.location}
          />
          <AtListItem
            title='时间'
            note={displayDetail && `${clickedClass.day_of_week.toUpperCase()} ${startTime}-${endTime}`}
          />
          <AtListItem
            title='备注'
            note={remarkNote}
            onClick={toggleEditRemark}
            hasBorder={false}
            extraText='修改'
            arrow='right'
          />
          {isEditing && <AtInput
            type='text'
            value={remark}
            extraText='修改备注'
            arrow='right'
            onChange={handleEditRemark}
          >
            <Text onClick={confirmEditRemark}>确定</Text>
          </AtInput>}
        </AtList>
        <View className='at-row'>
          <AtButton
            className='delete-session-btn opt-btn'
            type='secondary'
            size='small'
            onClick={() => setModalOpened(true)}
          >
            删除课程
          </AtButton>
          <AtButton
            className='opt-btn'
            type='primary'
            size='small'
            onClick={handleConfirmEdit}
          >
            确认修改
        </AtButton>
        </View>
      </AtFloatLayout>
      <AtModal
        isOpened={modalOpened}
        cancelText='取消'
        confirmText='确认'
        onClose={() => setModalOpened(false)}
        onCancel={() => setModalOpened(false)}
        onConfirm={handleDeleteClass}
        content='确定要删除吗'
      />
    </View>
  )
}