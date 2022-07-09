import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro, { cloud } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import ManageCarousel from "../../components/manage/manage-carousel";

export default function Manage() {
  return (
    <View>
      <ManageCarousel />
    </View>
  );
}
