import React, { useState } from "react";
import { View } from "@tarojs/components";
import { AtList, AtSwitch } from "taro-ui";
import NavBar from "../../components/navbar";
import { useDispatch, useSelector } from "react-redux";
import "./index.less";
import { manageCards } from "../../services/profile";
import { BRANCH_NAME } from "../../utils/constant";

export default function CardManagement() {
  const dispatch = useDispatch();
  const { loginStatus } = useSelector(state => state.user);
  const {
    newActivities,
    todayClasses,
    recentAssignments,
    librarySeats
  } = useSelector(state => state.user.cardsInfo);

  return (
    <View className="">
      <NavBar title="卡片管理" backIcon />

      <AtList>
        <AtSwitch
          disabled={!loginStatus}
          title="今日课程"
          checked={todayClasses}
          onChange={value => dispatch(manageCards({ todayClasses: value }))}
        />
        <AtSwitch
          disabled={!loginStatus}
          title="最近的Due"
          checked={recentAssignments}
          onChange={value =>
            dispatch(manageCards({ recentAssignments: value }))
          }
        />
        <AtSwitch
          disabled={!loginStatus}
          title="最新活动"
          checked={newActivities}
          onChange={value => dispatch(manageCards({ newActivities: value }))}
        />
        {BRANCH_NAME === "UQ" && (
          <AtSwitch
            disabled={!loginStatus}
            title="图书馆座位概览"
            checked={librarySeats}
            onChange={value => dispatch(manageCards({ librarySeats: value }))}
          />
        )}
      </AtList>

      <View className="info-text center-text">
        {loginStatus
          ? "管理首页显示的卡片3"
          : "登录后可自定义首页卡片的显示/隐藏"}
      </View>
    </View>
  );
}
