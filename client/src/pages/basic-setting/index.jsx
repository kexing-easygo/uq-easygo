import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtList, AtListItem, AtActionSheet, AtRadio } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { updateClassMode } from '../../services/profile'
import { CLASS_MODE_OPTIONS, SUMMER_START_DATE, SUMMER_WEEKS, SEMESTER_START_DATE, SEMESTER_WEEKS } from '../../utils/constant'
import './index.less'
import SemesterSelector from '../../components/semesters-selector'
import { setNotifyMenu } from '../../features/countdown-slice'
import { updateCurrentSemester, fetchCurrentSemester } from "../../services/course";
import NotifySheet from "../../components/countdown/notifysheet/index";

export default function BasicSetting() {

  const dispatch = useDispatch();
  const { loginStatus, classMode } = useSelector(state => state.user);
  const { currentSemester } = useSelector(state => state.course)
  const [toggleOptions, setToggleOptions] = useState(false);
  const [toggleActionSheet, setToggleActionSheet] = useState(false);
  useEffect(() => {
    dispatch(fetchCurrentSemester())
  }, [currentSemester])
  const classModeOptions = CLASS_MODE_OPTIONS.map(cm => {
    return {
      label: cm,
      value: cm
    }
  })
  return (
    <View>
      <NavBar title="基本设置" backIcon />
      <AtList>
        <AtListItem
          title='倒计时提醒'
          arrow='right'
          // extraText='敬请期待'
          disabled={!loginStatus}
          onClick={() => dispatch(setNotifyMenu(true))}
        />

        <AtListItem
          title='上课提醒'
          extraText='敬请期待'
          disabled={!loginStatus}
        />
      </AtList>

      <AtList>
        <AtListItem
          title='上课模式'
          extraText={loginStatus ? classMode || '未设置' : '未登录'}
          arrow='right'
          disabled={!loginStatus}
          onClick={() => setToggleOptions(true)}
        />
        {/* 选择当前学期 */}
        <AtListItem
          title='当前学期'
          extraText={loginStatus ? currentSemester || '未设置' : '未登录'}
          arrow='right'
          disabled={!loginStatus}
          onClick={() => setToggleActionSheet(true)}
        />
      </AtList>

      <AtActionSheet
        isOpened={toggleOptions}
        cancelText='完成'
        title="选择上课模式 上课模式会影响课程表时间的显示哦"
        onCancel={() => setToggleOptions(false)}
        onClose={() => setToggleOptions(false)}
      >
        <AtRadio
          options={classModeOptions}
          value={classMode}
          onClick={mode => dispatch(updateClassMode(mode))}
        />
      </AtActionSheet>
      <SemesterSelector
        isOpened={toggleActionSheet}
        setOpened={setToggleActionSheet}
        semester={currentSemester}
        setSemester={s => {
          dispatch(updateCurrentSemester(s))
        }}
      />
      {/* 提醒设置actionSheet component */}
      <NotifySheet />
    </View>
  )
}

