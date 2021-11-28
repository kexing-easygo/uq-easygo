import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchAssessments } from '../services/calculator'
// 初始化状态
const initialState = {
  assessments: [],
  clickedAss: '',
  searchedCourse: '',
  showModal: false,
}

// 创建action
export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setSearchedCourse: (state, action) => {
      state.searchedCourse = action.payload;
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
      if (Number.isNaN(percent)) percent = 0;
      const newAss = Object.assign({}, targetAss, { 'percent': percent });
      state.assessments[state.clickedAss] = newAss;
    }
  },
  extraReducers: (builer) =>
    builer
      .addCase(fetchAssessments.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      .addCase(fetchAssessments.rejected, () => {
        Taro.showToast({ title: '出错了', icon: 'none' })
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        if (action.payload.code === -2) {
          Taro.showToast({
            title: "本学期未开设该课程哦",
            icon: "none",
          })
        } else if (action.payload.code === -1) {
          Taro.showToast({
            title: "该课程不存在",
            icon: "none",
          })
        } else {
          state.assessments = action.payload;
          Taro.navigateTo({ url: '/pages/calculator-result/index' });
        }
      })
})

// Action creators are generated for each case reducer function
export const { setClickedAss, toggleModal, addScore, addTotalScore, calcPercent, setSearchedCourse } = calculatorSlice.actions

export default calculatorSlice.reducer