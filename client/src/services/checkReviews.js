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
// export const fetchUncheckedReviews = async () => {
//     const res = await callCloud('review', 'getAllUncheckedReview', {});   
//     return res.result
// }

export const markReviewAsPassed = createAsyncThunk(
  'review/markReviewAsPassed',
  async (param) => {
    const {
      openid,
      review_id,
      courseCode
    } = param
    const res = await callCloud('review', 'markReviewAsPassed', {
      openid: openid,
      review_id: review_id,
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
