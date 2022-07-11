import { AtButton, AtCard } from "taro-ui";
import { View, Image } from "@tarojs/components";
import { callCloud } from "../../../utils/cloud";
import { memo, useEffect, useState } from "react";
import "./index.less";

function LibrarySeats(props) {
    // lost seats
    const [lostSeatsCentral, setLostSeatsCentral] = useState(0);
    const [lostSeatsBio, setLostSeatsBio] = useState(0);
    const [lostSeatsDoro, setLostSeatsDoro] = useState(0);
    
    // percentage
    const [percentageCentral, setPercentageCentral] = useState(0);
    const [percentageBio, setPercentageBio] = useState(0);
    const [percentageDoro, setPercentageDoro] = useState(0);

    const URLs = {
        "Architecture": {
            URL: "https://l.vemcount.com/embed/data/SXO0AZgR6y9jDdN?state=prod",
            name: "Architecture and Music Library"
        }, 
        "Biological": {
            URL: "https://l.vemcount.com/embed/data/paaPDlMginYuHMx?state=prod",
            name: "Biological Sciences Library"
        },
        "Dorothy": {
            URL: "https://l.vemcount.com/embed/data/c2JHW7feDz0xVik?state=prod",
            name: "Dorothy Hill Engineering and Sciences Library"
        },
        "Duhig": {
            URL: "https://l.vemcount.com/embed/data/RNEF5b016mfJou3?state=prod",
            name: "Duhig Tower"
        },
        "Gatton": {
            URL: "https://l.vemcount.com/embed/data/BTp0IbGs2IR6Oh9?state=prod",
            name: "Gatton Library"
        },
        "Herston": {
            URL: "https://l.vemcount.com/embed/data/O0ZCHv8lyaiKNiu?state=prod",
            name: "Herston Health Sciences Library"
        },
        "Law": {
            URL: "https://l.vemcount.com/embed/data/hMxSjYuk4v3kuIx?state=prod",
            name: "Law Library"
        },
        "PACE": {
            URL: "https://l.vemcount.com/embed/data/kw8OF8iJWJJUTC1?state=prod",
            name: "PACE Health Sciences Library"
        },
        "Central": {
            URL: "https://l.vemcount.com/embed/data/8DXPwOaTWeBYNbS?state=prod",
            name: "Central Library",
            frontMapAPI: setLostSeatsCentral
        }
    }

    /***
     * update all the functions via https requests
     */
    function refreshAll() { 
        callCloud("library", "httpReqSeatData", {
            name: URLs.Biological.name,
            url: URLs.Biological.URL
        });
        callCloud("library", "httpReqSeatData", {
            name: URLs.Central.name,
            url: URLs.Central.URL,
        });
        callCloud("library", "httpReqSeatData", {
            name: URLs.Dorothy.name,
            url: URLs.Dorothy.URL
        });
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
    function updateComponentVal(libraryName) {
        let widthPer = "15%";
        const dataSet = callCloud("library", "retrieveSeatData", {
            name: libraryName
        }).then((dataSet) => {
            const usedSeats = dataSet.result.usedSeats;
            const totalSeats = dataSet.result.totalSeats;
            const percentage = dataSet.result.percentage;
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
                (widthPer > 70) ? document.getElementById("last-seats-central").style.display = "none" :
                    document.getElementById("last-seats-cental").style.display = "block";
            } else if (libraryName == "Biological Sciences Library") { 
                // set data
                setLostSeatsBio(calcLostSeats(usedSeats, totalSeats));
                setPercentageBio(percentage);
                // set style
                document.getElementById("percentage-bio").style.width = widthPer;
                (widthPer > 70) ? document.getElementById("last-seats-bio").style.display = "none" :
                    document.getElementById("last-seats-bio").style.display = "block";
            } else if (libraryName == "Dorothy Hill Engineering and Sciences Library") {
                // set data
                setLostSeatsDoro(calcLostSeats(usedSeats, totalSeats));
                setPercentageDoro(percentage);
                // set style
                document.getElementById("percentage-doro").style.width = widthPer;
                (widthPer > 70) ? document.getElementById("last-seats-doro").style.display = "none" :
                    document.getElementById("last-seats-doro").style.display = "block";
            }
        });
    }

    function updateAllComponents() { 
        refreshAll();
        updateComponentVal("Central Library");
        updateComponentVal("Biological Sciences Library");
        updateComponentVal("Dorothy Hill Engineering and Sciences Library");
    }

    // update all seat status after load finished
    useEffect(() => {
        refreshAll();
    });

    return (
        <AtCard title="图书馆座位">
            <View className="library-card">
                <View className="lib-operation-cell">
                    <AtButton className="operation-btn" id="detail">DETAIL</AtButton>
                    <AtButton className="operation-btn" id="refresh" onClick={ updateAllComponents() }>REFRESH</AtButton>
                </View>
                <View className="lib-cell" id="first">
                    <View className="cell-title">CENTRAL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-central">{ percentageCentral }%</View>
                        <View className="last-seats-info" id="last-seats-central">余位：{ lostSeatsCentral }</View>
                    </View>
                </View>
                <View className="lib-cell" id="second">
                    <View className="cell-title">BIOLOGICAL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-bio">{ percentageBio }%</View>
                        <View className="last-seats-info" id="last-seats-bio">余位：{ lostSeatsBio }</View>
                    </View>
                </View>
                <View className="lib-cell" id="third">
                    <View className="cell-title">DOROTHY HILL LIBRARY</View>
                    <View className="cell-content">
                        <View className="percentage-info" id="percentage-doro">{ percentageDoro }%</View>
                        <View className="last-seats-info" id="last-seats-doro">余位：{ lostSeatsDoro }</View>
                    </View>
                </View>
            </View>
        </AtCard>
    );
}

export default memo(LibrarySeats);