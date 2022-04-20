import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchHotResearches,  fetchCourseInfo, addReviewDimensions } from '../services/review'
import { fetchReviews, deleteReview, addReview, updateReview } from '../services/review'
import { fetchSubReviews, addSubReview ,updateSubReview, deleteSubReview } from '../services/review'
import { fetchUncheckedReviews, markReviewAsFailed, markReviewAsPassed } from "../services/checkReviews";
import { updateLikes } from '../services/review'
import { REVIEW_CHECKED_TEMPLATE_ID } from "../config.json";

const initialState = {
  hotCourses: [], // 热搜课程编号
  searchedCourse: '', // 搜索的课程编号
  courseInfo: {}, // 课程信息
  dimensions: [], //  好过, 好难， 好7， 运气 各自总数
  reviewedIcon: 4, // 评论过的小图标
  clickedIconReview: '', // 点击的小图标
  reviews: [], // 课评
  clickedReview: {}, // 点击的课评
  editModal: false, // 课评修改模式
  likesReviews: [], // 赞过的课评 元素是review Id
  subReviews:[], // 追评
  editSubReview: false, // 追评修改模式
  clickedSubReview: {}, // 点击的追评
  turnPage: [], // 判断 是否全都获取到 课程信息, 课评,
  uncheckedReviews: [] 
}

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // 设置搜索的课程代码
    setSearchedCourse: (state, action) => {
      state.searchedCourse = action.payload
    },
    // 设置点击的课评
    setClickedReview: (state, action) => {
      state.clickedReview = action.payload
    },
    // 未评论时 点击的小图标
    setClickedIconReview: (state, action) => {
      state.clickedIconReview = action.payload
    },
     // 设置课评修改模式
     setEditModal: (state, action) => {
      state.editModal = action.payload;
    }, 
    // 设置追评修改模式
    // 设置追评修改模式
    setSubReviewEdit: (state, action) => {
      state.editSubReview = action.payload;
    },
    // 设置点击的追评
    setClickedSubReview: (state, action) => {
      state.clickedSubReview = action.payload;
    },
    // 清空 页面跳转条件 -- 获取课程信息, 课评 
    setTurnPage: (state, action) => {
      state.turnPage = [];
    },
    // 回复追评
    setReplySubReview: (state, action) => {
      state.replySubReview = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取热搜课程
      .addCase(fetchHotResearches.pending, () => {
        Taro.showToast({ title: '加载热搜课程中', icon: 'loading', mask: true})
      })
      .addCase(fetchHotResearches.fulfilled, (state, action) => {
        state.hotCourses = action.payload
      })
      // 获取课评
      .addCase(fetchReviews.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload[0];
        state.dimensions = action.payload[1];
        state.reviewedIcon = action.payload[2];
        state.likesReviews = action.payload[3];
        state.courseInfo = action.payload[4];
        Taro.navigateTo({
          url: "/pages/review-result/index"
        })
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        Taro.showToast({ title: '暂时没有这门课哦', icon: 'none' })
      })
      // 添加课评
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload)
        Taro.showModal({
          title: "发表通知",
          content: "您的评论已经发表，正在交由后台审核。",
          complete: () => {
            Taro.requestSubscribeMessage({
              tmplIds: [REVIEW_CHECKED_TEMPLATE_ID],
              success: (res) => {
                
              }
            })
          }
        })
        
      })
      .addCase(addReview.rejected, () => {
        Taro.showToast({ title: '添加课评时出错了', icon: 'none' })
      })
      // 删除课评
      .addCase(deleteReview.fulfilled, (state, action) => {
        for (let i=0; i<state.reviews.length; i++) {
          if (state.reviews[i].review_id == action.payload) {
            state.reviews.splice(i, 1);
        }}
        Taro.showToast({ title: '删除成功', icon: 'none' })
      })
      .addCase(deleteReview.rejected, () => {
        Taro.showToast({ title: '删除课评时出错了', icon: 'none' })
      })
      // 修改课评
      .addCase(updateReview.fulfilled, (state, action) => {
        for (let i=0; i<state.reviews.length; i++) {
          if (state.reviews[i].review_id == action.payload[0]) {
            state.reviews.splice(i, 1);
        }}
        Taro.showToast({ title: '修改成功', icon: 'success' });
        state.reviews.unshift(action.payload[1]);
      })
      .addCase(updateReview.rejected, () => {
        Taro.showToast({ title: '修改课评时出错了', icon: 'none' })
      })
      // 添加小图标评论
      .addCase(addReviewDimensions.fulfilled, (state, action) => {
        state.reviewedIcon = action.payload
        state.dimensions[action.payload] ++;
      })
      .addCase(addReviewDimensions.rejected, () => {
        Taro.showToast({ title: '添加评论时出错了', icon: 'none' })
      })

      // 点赞 
      .addCase(updateLikes.fulfilled, (state, action) => {
        // 更新课评界面 小图标样式
        state.likesReviews.push(action.payload.reviewID)
        // 更新课评界面 点赞数
        for (let i=0; i<state.reviews.length; i++) {
          if (state.reviews[i].review_id == action.payload.reviewID) {
            state.reviews[i].likes.push(action.payload.openid);
        }}
        // 更新追评界面 点赞数
        if (state.clickedReview.review_id == action.payload.reviewID) {
          state.clickedReview.likes.push(action.payload.openid)
        }
      })
      .addCase(updateLikes.rejected, () => {
        // Taro.showToast({ title: '添加评论时出错了', icon: 'none' })
      })
      .addCase(updateLikes.pending, () => {
        // Taro.showToast({ title: '评论中', icon: 'loading' })
      })
      // 获取追评
      .addCase(fetchSubReviews.fulfilled, (state, action) => {
        state.subReviews = action.payload
        Taro.navigateTo({ url: '/pages/double-review/index'});
      })
      .addCase(fetchSubReviews.rejected, () => {
       Taro.showToast({ title: '获取追评时出错了', icon: 'none' })
      })
      .addCase(fetchSubReviews.pending, () => {
        Taro.showToast({ title: '搜索中', icon: 'loading'})
      })
      // 增加追评
      .addCase(addSubReview.fulfilled, (state, action) => {
        state.subReviews.unshift(action.payload)
        // review-result页面 评论数+1
        for (let i=0; i<state.reviews.length; i++) {
          if (state.reviews[i].review_id == state.clickedReview.review_id) {
            state.reviews[i].numOfComments++;
        }}
        // double-review页面 评论数+1
        state.clickedReview.numOfComments++;
        Taro.showToast({ title: '添加成功', icon: 'none' })
      })
      .addCase(addSubReview.rejected, () => {
        Taro.showToast({ title: '添加追评时出错了', icon: 'none' })
      })
      .addCase(addSubReview.pending, () => {
        // Taro.showToast({ title: '搜索中', icon: 'loading' })
      })
      // 删除追评
      .addCase(deleteSubReview.pending, () => {
        // Taro.showToast({ title: '删除中', icon: 'loading' })
      })
      .addCase(deleteSubReview.fulfilled, (state, action) => {
        // 删除追评
        for (let i=0; i<state.subReviews.length; i++) {
          if (state.subReviews[i].review_id == action.payload) {
            state.subReviews.splice(i, 1);
        }}
        // review-result页面 评论数-1
        for (let i=0; i<state.reviews.length; i++) {
          if (state.reviews[i].review_id == state.clickedReview.review_id) {
            state.reviews[i].numOfComments--;
        }}
        // double-review页面 评论数-1
        state.clickedReview.numOfComments--;
        Taro.showToast({ title: '删除成功', icon: 'none' })
      })
      .addCase(deleteSubReview.rejected, () => {
        Taro.showToast({ title: '删除追评时出错了', icon: 'none' })
      })
      // 修改追评
      .addCase(updateSubReview.pending, () => {
        // Taro.showToast({ title: '修改中', icon: 'loading' })
      })
      .addCase(updateSubReview.fulfilled, (state, action) => {
        for (let i=0; i<state.subReviews.length; i++) {
          if (state.subReviews[i].review_id == action.payload[0]) {
            state.subReviews.splice(i, 1);
        }}
        state.subReviews.unshift(action.payload[1])
        Taro.showToast({ title: '修改成功', icon: 'none' })
      })
      .addCase(updateSubReview.rejected, () => {
        Taro.showToast({ title: '修改追评时出错了', icon: 'none' })
      })
      .addCase(fetchUncheckedReviews.pending, () => {
        Taro.showToast({ title: '拉取中', icon: 'loading' })
      }) 
      .addCase(fetchUncheckedReviews.fulfilled, (state, action) => {
        state.uncheckedReviews = action.payload
        console.log("payload :::", action.payload)
        Taro.showToast({ title: '拉取成功', icon: 'success' })
      })
      .addCase(markReviewAsPassed.fulfilled, (state, action) => {
        const courseCode = action.payload[0]
        const review_id = action.payload[1]
        const index = state.uncheckedReviews.findIndex(c => c.courseCode == courseCode && c.review_id == review_id)
        state.uncheckedReviews.splice(index, 1)
        Taro.showToast({ title: '通过成功', icon: 'success' })
      })
      .addCase(markReviewAsFailed.fulfilled, (state, action) => {
        const courseCode = action.payload[0]
        const review_id = action.payload[1]
        const index = state.uncheckedReviews.findIndex(c => c.courseCode == courseCode && c.review_id == review_id)
        state.uncheckedReviews.splice(index, 1)
        Taro.showToast({ title: '不通过成功', icon: 'success' })
      })
}})

export const { setSearchedCourse, setClickedReview, setClickedIconReview } = reviewSlice.actions
export const { setEditModal, setSubReviewEdit, setClickedSubReview } = reviewSlice.actions
export const { setTurnPage, setReplySubReview } = reviewSlice.actions
export default reviewSlice.reducer