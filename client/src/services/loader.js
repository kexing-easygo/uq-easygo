import Taro from '@tarojs/taro'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'

export const imageLoader = createAsyncThunk(
  'images/imageLoader',
  async (param) => {
    
  }
)