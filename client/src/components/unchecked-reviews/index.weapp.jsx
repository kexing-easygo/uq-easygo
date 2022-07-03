import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCard, AtButton } from "taro-ui";
import "./index.less";
import {
  markReviewAsPassed,
  markReviewAsFailed
} from "../../services/checkReviews";
import { useDispatch } from "react-redux";
export default function UncheckedList(props) {
  const {
    review_id,
    courseCode,
    postDate,
    postTime,
    content,
    openid
  } = props.review;
  const dispatch = useDispatch();
  const handleNotPass = () => {
    dispatch(
      markReviewAsFailed({
        courseCode: courseCode,
        review_id: review_id,
        openid: openid
      })
    );
  };

  const handlePass = isBonus => {
    dispatch(
      markReviewAsPassed({
        courseCode: courseCode,
        review_id: review_id,
        openid: openid,
        isBonus: isBonus
      })
    );
  };

  return (
    <AtCard
      title={`${courseCode} ${postDate} ${postTime}`}
      className="uncheckedReview"
    >
      <View className="uncheckedReview__content">{content}</View>
      <View className="uncheckedReview__buttons">
        <AtButton
          onClick={() => {
            handlePass(true);
          }}
          size="small"
          type="primary"
        >
          Bonus
        </AtButton>
        <AtButton
          onClick={() => {
            handlePass(false);
          }}
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
