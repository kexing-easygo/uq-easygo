import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro, { cloud } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import ManageCarousel from "../../components/manage/manage-carousel";
import NavBar from "../../components/navbar";
export default function Manage() {
  return (
    <View>
      <NavBar title="管理" backIcon />
      <ManageCarousel />
    </View>
  )
  // return <ManageCarousel />;
}
