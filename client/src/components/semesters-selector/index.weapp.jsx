import React, { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { AtActionSheet, AtRadio } from 'taro-ui'
import { SEMESTERS } from '../../utils/constant'

/**
 * 选择学期
 * @param {object} props 
 */
function SemesterSelector(props) {

  const { isOpened, setOpened, semester, setSemester } = props;
  const semesterOptions = SEMESTERS.map(sem => {
    return {
      label: sem,
      value: sem
    }
  })

  return (
    <AtActionSheet
      isOpened={isOpened}
      cancelText='确定'
      title='选择学期'
      onCancel={() => setOpened(false)}
      onClose={() => setOpened(false)}
    >
      <AtRadio
        options={semesterOptions}
        value={semester}
        onClick={setSemester}
      />
    </AtActionSheet>
  )
}
export default memo(SemesterSelector);