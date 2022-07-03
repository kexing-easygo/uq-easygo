import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import NavBar from "../../components/navbar";
import "./index.less";
import UncheckedList from "../../components/unchecked-reviews";
import { fetchUncheckedReviews } from "../../services/checkReviews";
import { useDispatch, useSelector } from "react-redux";

export default function CheckReviews() {
  const dispatch = useDispatch();
  const { uncheckedReviews } = useSelector(state => state.review);
  // const [reviews, setReviews] = useState([])
  useEffect(() => {
    dispatch(fetchUncheckedReviews());
    // setReviews(uncheckedReviews)
  }, []);

  return (
    <View className="">
      <NavBar title="课评审查" backIcon />
      <View className="info-text center-text">
        你还有{uncheckedReviews.length}个未处理的审核
      </View>

      <View className="uncheckedReviews">
        {uncheckedReviews.map(data => {
          return <UncheckedList review={data} />;
        })}
      </View>

      <View className="info-text center-text">课评</View>
    </View>
  );
}
