import { AtButton, AtCard } from "taro-ui";
import { View, Image } from "@tarojs/components";
import { callCloud } from "../../../utils/cloud";
import { memo, useEffect, useState } from "react";

function Library(prop) { 

    // lost seats
    const [lostSeatsCentral, setLostSeatsCentral] = useState(0);
    const [lostSeatsBio, setLostSeatsBio] = useState(0);
    const [lostSeatsDoro, setLostSeatsDoro] = useState(0);
    const [lostSeatsArch, setLostSeatsArch] = useState(0);
    const [lostSeatsDuhig, setLostSeatsDuhig] = useState(0);
    const [lostSeatsGatton, setLostSeatsGatton] = useState(0);
    const [lostSeatsHerston, setLostSeatsHerston] = useState(0);
    const [lostSeatsLaw, setLostSeatsLaw] = useState(0);
    const [lostSeatsPACE, setLostSeatsPACE] = useState(0);

    // percentage
    const [percentageCentral, setPercentageCentral] = useState(0);
    const [percentageBio, setPercentageBio] = useState(0);
    const [percentageDoro, setPercentageDoro] = useState(0);
    const [percentageArch, setPercentageArch] = useState(0);
    const [percentageDuhig, setPercentageDuhig] = useState(0);
    const [percentageGatton, setPercentageGatton] = useState(0);
    const [percentageHerston, setPercentageHerston] = useState(0);
    const [percentageLaw, setPercentageLaw] = useState(0);
    const [percentagePACE, setPercentagePACE] = useState(0);
    
    const libInfos = [
        {
            URL: "https://l.vemcount.com/embed/data/SXO0AZgR6y9jDdN?state=prod",
            name: "Architecture and Music Library",
            lostSeatsAPI: setLostSeatsArch,
            percentageAPI: setPercentageArch
        },
        {
            URL: "https://l.vemcount.com/embed/data/paaPDlMginYuHMx?state=prod",
            name: "Biological Sciences Library",
            lostSeatAPI: setLostSeatsBio,
            percentageAPI: setPercentageBio
        },
        {
            URL: "https://l.vemcount.com/embed/data/c2JHW7feDz0xVik?state=prod",
            name: "Dorothy Hill Engineering and Sciences Library",
            lostSeatsAPI: setLostSeatsDoro,
            percentageAPI: setPercentageDoro
        },
        {
            URL: "https://l.vemcount.com/embed/data/RNEF5b016mfJou3?state=prod",
            name: "Duhig Tower",
            lostSeatsAPI: setLostSeatsDuhig,
            percentageAPI: setPercentageDuhig
        },
        {
            URL: "https://l.vemcount.com/embed/data/BTp0IbGs2IR6Oh9?state=prod",
            name: "Gatton Library",
            lostSeatsAPI: setLostSeatsGatton,
            percentageAPI: setPercentageGatton
        },
        {
            URL: "https://l.vemcount.com/embed/data/O0ZCHv8lyaiKNiu?state=prod",
            name: "Herston Health Sciences Library",
            lostSeatsAPI: setLostSeatsHerston,
            percentageAPI: setPercentageHerston
        },
        {
            URL: "https://l.vemcount.com/embed/data/hMxSjYuk4v3kuIx?state=prod",
            name: "Law Library",
            lostSeatsAPI: setLostSeatsLaw,
            percentageAPI: setPercentageLaw
        },
        {
            URL: "https://l.vemcount.com/embed/data/kw8OF8iJWJJUTC1?state=prod",
            name: "PACE Health Sciences Library",
            lostSeatsAPI: setLostSeatsPACE,
            percentageAPI: setPercentagePACE
        },
        {
            URL: "https://l.vemcount.com/embed/data/8DXPwOaTWeBYNbS?state=prod",
            name: "Central Library",
            lostSeatsAPI: setLostSeatsCentral,
            percentageAPI: setPercentageCentral
        }
    ];

    /***
     * update all the functions via https requests
     */
    function refreshAll() {
        for (i = 0; i < libInfos.length; i++) {
            callCloud("library", "httpReqSeatData", {
                name: libInfos[i].name,
                url: libInfos[i].URL
            });
        }
    }

    // count lost seats of each library
    function calcLostSeats(usedSeats, totalSeats) {
        if (usedSeats < 0) {
            return totalSeats;
        } else {
            return totalSeats - usedSeats;
        }
    }

    function updateAllInfos() { 
        refreshAll();
        for (i = 0; i < libInfos.length; i++) { 
            callCloud("library", "retrieveSeatData", {
                name: libInfos[i].name
            }).then((dataSet) => { 
                const usedSeats = dataSet.result.usedSeats;
                const totalSeats = dataSet.result.totalSeats;
                const percentage = dataSet.result.percentage;
                libInfos[i].lostSeatAPI(calcLostSeats(usedSeats, totalSeats));
                libInfos[i].percentageAPI(percentage);
                // you might change some front-end components here
            });
        }
    }

    
    return (
        <View>
            <View className="library-info-cards" id="Architecture and Music Library"></View>
            <View className="extended-info-cards"></View> 
            <View className="library-info-cards" id="Biological Sciences Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Dorothy Hill Engineering and Sciences Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Duhig Tower"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Gatton Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Herston Health Sciences Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Law Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="PACE Health Sciences Library"></View>
            <View className="extended-info-cards"></View>
            <View className="library-info-cards" id="Central Library"></View>
            <View className="extended-info-cards"></View>
        </View>
    );
}

export default memo(Library);