/**
 * 管理首页轮播图以及跳转链接
 */

import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, Button, Image } from "@tarojs/components";
import "./index.less";
import {
  AtList,
  AtListItem,
  AtInput,
  AtTextarea,
  AtButton,
  AtImagePicker
} from "taro-ui";

export default function ManageCarousel(props) {
  const dispatch = useDispatch();
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [url4, setUrl4] = useState("");
  // 轮播图四张图片的文件链接
  const [carousel1, setCarousel1] = useState([]);
  const [carousel2, setCarousel2] = useState([]);
  const [carousel3, setCarousel3] = useState([]);
  const [carousel4, setCarousel4] = useState([]);
  return (
    <View>
      <View class="title1">更换首页轮播图跳转链接</View>
      <AtInput
        name="url1"
        title="轮播图一"
        type="text"
        placeholder={url1}
        value={url1}
        onChange={setUrl1}
      >
        <AtButton
          type="secondary"
          size="normal"
          onClick={() => {
            // dispatch(updateResources({ icon1_url: url1 }));
          }}
        >
          确认修改
        </AtButton>
      </AtInput>
      <AtInput
        name="url2"
        title="轮播图二"
        type="text"
        placeholder={url2}
        value={url2}
        onChange={setUrl2}
      >
        <AtButton
          type="secondary"
          size="normal"
          onClick={() => {
            // dispatch(updateResources({ icon1_url: url1 }));
          }}
        >
          确认修改
        </AtButton>
      </AtInput>
      <AtInput
        name="url3"
        title="轮播图三"
        type="text"
        placeholder={url3}
        value={url3}
        onChange={setUrl3}
      >
        <AtButton
          type="secondary"
          size="normal"
          onClick={() => {
            // dispatch(updateResources({ icon1_url: url1 }));
          }}
        >
          确认修改
        </AtButton>
      </AtInput>
      <AtInput
        name="url4"
        title="轮播图四"
        type="text"
        placeholder={url4}
        value={url4}
        onChange={setUrl4}
      >
        <AtButton
          type="secondary"
          size="normal"
          onClick={() => {
            // dispatch(updateResources({ icon1_url: url1 }));
          }}
        >
          确认修改
        </AtButton>
      </AtInput>
      <View class="title2">更换首页轮播显示的图片</View>
      <View class="manage-carousel">
        <View class="image-picker">
          <View>第一张</View>
          <AtImagePicker
            files={carousel1}
            mode="aspectFit"
            showAddBtn={true}
            onChange={(files, operationType, index) => {
              setCarousel1(files);
            }}
            onImageClick={(index, file) => {}}
          ></AtImagePicker>
        </View>
        <View class="image-picker">
          <View>第二张</View>
          <AtImagePicker
            files={carousel2}
            mode="aspectFit"
            showAddBtn={true}
            onChange={(files, operationType, index) => {
              setCarousel2(files);
            }}
            onImageClick={(index, file) => {}}
          ></AtImagePicker>
        </View>

        <View class="image-picker">
          <View>第三张</View>
          <AtImagePicker
            files={carousel3}
            mode="aspectFit"
            showAddBtn={true}
            onChange={(files, operationType, index) => {
              setCarousel3(files);
            }}
            onImageClick={(index, file) => {}}
          ></AtImagePicker>
        </View>

        <View class="image-picker">
          <View>第四张</View>
          <AtImagePicker
            files={carousel4}
            mode="aspectFit"
            showAddBtn={true}
            onChange={(files, operationType, index) => {
              setCarousel4(files);
            }}
            onImageClick={(index, file) => {}}
          ></AtImagePicker>
        </View>
      </View>
    </View>
  );
}
