import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import NavBar from "../../components/navbar";
import "./index.less";
import { fetchSubReviews } from "../../services/review";
import { useDispatch, useSelector } from "react-redux";
import UncheckedList from "../../components/unchecked-subReviews";
import {
  fetchAllSubReviews
} from "../../services/checkReviews";

export default function CheckSubReviews() {
    const dispatch = useDispatch();
    const { allSubReviews } = useSelector(state => state.review);

    useEffect(() => {
      // dispatch(fetchSubReviews());
      dispatch(fetchAllSubReviews());
    }, []);
  
    return (
      <View className="">
        {console.log(allSubReviews)}
        <NavBar title="追评审查" backIcon />
        {allSubReviews.map(data=>{
          return data.checked== "pending" &&  <UncheckedList review={{postDate:data.postDate,  postTime:data.postTime,content:data.content,review_id:data.review_id,mainReview_id:data.mainReview_id,mainReview_content:data.mainReview_content}}/>
        })}
  
      </View>
    );
  }