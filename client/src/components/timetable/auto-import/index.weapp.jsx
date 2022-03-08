import React, { useState, memo, useEffect } from "react";
import Taro, { startAccelerometer } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { AtFloatLayout, AtList, AtListItem, AtButton, AtInput } from "taro-ui";
import "./index.less";
import { setShowAutoImport } from "../../../features/course-slice";
import { CURRENT_SEMESTER } from "../../../utils/constant";
import { autoImportTimetable, fetchSelectedCourses } from "../../../services/course";
import { TIMETABLE_SUBSCRIBE_LINK_REGEX } from "../../../utils/constant";

import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtIcon,
} from "taro-ui";

export default function AutoImport(props) {
  const { showAutoImport } = useSelector((state) => state.course);
  const [linkInput, setLinkInput] = useState(false);
  const [link, setLink] = useState("");
  const { currentClasses } = useSelector((state) => state.course);
  const dispatch = useDispatch();

  const handleClipboardData = () => {
    Taro.getClipboardData({
      success: function(res) {
        if (res.data != "") {
          if (res.data.match(TIMETABLE_SUBSCRIBE_LINK_REGEX) != null) {
            setLink(res.data);
          }
        }
      },
    });
  }

  /**
   * 用户点击“输入课表链接”时的回调函数。
   * 如果用户有添加过课程，则会提示覆盖，如果没添加过，什么都不提示
   */
  const handleImport = () => {
    // 如果用户有重新选择过课程
    if (currentClasses.length > 0) {
      Taro.showModal({
        title: "温馨提示",
        content:
          "重新输入将会覆盖原有的课表信息(颜色，课程)。请问确定要重新导入吗？",
        confirmText: "确定",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            // 读取剪贴板内容
            // 如果格式符合要求，自动为用户粘贴
            setLinkInput(true);
            handleClipboardData()
          }
        },
      });
    } else {
      // 读取剪贴板内容
            // 如果格式符合要求，自动为用户粘贴
      setLinkInput(true);
      handleClipboardData()
    }
  };

  return (
    <View>
      <AtFloatLayout
        isOpened={showAutoImport}
        title="课表导入"
        onClose={() => dispatch(setShowAutoImport(false))}
      >
        <AtList>
          <AtListItem 
            title="所在学期" 
            note={CURRENT_SEMESTER} 
            iconInfo={{size: 18, color: '#7A86B1', value: 'alert-circle',}}
            onClick={()=>{
              Taro.showToast({
                title: '所在学期默认为当前学期哦～',
                icon: 'none',
                duration: 2000,
              })
            }}
          />
          <AtListItem 
            title="课程颜色" 
            note={"生成对应科目数量的随机颜色"}
            iconInfo={{size: 18, color: '#7A86B1', value: 'alert-circle',}}
            onClick={()=>{
              Taro.showToast({
                title: '信息提醒，不可更改哦～',
                icon: 'none',
                duration: 2000,
              })
            }}
          />
          <AtListItem
            title="输入课表链接"
            note={
              <View class="link-reference">
                <View class="link-reference-inner" onClick={handleImport}>
                  <Text>{link == "" ? "未使用课表链接" : link}</Text>
                  <AtIcon
                    prefixClass="icon"
                    value="add_link"
                    size="18"
                  ></AtIcon>
                </View>
                <View class="link-reset">
                  <AtIcon
                    prefixClass="icon"
                    value="reload"
                    size="16"
                    onClick={() => {
                      if (link != "") {
                        Taro.showModal({
                          title: "温馨提示",
                          content: "已输入链接，请问是否要撤销？～",
                          confirmText: "确定",
                          cancelText: "取消",
                          success: (res) => {
                            if (res.confirm) {
                              setLink("");
                            }
                          },
                        });
                      }
                    }}
                  ></AtIcon>
                </View>
              </View>
            }
          />  
        </AtList>
        <View className="at-row">
          <AtButton
            className="delete-session-btn opt-btn"
            type="secondary"
            size="small"
            onClick={() => dispatch(setShowAutoImport(false))}
          >
            取消
          </AtButton>
          <AtButton
            className="opt-btn"
            type="primary"
            size="small"
            onClick={() => dispatch(setShowAutoImport(false))}
          >
            确认
          </AtButton>
        </View>
      </AtFloatLayout>
      <AtModal isOpened={linkInput} onClose={() => setLinkInput(false)}>
        <AtModalHeader>输入链接</AtModalHeader>
        <AtModalContent>
          {linkInput && (
            <AtInput
              name="value1"
              placeholder="请输入链接"
              value={link}
              onChange={(value, event) => setLink(value)}
            ></AtInput>
          )}
        </AtModalContent>
        <AtModalAction>
          <AtButton
            full
            size="small"
            onClick={() => {
              setLinkInput(false);
            }}
          >
            取消
          </AtButton>
          <AtButton
            full
            type="primary"
            size="small"
            onClick={() => {
              if (link.match(TIMETABLE_SUBSCRIBE_LINK_REGEX) == null) {
                Taro.showModal({
                  title: "温馨提示",
                  content: "您的导入链接看起来有点问题呀～是否查看教程？",
                  success: (res) => {
                    if (res.confirm) {
                      // 跳转公众号
                    }
                  },
                  confirmText: "查看教程",
                  cancelText: "再试一次"
                })
                return
              }
              dispatch(
                autoImportTimetable({
                  timetableLink: link,
                })
              );
              // 刷新课程
              dispatch(fetchSelectedCourses())
              setLinkInput(false);
            }}
          >
            导入
          </AtButton>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
