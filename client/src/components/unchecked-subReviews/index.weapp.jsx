import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCard, AtButton } from "taro-ui";
import "./index.less";
import { useDispatch } from "react-redux";
import {
  markSubReviewAsPassed,
  markSubReviewAsFailed
} from "../../services/checkReviews";

export default function UncheckedList(props) {
  const {
    postDate,
    postTime,
    content,
    review_id,
    mainReview_id
  } = props.review;

  const dispatch = useDispatch();

  const handleNotPass = () => {
    dispatch(
      markSubReviewAsFailed({
        review_id: review_id,
        mainReview_id:mainReview_id
      })
    );
  };

  const handlePass = () => {
    dispatch(
      markSubReviewAsPassed({
        review_id: review_id,
        mainReview_id:mainReview_id
      })
    );
  };

  return (
    <AtCard
      title={` ${postDate} ${postTime}`}
      className="uncheckedReview"
    >
      <View className="uncheckedReview__content">{content}</View>
      <View className="uncheckedReview__buttons">
        <AtButton
          onClick={handlePass}
          size="small"
          type="secondary"
        >
          通过
        </AtButton>
        <AtButton onClick={handleNotPass} size="small" type="secondary">
          未通过
        </AtButton>
      </View>
    </AtCard>
  );
}
