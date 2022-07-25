import React, { useEffect, useState } from "react";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useSelector } from "react-redux";
import { Swiper, SwiperItem } from "@tarojs/components";
import {
    titleImage
} from "../../assets/images/index.json";
import {
    countDownIcon,
    timeTableIcon,
    calculaterIcon,
    courseReviewIcon,
} from "../../assets/images/icon.json";
import "./index.less";
import TodayCourse from "../../components/index/today-course/index";
import NewActivities from "../../components/index/new-activities/index";
import LibrarySeats from "../../components/index/library-seats/index.weapp"
import { PROGRAM_NAME } from "../../config.json";

export default function Index() {
    const { newActivities, todayClasses, recentAssignments, librarySeats } = useSelector(
        state => state.user.cardsInfo
    );
    const {
        carousel1,
        carousel2,
        carousel3,
        carousel4,
        carousel1_url,
        carousel2_url,
        carousel3_url,
        carousel4_url
    } = useSelector(state => state.resource);
    useShareAppMessage(res => {
        if (res.from === "button") {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: PROGRAM_NAME,
            path: "/pages/launch/index"
        };
    });

    return (
        <View className="index-container">
            <View
                className="usyd-easygo-title"
                style={{ paddingTop: Taro.$navBarMarginTop + "px" }}
            >
                <Image src={titleImage} />
            </View>
            <Swiper
                className="swiper"
                indicatorColor="#999"
                indicatorActiveColor="#333"
                circular
                indicatorDots
                autoplay
            >
                <SwiperItem
                    onClick={() => {
                        if (carousel1_url != "") {
                            Taro.navigateTo({
                                url: "/pages/web-view/index?url=" + carousel1_url
                            });
                        } else {
                            Taro.previewImage({ urls: [carousel1] });
                        }
                    }}
                >
                    <Image className="carousel-img" src={carousel1} mode="widthFix" />
                </SwiperItem>
                <SwiperItem
                    onClick={() => {
                        if (carousel2_url != "") {
                            Taro.navigateTo({
                                url: "/pages/web-view/index?url=" + carousel2_url
                            });
                        } else {
                            Taro.previewImage({ urls: [carousel2] });
                        }
                    }}
                >
                    <Image className="carousel-img" src={carousel2} mode="widthFix" />
                </SwiperItem>
                <SwiperItem
                    onClick={() => {
                        if (carousel3_url != "") {
                            Taro.navigateTo({
                                url: "/pages/web-view/index?url=" + carousel3_url
                            });
                        } else {
                            Taro.previewImage({ urls: [carousel3] });
                        }
                    }}
                >
                    <Image className="carousel-img" src={carousel3} mode="widthFix" />
                </SwiperItem>
                <SwiperItem
                    onClick={() => {
                        if (carousel4_url != "") {
                            Taro.navigateTo({
                                url: "/pages/web-view/index?url=" + carousel4_url
                            });
                        } else {
                            Taro.previewImage({ urls: [carousel4] });
                        }
                    }}
                >
                    <Image className="carousel-img" src={carousel4} mode="widthFix" />
                </SwiperItem>
            </Swiper>

            <View className="function-entries">
                <View className="function-icon-view">
                    <Image
                        className="function-icon"
                        src={calculaterIcon}
                        mode="widthFix"
                        onClick={() => Taro.navigateTo({ url: "/pages/calculator/index" })}
                    // onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}
                    />
                    <View
                        className="title-text"
                        onClick={() => Taro.navigateTo({ url: "/pages/calculator/index" })}
                    >
                        计算器
                        {/* // onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}>计算器 */}
                    </View>
                </View>

                <View className="function-icon-view">
                    <Image
                        className="function-icon"
                        src={countDownIcon}
                        mode="widthFix"
                        // onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}
                        onClick={() =>
                            Taro.navigateTo({ url: "/pages/countingdown/index" })
                        }
                    />
                    <View
                        className="title-text"
                        onClick={() =>
                            Taro.navigateTo({ url: "/pages/countingdown/index" })
                        }
                    >
                        倒计时
                    </View>
                </View>

                <View className="function-icon-view">
                    <Image
                        className="function-icon"
                        src={timeTableIcon}
                        mode="widthFix"
                        onClick={() => Taro.navigateTo({ url: "/pages/timetable/index" })}
                    />
                    <View
                        className="title-text"
                        onClick={() => Taro.navigateTo({ url: "/pages/timetable/index" })}
                    >
                        课程表
                    </View>
                </View>

                <View className="function-icon-view">
                    <Image
                        className="function-icon"
                        src={courseReviewIcon}
                        mode="widthFix"
                        // onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none' })}
                        onClick={() =>
                            Taro.navigateTo({ url: "/pages/course-review/index" })
                        }
                    />
                    <View
                        className="title-text"
                        onClick={() =>
                            Taro.navigateTo({ url: "/pages/course-review/index" })
                        }
                    >
                        课评
                    </View>
                </View>
            </View>
            {/* 根据用户自定义显示情况展示对应卡片 */}
            {todayClasses && <TodayCourse />}
            {newActivities && <NewActivities />}
            {librarySeats && <LibrarySeats />}
        </View>
    );
}
