import Taro from '@tarojs/taro'
import { callCloud } from '../utils/cloud'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchImages = createAsyncThunk(
  'recourse/fetchImages',
  async () => {
    const res = await callCloud('cloud-resources', '', {})
    return res.result
  }
)
