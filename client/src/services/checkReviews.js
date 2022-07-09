import {
  createAsyncThunk
} from '@reduxjs/toolkit'
import {
  callCloud
} from '../utils/cloud'
import {
  getLocalOpenId
} from "./login";

export const fetchUncheckedReviews = createAsyncThunk(
  'review/getAllUncheckedReview',
  async (param) => {
    const res = await callCloud('review', 'getAllUncheckedReview', param);
    return res.result
  }
)


export const markReviewAsPassed = createAsyncThunk(
  'review/markReviewAsPassed',
  async (param) => {
    const {
      openid,
      review_id,
      courseCode,
      isBonus
    } = param
    await callCloud('review', 'markReviewAsPassed', {
      openid: openid,
      review_id: review_id,
      isBonus: isBonus
    })
    return [courseCode, review_id]
  }
)

export const markReviewAsFailed = createAsyncThunk(
  'review, markReviewAsFailed',
  async (param) => {
    const {
      openid,
      review_id,
      courseCode
    } = param
    await callCloud('review', 'markReviewAsFailed', {
      openid: openid,
      review_id: review_id,
    })

    return [courseCode, review_id]
  }
)

//获得所有课程的所有追评（不提供固定课号）
export const fetchAllSubReviews = createAsyncThunk(
  'review/fetchAllSubReviews',
  async (param) => {
    const res = await callCloud('review', 'fetchAllSubReviews',param);
    return res.result
  }
)

export const markSubReviewAsPassed = createAsyncThunk(
  'review/markSubReviewAsPassed',
  async (param) => {
    const {
      mainReview_id,
      review_id,
    } = param
    await callCloud('review', 'markSubReviewAsPassed', {
      review_id: review_id,
      mainReview_id:mainReview_id
    })
    return review_id
  }
)

export const markSubReviewAsFailed = createAsyncThunk(
  'review/markSubReviewAsFailed',
  async (param) => {
    const {
      mainReview_id,
      review_id,
    } = param
    console.log(review_id)
    const res = await callCloud('review', 'markSubReviewAsFailed', {
      review_id: review_id,
      mainReview_id:mainReview_id
    })
    console.log(res)
    return review_id
  }
)
