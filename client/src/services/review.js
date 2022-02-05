import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'
import { getLocalOpenId } from "../services/login";
const FAKE_COURSES = [
  "CSSE1001", "INFS1200", "MATH1061",
  "CSSE2002", "FINM1415", "BISM1201",
  "ACCT2102", "ACCT3104", "CSSE2310", "DECO2800"
]

const FAKE_HOT_COURSES = FAKE_COURSES.map((value) => {
  return {courseCode: value}
})

const FAKE_REVIEWS = [
  {
    postDate: "2021-10-20", 
    posterName: "进击的炮灰", 
    postTime: "14:02", 
    reviewID: "1",
    dimensions: [10, 1, 2, 5],
    content: "这是啥",
    isOutstanding: "false"
  }, 
  {
    postDate: "2021-10-21", 
    posterName: "Null", 
    postTime: "15:22", 
    reviewID: "2",
    dimensions: [10, 1, 2, 5],
    content: "这又是啥",
    isOutstanding: "false"
  }, 
  {
    postDate: "2021-10-22", 
    posterName: "kaylee", 
    postTime: "16:10", 
    reviewID: "3",
    dimensions: [10, 1, 2, 5],
    content: "这特么是啥",
    isOutstanding: "false"
  }, 
]


export const fetchHotResearches = createAsyncThunk(
  'review/fetchHotResearches',
  async (param) => {
    console.log("获取热搜课程中")
    // const res = await callCloud()
    return FAKE_HOT_COURSES
  }
)

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (param) => {
    const res = await callCloud('review', 'getAllReview', param);
    return res.result
    // return FAKE_REVIEWS
  }
)

export const addReview = createAsyncThunk(
  "review/addReview",
  async (param) => {
    const res = await callCloud('review', 'addReview', {
      reviewObj: {
        posterName: "进击的炮灰", 
        dimensions: [10, 1, 2, 5],
        content: "这是啥",
        isOutstanding: false,
        courseCode: "INFO1110",
        studySemester: "Semester 1, 2021",
        mark: 7,
        sub_review: [],
        openid: await getLocalOpenId()
      }
    })
    console.log(res.result)
    return res.result
  }
)