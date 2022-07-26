import { AtButton, AtCard, AtTabBar, AtNoticebar, AtFab, AtIcon } from "taro-ui";
import { View, Image } from "@tarojs/components";
import { callCloud } from "../../utils/cloud";
import { memo, useEffect, useState } from "react";
import './index.less';
import NavBar from "../../components/navbar";
import Taro from "@tarojs/taro";


export default function Library() { 

    // lost seats
    const [usedCentral, setUsedCentral] = useState(0);
    const [usedBio, setUsedBio] = useState(0);
    const [usedDoro, setUsedDoro] = useState(0);
    const [usedArch, setUsedArch] = useState(0);
    const [usedDuhig, setUsedDuhig] = useState(0);
    const [usedGatton, setUsedGatton] = useState(0);
    const [usedHerston, setUsedHerston] = useState(0);
    const [usedLaw, setUsedLaw] = useState(0);
    const [usedPACE, setUsedPACE] = useState(0);

    // total
    const [totalCentral, setTotalCentral] = useState(0);
    const [totalBio, setTotalBio] = useState(0);
    const [totalDoro, setTotalDoro] = useState(0);
    const [totalArch, setTotalArch] = useState(0);
    const [totalDuhig, setTotalDuhig] = useState(0);
    const [totalGatton, setTotalGatton] = useState(0);
    const [totalHerston, setTotalHerston] = useState(0);
    const [totalLaw, setTotalLaw] = useState(0);
    const [totalPACE, setTotalPACE] = useState(0);

    // remaining seats
    const [remCentral, setRemCentral] = useState(0);
    const [remBio, setRemBio] = useState(0);
    const [remDoro, setRemDoro] = useState(0);
    const [remArch, setRemArch] = useState(0);
    const [remDuhig, setRemDuhig] = useState(0);
    const [remGatton, setRemGatton] = useState(0);
    const [remHerston, setRemHerston] = useState(0);
    const [remLaw, setRemLaw] = useState(0);
    const [remPACE, setRemPACE] = useState(0);

    const libInfos = [
        {
            URL: "https://l.vemcount.com/embed/data/SXO0AZgR6y9jDdN?state=prod",
            name: "Architecture and Music Library",
            id: "Architecture",
            usedSeatsAPI: setUsedArch,
            totalSeatsAPI: setTotalArch,
            remainSeatsAPI: setRemArch,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/paaPDlMginYuHMx?state=prod",
            name: "Biological Sciences Library",
            id: "Biological",
            usedSeatsAPI: setUsedBio,
            totalSeatsAPI: setTotalBio,
            remainSeatsAPI: setRemBio,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/c2JHW7feDz0xVik?state=prod",
            name: "Dorothy Hill Engineering and Sciences Library",
            id: "Dorothy",
            usedSeatsAPI: setUsedDoro,
            totalSeatsAPI: setTotalDoro,
            remainSeatsAPI: setRemDoro,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/RNEF5b016mfJou3?state=prod",
            name: "Duhig Tower",
            id: "Duhig",
            usedSeatsAPI: setUsedDuhig,
            totalSeatsAPI: setTotalDuhig,
            remainSeatsAPI: setRemDuhig,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/BTp0IbGs2IR6Oh9?state=prod",
            name: "Gatton Library",
            id: "Gatton",
            usedSeatsAPI: setUsedGatton,
            totalSeatsAPI: setTotalGatton,
            remainSeatsAPI: setRemGatton,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/O0ZCHv8lyaiKNiu?state=prod",
            name: "Herston Health Sciences Library",
            id: "Herston",
            usedSeatsAPI: setUsedHerston,
            totalSeatsAPI: setTotalHerston,
            remainSeatsAPI: setRemHerston,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/hMxSjYuk4v3kuIx?state=prod",
            name: "Law Library",
            id: "Law",
            usedSeatsAPI: setUsedLaw,
            totalSeatsAPI: setTotalLaw,
            remainSeatsAPI: setRemLaw,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/kw8OF8iJWJJUTC1?state=prod",
            name: "PACE Health Sciences Library",
            id: "PACE",
            usedSeatsAPI: setUsedPACE,
            totalSeatsAPI: setTotalPACE,
            remainSeatsAPI: setRemPACE,
            ecardStatus: false
        },
        {
            URL: "https://l.vemcount.com/embed/data/8DXPwOaTWeBYNbS?state=prod",
            name: "Central Library",
            id: "Central",
            usedSeatsAPI: setUsedCentral,
            totalSeatsAPI: setTotalCentral,
            remainSeatsAPI: setRemCentral,
            ecardStatus: false
        }
    ];

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

    function defineRoughPercentage(percentage) { 
        if (percentage > 0) {
            if (percentage <= 10) { 
                return 1;
            } else {
                if (percentage % 10 === 0) {
                    return percentage / 10;
                } else { 
                    return Math.ceil(percentage) / 10;
                }
            }
        } else { 
            return 0;
        }
    }

    function controlExpandEcard(libNum) { 
        const lib = libInfos[libNum];
        console.log(lib.id + "-ecard");
        if (lib.ecardStatus == false) {
            document.getElementById(lib.id + "-ecard").style.display = "block";
            lib.ecardStatus = true;
        } else { 
            document.getElementById(lib.id + "-ecard").style.display = "none";
            lib.ecardStatus = false;
        }
    }

    function updateLibComponents(i, dataSet) { 
        const libSet = dataSet.result.data[i];
        const usedSeats = libSet.usedSeats;
        const totalSeats = libSet.totalSeats;
        const remainingSeats = totalSeats - usedSeats;
        const percentage = Math.round((usedSeats/totalSeats) * 100);
        // change front-end components here
        // 1. change the seat-icons-cell, property change
        const roughPercentage = defineRoughPercentage(percentage);
        for (let index = 1; index <= 10; index++) {
            const element = document.getElementById(libInfos[i].id + "-no" + index);
            if (index <= roughPercentage) {
                element.setAttribute("src", "../../assets/images/chair-black-small.png");
            } else {
                element.setAttribute("src", "../../assets/images/chair-white-small.png");
            }
        }
        // 2. change the extended-info-cards, value change
        const lib = libInfos[i];
        lib.usedSeatsAPI(usedSeats);
        lib.totalSeatsAPI(totalSeats);
        lib.remainSeatsAPI(remainingSeats);
    }

    async function updateAllInfos() { 
        refreshAll();
        const dataSet = await callCloud("library", "retrieveAllSeatData");
        updateLibComponents(0, dataSet);
        updateLibComponents(1, dataSet);
        updateLibComponents(2, dataSet);
        updateLibComponents(3, dataSet);
        updateLibComponents(4, dataSet);
        updateLibComponents(5, dataSet);
        updateLibComponents(6, dataSet);
        updateLibComponents(7, dataSet);
        updateLibComponents(8, dataSet);
        // console.log("Success");
    }

    useEffect(() => { 
        updateAllInfos();
    }, []);

    
    return (
        <View id="main">
            <NavBar title="图书馆座位" backIcon />
            <AtNoticebar
                className="library-notice-bar"
                icon="volume-plus"
                marquee
            >
                当前页面显示实时空位情况。
            </AtNoticebar>
            <AtCard className="library-info-cards" id="Architecture" title="Architecture and Music Library">
                <AtButton id="btn-01" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(0);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Architecture-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Architecture-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalArch }</View>
                <View className="snippet used-seats-snippet">Used: { usedArch }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remArch }</View>
                <View className="snippet address">Address: 51 Zelmen Cowen Building </View>
            </View> 
            <AtCard className="library-info-cards" id="Biological" title="Biological Sciences Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(1);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Biological-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Biological-ecard">
                <View className="snippet total-seats-snippet">Total Seats:{ totalBio } </View>
                <View className="snippet used-seats-snippet">Used: { usedBio }</View>
                <View className="snippet remain-seats-snippet">Remaining:{ remBio } </View>
                <View className="snippet address">Address: Building #94 </View>
            </View>
            <AtCard className="library-info-cards" id="Dorothy" title="Engineering and Sciences Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(2);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Dorothy-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Dorothy-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalDoro }</View>
                <View className="snippet used-seats-snippet">Used: { usedDoro }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remDoro }</View>
                <View className="snippet address">Address: Hawken Engineering Building (Building #50)</View>
            </View>
            <AtCard className="library-info-cards" id="Duhig" title="Duhig Tower">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(3);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Duhig-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Duhig-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalDuhig }</View>
                <View className="snippet used-seats-snippet">Used: { usedDuhig }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remDuhig }</View>
                <View className="snippet address">Address: Building #2</View>
            </View>
            <AtCard className="library-info-cards" id="Gatton" title="Gatton Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(4);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Gatton-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Gatton-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalGatton } </View>
                <View className="snippet used-seats-snippet">Used: { usedGatton } </View>
                <View className="snippet remain-seats-snippet">Remaining: { remGatton }</View>
                <View className="snippet address">Address: JK Murray Library (8102)</View>
            </View>
            <AtCard className="library-info-cards" id="Herston" title="Herston Health Sciences Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(5);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Herston-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Herston-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalHerston }</View>
                <View className="snippet used-seats-snippet">Used: { usedHerston }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remHerston }</View>
                <View className="snippet address">Address: Block 6 Royal Brisbane and Women's Hospital</View>
            </View>
            <AtCard className="library-info-cards" id="Law" title="Law Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(6);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Law-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Law-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalLaw }</View>
                <View className="snippet used-seats-snippet">Used: { usedLaw }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remLaw }</View>
                <View className="snippet address">Address: Forgan Smith (Building #1)</View>
            </View>
            <AtCard className="library-info-cards" id="PACE" title="PACE Health Sciences Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(7);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="PACE-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="PACE-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalPACE }</View>
                <View className="snippet used-seats-snippet">Used: { usedPACE }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remPACE } </View>
                <View className="snippet address">Address: PACE Precinct, 20 Cornwall Street</View>
            </View>
            <AtCard className="library-info-cards" id="Central" title="Central Library">
                <AtButton src="../../assets/images/expand-more.png" className="expand-operator" onClick={
                    () => {
                        controlExpandEcard(8);
                    }
                }></AtButton>
                <View className="seat-icons-cell">
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no1"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no2"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no3"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no4"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no5"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no6"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no7"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no8"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no9"></Image>
                    <Image src="../../assets/images/chair-white-small.png" className="seat-icon" id="Central-no10"></Image>
                </View>
            </AtCard>
            <View className="extended-info-cards" id="Central-ecard">
                <View className="snippet total-seats-snippet">Total Seats: { totalCentral }</View>
                <View className="snippet used-seats-snippet">Used: { usedCentral }</View>
                <View className="snippet remain-seats-snippet">Remaining: { remCentral }</View>
                <View className="snippet address">Address: Duhig North (Building #12)</View>
            </View>
            <AtFab className="refresh-fab" size="small" onClick={
                () => {
                    updateAllInfos();
                    Taro.showToast({ title: "正在更新~", icon:"loading", duration: 2000});
                }
            }>
                <AtIcon
                    prefixClass="icon"
                    value="reload"
                    size='35'
                    color="white"
                ></AtIcon>
            </AtFab>
        </View>
    );
}
