import { AtButton, AtCard } from "taro-ui";
import { View, Image } from "@tarojs/components";
import { callCloud } from "../../../utils/cloud";
import { memo, useEffect, useState } from "react";
import "./index.less";
import Taro, { checkIsSupportSoterAuthentication } from "@tarojs/taro";
import { compose } from "lodash/fp";

function LibrarySeats(props) {
    // lost seats
    const [lostSeatsCentral, setLostSeatsCentral] = useState(0);
    const [lostSeatsBio, setLostSeatsBio] = useState(0);
    const [lostSeatsDoro, setLostSeatsDoro] = useState(0);
    // percentage
    const [percentageCentral, setPercentageCentral] = useState(0);
    const [percentageBio, setPercentageBio] = useState(0);
    const [percentageDoro, setPercentageDoro] = useState(0);
    /***
     * update all the functions via https requests
     */
    function refreshAll() {
        callCloud("library", "reqAllSeatData");
    }

    // count lost seats of each library
    function calcLostSeats(usedSeats, totalSeats) {
        if (usedSeats < 0) {
            return totalSeats;
        } else {
            return totalSeats - usedSeats;
        }
    }

    // count and update lost seats and map to front components
    function updateComponentVal(libraryName, dataSet) {
        let widthPer = "15%";
        const usedSeats = dataSet.usedSeats;
        const totalSeats = dataSet.totalSeats;
        const percentage = Math.round((usedSeats / totalSeats) * 100);
        if (percentage > 15) {
            widthPer = percentage + "%";
        }
        if (libraryName == "Central Library") {
            // set data
            setLostSeatsCentral(calcLostSeats(usedSeats, totalSeats));
            setPercentageCentral(percentage);
            // set style
            document.getElementById("percentage-central").style.width = widthPer;
            document.getElementById("last-seats-central").style.display = "none";
            // when the percentage exceeds 70%, hide the display of "lost seats" while there are no space to display contents
            (percentage > 70) ? document.getElementById("last-seats-central").style.display = "none" :
                document.getElementById("last-seats-central").style.display = "block";
        } else if (libraryName == "Biological Sciences Library") {
            // set data
            setLostSeatsBio(calcLostSeats(usedSeats, totalSeats));
            setPercentageBio(percentage);
            // set style
            document.getElementById("percentage-bio").style.width = widthPer;
            (percentage > 70) ? document.getElementById("last-seats-bio").style.display = "none" :
                document.getElementById("last-seats-bio").style.display = "block";
        } else if (libraryName == "Dorothy Hill Engineering and Sciences Library") {
            // set data
            setLostSeatsDoro(calcLostSeats(usedSeats, totalSeats));
            setPercentageDoro(percentage);
            // set style
            document.getElementById("percentage-doro").style.width = widthPer;
            (percentage > 70) ? document.getElementById("last-seats-doro").style.display = "none" :
                document.getElementById("last-seats-doro").style.display = "block";
        }
    }

    async function updateAllComponents() {
        refreshAll();
        const dataSet = await callCloud("library", "retrieveAllSeatData");
        console.log(dataSet);
        const dataCentral = dataSet.result.data[8];
        const dataBio = dataSet.result.data[1];
        const dataDoro = dataSet.result.data[2];
        updateComponentVal("Central Library", dataCentral);
        updateComponentVal("Biological Sciences Library", dataBio);
        updateComponentVal("Dorothy Hill Engineering and Sciences Library", dataDoro);
    }

    // update all seat status after load finished
    useEffect(() => {
        updateAllComponents();
    }, []);

    return (
        <AtCard title="图书馆座位">
            <View className="library-card">
                <View className="lib-cell" id="first">
                    <View className="cell-title">CENTRAL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-central">{percentageCentral}%</View>
                        <View className="last-seats-info" id="last-seats-central">余位：{lostSeatsCentral}</View>
                    </View>
                </View>
                <View className="lib-cell" id="second">
                    <View className="cell-title">BIOLOGICAL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-bio">{percentageBio}%</View>
                        <View className="last-seats-info" id="last-seats-bio">余位：{lostSeatsBio}</View>
                    </View>
                </View>
                <View className="lib-cell" id="third">
                    <View className="cell-title">DOROTHY HILL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-doro">{percentageDoro}%</View>
                        <View className="last-seats-info" id="last-seats-doro">余位：{lostSeatsDoro}</View>
                    </View>
                </View>
                <View className="lib-operation-cell">
                    <AtButton className="operation-btn" id="detail-btn" onClick={
                        () => {
                            Taro.navigateTo({
                                url: "/pages/library-seats/index"
                            });
                        }
                    }>DETAIL</AtButton>
                    <AtButton className="operation-btn" id="refresh-btn" onClick={
                        () => {
                            updateAllComponents();
                            Taro.showToast({ title: "已刷新~", duration: 2000 });
                        }
                    }>REFRESH</AtButton>
                </View>
            </View>
        </AtCard>
    );
}

export default memo(LibrarySeats);