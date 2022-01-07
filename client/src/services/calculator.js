import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'
import { getLocalOpenId } from './login'

/**
 * 根据课程代码和学期获取当学期课程的assessment
 * @param {string} courseCode 
 * @param {string} semester 
 */
export const fetchAssessments = createAsyncThunk(
  'calculator/fetchAssessments',
  async (param) => {
    const assRes = await callCloud('calculator', 'fetchAssessments', param);
    console.log(assRes)
    return assRes.result;
  }
)

/**
 * 用户同意保存分数计算结果后将结果储存至数据库
 */
export const saveCourseScore = createAsyncThunk(
  'calculator/saveCourseScore',
  async (param) => {
    console.log('saving score', param);
    const saveRes = await callCloud('calculator', 'setCalculatedResult', {
      ...param,
      openid: await getLocalOpenId()
    });
    return saveRes;
  }
)

export const getSemesterGPA = createAsyncThunk(
  'calculator/getCumulativeGPA',
  async (semester) => {
    try {
      const res = await callCloud('calculator', 'getCumulativeGPA', {
        semester: semester,
        openid: await getLocalOpenId()
      })
      return res.result
    } catch (err) {
      console.log(err)
    }
  }
)