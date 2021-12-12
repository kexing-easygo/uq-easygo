import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchCurrentClasses, appendClass, deleteClass, updateClass, fetchSelectedCourses, deleteCourses, deleteSemester } from '../services/course'
import { computeAvailableCourses, computeClashCourses } from '../utils/courses'
import { CURRENT_SEMESTER } from '../utils/constant'

// 初始化状态
const initialState = {
  selectedCourses: {},
  currentClasses: [],
  availCourses: [],
  clickedClass: {},
  clashCourses: [],
  displayDetail: false
}

// 创建action
export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    // 获取到所有课程后根据活跃日期计算当周有效课程
    getAvailableCourse: (state, action) => {
      const { currentClasses, dates } = action.payload;
      state.availCourses = computeAvailableCourses(currentClasses, dates);
    },
    // 即将展示在SessionDetail中的课程
    getClickedCourse: (state, action) => {
      state.clickedClass = action.payload
      state.displayDetail = true
    },
    // 是否显示ActionSheet
    toggleDisplayDetail: (state) => {
      state.displayDetail = false
    },
    // 当课程出现增删时需要重新计算冲突课程
    updateClashes: (state, action) => {
      state.clashCourses = computeClashCourses(action.payload);
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchSelectedCourses.fulfilled, (state, action) => {
        state.selectedCourses = action.payload;
      })
      // 获取本学期已选择的课程
      .addCase(fetchCurrentClasses.fulfilled, (state, action) => {
        state.currentClasses = action.payload;
        console.log('fetch selected courses fulfilled', action.payload)
      })
      // 添加课程
      .addCase(appendClass.pending, () => {
        Taro.showToast({ icon: 'loading', title: '添加中' })
      })
      .addCase(appendClass.rejected, (state, action) => {
        console.log(action.error.message);
        Taro.showToast({ title: '添加出错' })
      })
      .addCase(appendClass.fulfilled, (state, action) => {
        state.currentClasses.push(...action.payload)
        Taro.showToast({ title: "添加完毕", icon: "success" })
      })
      // 修改课程设置
      .addCase(updateClass.pending, () => {
        Taro.showToast({ icon: 'loading', title: '修改中' })
      })
      .addCase(updateClass.rejected, (state, action) => {
        Taro.showToast({ title: '修改失败' })
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const target = state.currentClasses.find(cl => cl._id === action.payload._id);
        target.background = action.payload.background;
        target.remark = action.payload.remark;
        Taro.showToast({ title: '修改成功', icon: "none" })
      })
      // 删除class
      .addCase(deleteClass.pending, () => {
        Taro.showToast({ icon: 'loading', title: '删除中...' })
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.currentClasses = state.currentClasses.filter(cl => cl._id !== action.payload);
        Taro.showToast({ title: '删除成功', icon: "none" })
      })
      .addCase(deleteCourses.pending, () => {
        Taro.showToast({ icon: 'loading', title: '删除中...' })
      })
      .addCase(deleteCourses.fulfilled, (state, action) => {
        const { courses, semester } = action.payload;
        // update selectedCourses
        state.selectedCourses[semester] = state.selectedCourses[semester]
          .filter(course => !courses.includes(course.courseCode));
        if (semester !== CURRENT_SEMESTER) return;
        // update currentClasses
        state.currentClasses = state.currentClasses
          .filter(clas => !courses.includes(clas.subject_code));
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(deleteSemester.pending, (state, action) => {
        Taro.showToast({ icon: 'loading', title: '删除中...' })
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        delete state.selectedCourses[action.payload];
      })
  },
})

// Action creators are generated for each case reducer function
export const { getAvailableCourse, getClickedCourse, toggleDisplayDetail, updateClashes } = courseSlice.actions

export default courseSlice.reducer