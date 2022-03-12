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
      courseCode,
      review_id
    } = param
    await callCloud('review', 'markReviewAsPassed', {
      courseCode: courseCode,
      review_id: review_id,
    })
    return [courseCode, review_id]
  }
)

export const markReviewAsFailed = createAsyncThunk(
  'review, markReviewAsFailed',
  async (param) => {
    const {
      courseCode,
      review_id
    } = param
    await callCloud('review', 'markReviewAsFailed', {
      courseCode: courseCode,
      review_id: review_id,
    })

    return [courseCode, review_id]
  }
)
