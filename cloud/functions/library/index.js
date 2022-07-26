// cloud functions entry files
const cloud = require('wx-server-sdk');
const http = require('https');

// initialise cloud resources
cloud.init()
// initialise database
const db = cloud.database();
const _ = db.command;

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
    }
}

// retrieve data set from database
async function retrieveSeatData(libraryName) {
    const dataSet = await db.collection('UQ_Library_Seats').where({
        name: libraryName
    }).get();

    if (dataSet.data.length == 0) { 
        return {
            usedSeats: NaN,
            totalSeats: NaN,
            percentage: NaN
        }
    }

    return {
        usedSeats: dataSet.data[0].usedSeats,
        totalSeats: dataSet.data[0].totalSeats,
        percentage: dataSet.data[0].percentage
    };
}

// calculate percentage
// const calcPercentage = (used, total) => {
//     return Math.round(used / total);
// }

// update seat status of a library
const updateSeatPercentage = (libraryName, totalSeats, usedSeats) => {
    db.collection('UQ_Library_Seats').where({
        name: libraryName
    }).update({
        data: {
            usedSeats: usedSeats
            // percentage: calcPercentage(usedSeats, totalSeats)
        },
        success: function (res) {
            console.log("Library updated successfully.");
        }
    });
}

/***
 * retrieve seat data of each library from UQ's website via HTTP requests
 */
const httpReqSeatData = async (libraryName, url) => {
    // start a request
    const result = await new Promise((resolve, reject) => {
        // deploy request format, using default 'GET' method
        const request = http.request(url, res => {
            const snippets = [];
            // receive all the request data 
            res.on('data', chunk => { snippets.push(chunk); });
            res.on('end', () => {
                // only one data
                const data = Buffer.concat(snippets).toString('utf-8');
                // parse data to JSON object
                resolve(JSON.parse(data));
            });
        });
        // send request
        request.end();
    }).then(async (result) => {
        const value = result.value;
        const dataSet = db.collection('UQ_Library_Seats').where({
            name: libraryName
        }).update({
            data: {
                usedSeats: value
            }
        })
        //     .get().then((dataSet) => { 
        //     const totalSeats = dataSet.data[0].totalSeats;
        //     updateSeatPercentage(libraryName, totalSeats, value);
        // });
    });
}

const reqAllSeatData = async() => {
    await httpReqSeatData("Architecture and Music Library", "https://l.vemcount.com/embed/data/SXO0AZgR6y9jDdN?state=prod");
    await httpReqSeatData("Biological Sciences Library", "https://l.vemcount.com/embed/data/paaPDlMginYuHMx?state=prod");
    await httpReqSeatData("Central Library", "https://l.vemcount.com/embed/data/8DXPwOaTWeBYNbS?state=prod");
    await httpReqSeatData("Dorothy Hill Engineering and Sciences Library", "https://l.vemcount.com/embed/data/c2JHW7feDz0xVik?state=prod");
    await httpReqSeatData("Duhig Tower", "https://l.vemcount.com/embed/data/RNEF5b016mfJou3?state=prod");
    await httpReqSeatData("Gatton Library", "https://l.vemcount.com/embed/data/BTp0IbGs2IR6Oh9?state=prod");
    await httpReqSeatData("Herston Health Sciences Library", "https://l.vemcount.com/embed/data/O0ZCHv8lyaiKNiu?state=prod");
    await httpReqSeatData("Law Library", "https://l.vemcount.com/embed/data/hMxSjYuk4v3kuIx?state=prod");
    await httpReqSeatData("PACE Health Sciences Library", "https://l.vemcount.com/embed/data/kw8OF8iJWJJUTC1?state=prod");
}

const retrieveAllSeatData = async () => { 
    const dataSet = await db.collection('UQ_Library_Seats').get();
    return dataSet;
}

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const { branch, method } = event
    if (branch == undefined
        || method == undefined) {
        return {}
    }
    if (method == "retrieveSeatData") { 
        const { name } = event;
        return await retrieveSeatData(name);
    }
    if (method == "httpReqSeatData") {
        const { name, url } = event;
        return await httpReqSeatData(name, url);
    }
    if (method == "reqAllSeatData") {
        return await reqAllSeatData();
    }
    if (method == "retrieveAllSeatData") { 
        return await retrieveAllSeatData();
    }
} 