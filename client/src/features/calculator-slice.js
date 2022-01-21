import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchAssessments, saveCourseScore, getSemesterGPA } from '../services/calculator'
import { mergeAssResult } from '../utils/assessments'
// 初始化状态
const initialState = {
  assessments: [],
  clickedAss: 0,
  searchedCourse: '',
  showModal: false,
  searchedSemester: '',
  askSave: false,
  gpa: 0
}

// 创建action
export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    getResults: (state, action) => {
      const { assessments, results } = action.payload;
      state.assessments = mergeAssResult(assessments, results);
    },
    setSearchedCourse: (state, action) => {
      state.searchedCourse = action.payload;
    },
    setSearchedSemester: (state, action) => {
      state.searchedSemester = action.payload;
    },
    setClickedAss: (state, action) => {
      state.clickedAss = action.payload;
    },
    toggleModal: (state, action) => {
      state.showModal = action.payload;
    },
    addScore: (state, action) => {
      state.assessments[state.clickedAss].score = action.payload;
    },
    addTotalScore: (state, action) => {
      state.assessments[state.clickedAss].totalScore = action.payload;
    },
    calcPercent: (state) => {
      const targetAss = state.assessments[state.clickedAss];
      let percent = parseFloat((targetAss.score / targetAss.totalScore * 100).toFixed(1));
      percent = percent > 100 ? 100 : percent
      if (Number.isNaN(percent)) percent = 0;
      const newAss = Object.assign({}, targetAss, { 'percent': percent });
      state.assessments[state.clickedAss] = newAss;
      state.askSave = true;
    },
    resetAskSave: (state, action) => {
      state.askSave = false;
    }
  },
  extraReducers: (builer) =>
    builer
      .addCase(fetchAssessments.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      // .addCase(fetchAssessments.rejected, () => {
      //   Taro.showToast({ title: '出错了', icon: 'none' })
      // })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          Taro.showToast({
            title: "本学期未开设该课程哦",
            icon: "none",
          })
          return
        } else {
          state.assessments = action.payload;
          Taro.navigateTo({ url: '/pages/calculator-result/index' });
        }
      })
      .addCase(saveCourseScore.pending, (state, action) => {
        Taro.showToast({ title: '保存中', icon: 'loading' })
      })
      .addCase(saveCourseScore.rejected, (state, action) => {
        Taro.showToast({ title: '出错了', icon: 'none' })
      })
      .addCase(saveCourseScore.fulfilled, (state, action) => {
        Taro.showToast({ title: '保存成功', icon: 'success' })
        
      })
      .addCase(getSemesterGPA.pending, (state, action) => {
        Taro.showToast({ title: '计算当前GPA', icon: 'loading', mask: true })
      })
      .addCase(getSemesterGPA.fulfilled, (state, action) => {
        state.gpa = action.payload
      })
      .addCase(getSemesterGPA.rejected, (state, action) => {
        Taro.showToast({ title: '出错了', icon: 'none' })
      })
})

// Action creators are generated for each case reducer function
export const { setClickedAss, toggleModal, addScore, addTotalScore, calcPercent, setSearchedCourse, setSearchedSemester, getResults, resetAskSave } = calculatorSlice.actions

export default calculatorSlice.reducer