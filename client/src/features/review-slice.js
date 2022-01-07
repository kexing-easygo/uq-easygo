import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchHotResearches, fetchReviews } from '../services/review'

const initialState = {
  hotCourses: [],
  searchedCourse: '',
  searchedSemester: 'Semester 2, 2021',
  reviews: [],
  clickedReview: {}
}

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setSearchedCourse: (state, action) => {
      state.searchedCourse = action.payload
    },
    setSearchedSemester: (state, action) => {
      state.searchedSemester = action.payload
    },
    setClickedReview: (state, action) => {
      state.clickedReview = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotResearches.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      .addCase(fetchHotResearches.fulfilled, (state, action) => {
        state.hotCourses = action.payload
      })
      .addCase(fetchReviews.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload
        Taro.navigateTo({ url: '/pages/review-result/index' });
      })
      .addCase(fetchReviews.rejected, () => {
        Taro.showToast({ title: '出错了', icon: 'none' })
      })
  }
})

export const { setSearchedCourse, setSearchedSemester } = reviewSlice.actions

export default reviewSlice.reducer