// cloud functions entry files
const cloud = require('wx-server-sdk');
const http = require('https');

// initialise cloud resources
cloud.init()
// initialise database
const db = cloud.database();
const _ = db.command;

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
const calcPercentage = (used, total) => {
    return Math.round(used / total * 10000) / 100;
}

// update seat status of a library
const updateSeatPercentage = (libraryName, totalSeats, usedSeats) => {
    db.collection('UQ_Library_Seats').where({
        name: libraryName
    }).update({
        data: {
            usedSeats: usedSeats,
            percentage: calcPercentage(usedSeats, totalSeats)
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
        const dataSet = await db.collection('UQ_Library_Seats').where({
            name: libraryName
        }).get().then((dataSet) => { 
            updateSeatPercentage(libraryName, dataSet.data[0].totalSeats, value);
        });
    });
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
}