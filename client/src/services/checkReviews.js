import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'
import { getLocalOpenId } from "./login";

// export const fetchUncheckedReviews = createAsyncThunk(
//     'review/getAllUncheckedReview',
//     async (param) => {
//         const res = await callCloud('review', 'getAllUncheckedReview', param);
//         console.log(res.result)
//         if (res.result == null) {
//             return res.result
//         }
//         result = res.result
//         return result
//     }
// )
export const fetchUncheckedReviews = async () => {
    const res = await callCloud('review', 'getAllUncheckedReview', {});   
    return res.result
}

export const markReviewAsPassed = async(param) =>{
    const {courseCode, review_id} = param
    const res = await callCloud('review','markReviewAsPassed', {
        courseCode:courseCode,
        review_id:review_id,
    })
    return res.result
}

export const markReviewAsFailed = async(param) =>{
    const {courseCode, review_id} = param
    const res = await callCloud('review','markReviewAsFailed', {
        courseCode:courseCode,
        review_id:review_id,
    })

    return res.result
}


