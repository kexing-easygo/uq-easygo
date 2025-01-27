import Taro from "@tarojs/taro";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentClasses,
  appendClass,
  deleteClass,
  updateClass,
  fetchSelectedCourses,
  deleteCourses,
  deleteSemester
} from "../services/course";
import {
  fetchCurrentSemester,
  updateCurrentSemester,
  autoImportTimetable
} from "../services/course";
import { computeAvailableCourses, computeClashCourses } from "../utils/courses";
import {
  SEMESTERS,
  CURRENT_SEMESTER,
  SEMESTER_START_DATE,
  SEMESTER_WEEKS,
  WEEKS_NO,
  START_DATE
} from "../utils/constant";

// 初始化状态
// 开始周默认为summer
const initialState = {
  selectedCourses: {},
  currentClasses: [],
  availCourses: [],
  clickedClass: {},
  clashCourses: [],
  displayDetail: false,
  managementClickedClass: {},
  currentSemester: CURRENT_SEMESTER,
  weeksNo: WEEKS_NO,
  startDate: START_DATE,
  // 课表一键导入窗口
  showAutoImport: false,
  showClassNotifyWindow: false
};

// 创建action
export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // 获取到所有课程后根据活跃日期计算当周有效课程
    getAvailableCourse: (state, action) => {
      const { currentClasses, dates } = action.payload;
      state.availCourses = computeAvailableCourses(currentClasses, dates);
    },
    // 即将展示在SessionDetail中的课程
    getClickedCourse: (state, action) => {
      state.clickedClass = action.payload;
      state.displayDetail = true;
    },
    // 是否显示ActionSheet
    toggleDisplayDetail: state => {
      state.displayDetail = false;
    },
    // 当课程出现增删时需要重新计算冲突课程
    updateClashes: (state, action) => {
      state.clashCourses = computeClashCourses(action.payload);
    },
    setManagementClickedClass: (state, action) => {
      state.managementClickedClass = action.payload;
    },
    setCurrentSemester: (state, action) => {
      state.currentSemester = action.payload;
      state.weeksNo = SEMESTER_WEEKS;
      state.startDate = SEMESTER_START_DATE;
      // console.log("现在的学期是:::", state.currentSemester)
      // if (action.payload === SEMESTERS[0]) {
      //   state.weeksNo = SUMMER_WEEKS
      //   state.startDate = SUMMER_START_DATE
      // } else if (action.payload == SEMESTERS[1]) {

      // }
    },
    setWeeksNo: (state, action) => {
      state.weeksNo = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setSelectedCourses: (state, action) => {
      const { sem, code, info } = action.payload;
      const index = state.selectedCourses[sem].findIndex(
        c => c.courseCode === code
      );
      if (index !== -1) {
        state.selectedCourses[sem][index].results = info;
      }
    },
    setShowAutoImport: (state, action) => {
      state.showAutoImport = action.payload;
    },
    setClassNotifyWindow: (state, action) => {
      console.log(action.payload);
      state.showClassNotifyWindow = action.payload;
    }
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchSelectedCourses.fulfilled, (state, action) => {
        state.selectedCourses = action.payload;
      })
      // 获取本学期已选择的课程
      .addCase(fetchCurrentClasses.fulfilled, (state, action) => {
        state.currentClasses = action.payload;
        console.log("fetch selected courses fulfilled", action.payload);
      })
      // 添加课程
      .addCase(appendClass.pending, () => {
        Taro.showToast({ icon: "loading", title: "添加中" });
      })
      .addCase(appendClass.rejected, (state, action) => {
        console.log(action.error.message);
        Taro.showToast({ title: "添加出错", icon: "error" });
      })
      .addCase(appendClass.fulfilled, (state, action) => {
        state.currentClasses.push(...action.payload);
        Taro.showToast({ title: "添加完毕", icon: "success" });
      })
      // 修改课程设置
      .addCase(updateClass.pending, () => {
        Taro.showToast({ icon: "loading", title: "修改中" });
      })
      .addCase(updateClass.rejected, (state, action) => {
        Taro.showToast({ title: "修改失败", icon: "error" });
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const target = state.currentClasses.find(
          cl => cl._id === action.payload._id
        );
        target.background = action.payload.background;
        target.remark = action.payload.remark;
        Taro.showToast({ title: "修改成功", icon: "success" });
      })
      // 删除class
      .addCase(deleteClass.pending, () => {
        Taro.showToast({ icon: "loading", title: "删除中..." });
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.currentClasses = state.currentClasses.filter(
          cl => cl._id !== action.payload
        );
        Taro.showToast({ title: "删除成功", icon: "none" });
      })
      .addCase(deleteClass.rejected, (state, action) => {
        Taro.showToast({ title: "删除失败", icon: "error" });
      })
      .addCase(deleteCourses.pending, () => {
        Taro.showToast({ icon: "loading", title: "删除中..." });
      })
      .addCase(deleteCourses.fulfilled, (state, action) => {
        const { courses, semester } = action.payload;
        // update selectedCourses
        state.selectedCourses[semester] = state.selectedCourses[
          semester
        ].filter(course => !courses.includes(course.courseCode));
        // if (semester !== CURRENT_SEMESTER) return;
        if (semester !== state.currentSemester) return;
        // update currentClasses
        state.currentClasses = state.currentClasses.filter(
          clas => !courses.includes(clas.subject_code)
        );
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        console.log(action.error.message);
        Taro.showToast({ title: "更新失败", icon: "error" });
      })
      .addCase(deleteSemester.pending, (state, action) => {
        Taro.showToast({ icon: "loading", title: "删除中..." });
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        delete state.selectedCourses[action.payload];
      })
      .addCase(fetchCurrentSemester.fulfilled, (state, action) => {
        state.currentSemester = action.payload;
        // if (action.payload === SEMESTERS[0]) {
        //   state.weeksNo = SUMMER_WEEKS
        //   state.startDate = SUMMER_START_DATE
        // } else if (action.payload == SEMESTERS[1]) {
        //   state.weeksNo = SEMESTER_WEEKS
        //   state.startDate = SEMESTER_START_DATE
        // }
        state.weeksNo = SEMESTER_WEEKS;
        state.startDate = SEMESTER_START_DATE;
      })
      .addCase(fetchCurrentSemester.rejected, (state, action) => {
        Taro.showToast({ title: "获取失败", icon: "error" });
        state.currentSemester = SEMESTERS[0];
      })
      .addCase(updateCurrentSemester.pending, (state, action) => {
        Taro.showToast({ icon: "loading", title: "更改中..." });
      })
      .addCase(updateCurrentSemester.fulfilled, (state, action) => {
        state.currentSemester = action.payload;
        // if (action.payload === SEMESTERS[0]) {
        //   state.weeksNo = SUMMER_WEEKS
        //   state.startDate = SUMMER_START_DATE
        // } else if (action.payload == SEMESTERS[1]) {
        //   state.weeksNo = SEMESTER_WEEKS
        //   state.startDate = SEMESTER_START_DATE
        // }
        state.weeksNo = SEMESTER_WEEKS;
        state.startDate = SEMESTER_START_DATE;
      })
      .addCase(updateCurrentSemester.rejected, (state, action) => {
        Taro.showToast({ title: "更新失败", icon: "error" });
      })
      .addCase(autoImportTimetable.pending, () => {
        Taro.showLoading({ title: "正在导入", icon: "loading" });
      })
      .addCase(autoImportTimetable.fulfilled, (state, action) => {
        Object.assign(state.selectedCourses, action.payload);
        Taro.hideLoading();
        Taro.showToast({ title: "导入成功", icon: "success" });
        Taro.startPullDownRefresh();
        Taro.stopPullDownRefresh();
      })
      .addCase(autoImportTimetable.rejected, () => {
        Taro.showToast({ title: "导入失败", icon: "error" });
      });
  }
});

// Action creators are generated for each case reducer function
export const {
  getAvailableCourse,
  getClickedCourse,
  toggleDisplayDetail,
  updateClashes
} = courseSlice.actions;
export const {
  setManagementClickedClass,
  setCurrentSemester,
  setWeeksNo,
  setStartDate,
  setSelectedCourses,
  setShowAutoImport
} = courseSlice.actions;
export const { setClassNotifyWindow } = courseSlice.actions;
export default courseSlice.reducer;
