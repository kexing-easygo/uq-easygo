import { createAsyncThunk } from "@reduxjs/toolkit";
import { callCloud } from "../utils/cloud";
import { getLocalOpenId } from "./login";

// 获取热搜课程
export const fetchHotResearches = createAsyncThunk(
  "review/fetchHotResearches",
  async param => {
    const res = await callCloud("review", "topSearch", param);
    return res.result === null ? [] : res.result;
  }
);

// 获取课程信息
// export const fetchCourseInfo = createAsyncThunk(
//   'review/fetchCourseInfo',
//   async (param) => {
//     const res = await callCloud('review', 'getCourseDetail', param);
//     return res.result
//   }
// )

// 获取课评
export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async param => {
    try {
      const res = await callCloud("review", "getAllPassReview", param);
      const res2 = await callCloud("review", "getCourseDetail", param);
      const courseDetails = res2.result;
      const open_id = await getLocalOpenId();
      // 0-所有评论 1-小图标评论总数 2-已评论的小图标 3-赞过的课评 review id
      let result = [[], [], 4, [], courseDetails];
      result[0] = res.result.reviews;
      for (let i = 0; i < 4; i++) {
        result[1].push(res.result.dimensions[i].length);
        for (let q = 0; q < res.result.dimensions[i].length; q++) {
          if (res.result.dimensions[i][q] == open_id) {
            result[2] = i;
          }
        }
      }
      for (let i = 0; i < res.result.reviews.length; i++) {
        if (res.result.reviews[i].likes.indexOf(open_id) != -1) {
          result[3].push(res.result.reviews[i].review_id);
        }
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
);

// 删除课评
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async param => {
    const res = await callCloud("review", "deleteReview", param);
    return param.reviewId;
  }
);

// 添加课评
export const addReview = createAsyncThunk("review/addReview", async param => {
  const newParam = {
    openid: await getLocalOpenId(),
    ...param
  };
  const res = await callCloud("review", "addReview", { reviewObj: newParam });
  return res.result;
});

// 修改课评
export const updateReview = createAsyncThunk(
  "review/updateReview",
  async param => {
    const res = await callCloud("review", "updateReview", param);
    const result = [param.reviewId, res.result];
    return result;
  }
);

// 添加小图标评论
export const addReviewDimensions = createAsyncThunk(
  "review/addReviewDimensions",
  async param => {
    const newParam = {
      openid: await getLocalOpenId(),
      ...param
    };
    const res = await callCloud("review", "updateReviewDimensions", newParam);
    return newParam.dimensionIndex;
  }
);

// 点赞
export const updateLikes = createAsyncThunk(
  "review/updateLikes",
  async param => {
    const newParam = {
      likes: await getLocalOpenId(),
      ...param
    };
    const res = await callCloud("review", "updateLikes", newParam);
    const result = {
      openid: newParam.likes,
      reviewID: param.reviewId
    };
    return result;
  }
);

// 获取追评
export const fetchSubReviews = createAsyncThunk(
  "review/fetchSubReviews",
  async param => {
    const res = await callCloud("review", "getAllSubReview", param);
    return res.result;
  }
);

// 添加追评
export const addSubReview = createAsyncThunk(
  "review/addSubReview",
  async param => {
    const res = await callCloud("review", "addSubReview", param);
    return res.result;
  }
);

// 删除追评
export const deleteSubReview = createAsyncThunk(
  "review/deleteSubReview",
  async param => {
    const res = await callCloud("review", "deleteSubReview", param);
    return param.subReviewId;
  }
);

// 修改追评
export const updateSubReview = createAsyncThunk(
  "review/updateSubReview",
  async param => {
    const res = await callCloud("review", "updateSubReview", param);
    const result = [param.subReviewId, res.result];
    return result;
  }
);

// search relevent courses
export const searchCourses = createAsyncThunk(
  "review/searchCourses",
  async param => {
    const res = await callCloud("review", "getAllReviewRegex", param);
    let courseCode = [];
    if (res.result.length == 0) {
      return [];
    } else {
      for (var key in res.result) {
        courseCode.push(res.result[key].academic_detail.unit_code);
      }
      return courseCode;
    }
  }
);