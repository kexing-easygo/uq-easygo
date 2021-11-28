import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'

/**
 * 根据课程代码和学期获取当学期课程的assessment
 * @param {string} courseCode 
 * @param {string} semester 
 */
export const fetchAssessments = createAsyncThunk(
  'calculator/fetchAssessments',
  async (param) => {
    try {
      const assRes = await callCloud('calculator', 'fetchAssessments', param);
      return assRes.result;
    } catch (err) {
      console.log('获取ass失败', ass);
      return [];
    }
  }
)