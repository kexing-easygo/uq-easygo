import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtActionSheet, AtActionSheetItem, AtButton, AtSwitch } from "taro-ui";
import { useDispatch, useSelector } from "react-redux";
import "./index.less";
import { setClassNotifyWindow } from "../../../features/course-slice";
import { updateClassNotify } from "../../../services/profile";

export default function ClassNotify(props) {
  const dispatch = useDispatch();
  const { showClassNotifyWindow } = useSelector(state => state.course);
  const { classNotify } = useSelector(state => state.user);
  const [emailNotify, setEmailNotify] = useState(classNotify);

  useEffect(() => {
    setEmailNotify(classNotify)
  }, []) 

  return (
    <AtActionSheet
      className="notify-sheet"
      isOpened={showClassNotifyWindow}
      onClose={() => {
        dispatch(setClassNotifyWindow(false));
      }}
    >
      <AtActionSheetItem className="sheet-header">
        <View className="blue-block"></View>
        <Text className="title">提醒方式</Text>
      </AtActionSheetItem>

      <AtActionSheetItem className="sheet-item">
        <AtSwitch
          title="邮件提醒"
          checked={emailNotify}
          onChange={value => {
            setEmailNotify(value);
          }}
        />
      </AtActionSheetItem>
      <AtActionSheetItem>
        <View className="buttons">
          <AtButton
            size="small"
            circle={true}
            type="secondary"
            customStyle={{ border: "1px solid #6190E8" }}
            onClick={() => {
              dispatch(setClassNotifyWindow(false));
            }}
          >
            取消
          </AtButton>
          <AtButton
            size="small"
            circle={true}
            type="primary"
            onClick={() => {
              dispatch(updateClassNotify(emailNotify));
            }}
          >
            确认
          </AtButton>
        </View>
      </AtActionSheetItem>
    </AtActionSheet>
  );
}
