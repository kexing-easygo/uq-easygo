import {NUMBERS} from './constant'
import moment from 'moment';
import 'moment-timezone';

/**
 * 根据diff字段区分完成与未完成countdown assignments
 * @param {assignments} assignments 
 */
export const checkComplete = (assignments) => {
  const completed = [];
  const uncompleted = [];
  if (assignments == null) return [];
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].diff < 0) {
      completed.push(assignments[i])
    } else {
      uncompleted.push(assignments[i])}
  }
  return completed, uncompleted;
}

/**
 * sortCountDown辅助方法， 根据天数diff计算percentage
 * @param {number} diff天数
 */
export const calculatePercentage = (diff) => {
  let percentage = (diff / 30 * 100).toFixed(1)
  if (percentage >= 100) {
    percentage = 0
  } else if (percentage < 100 && percentage > 0) {
    percentage = 100 - percentage
  } else {
    percentage = 100
  }
  return percentage
}

export const calcCountdown = (singleCountdown, classmode) => {
  const classMode = classmode
  let todayDate = moment.tz('Australia/Brisbane')
  if (classMode == "中国境内") {
    todayDate = moment.tz('Asia/Shanghai')
  }
  if (singleCountdown["default"] == true) {
    // 默认作业，更新时间
    if (singleCountdown["name"] == "CSSE1001 A1 (示例)") {
      singleCountdown["date"] = formatDate(todayDate.clone().add(4, "d"), "date")
    } else {
      singleCountdown["date"] = formatDate(todayDate.clone().add(29, "d"), "date")
    }
  } else {
    let date = "999";
    let diff = Infinity;
    // 如果用户作业中存在时间不确定的，默认为999
    if (singleCountdown["date"] !== "TBD") {
      // 计算时间差
      date = singleCountdown["date"]
      let time = singleCountdown["time"]
      let d1 = moment(`${date} ${time}`)
      diff = d1.diff(todayDate, 'days')
    }
    const percentage = calculatePercentage(diff)
    singleCountdown["percentage"] = percentage
    singleCountdown["diff"] = diff
  }
}

export const formAssignment = (assessment) => {
  
}

/**
 * 根据diff对用户全部的countdown排序，并计算percentage
 * @param {countdown} 用户全部的countdown
 * @param {classmode} 用户在个人界面设置的classmode
 * @return {temp} 排序后的countdown
 */
export const sortCountDown = (countdown, classmode) => {
    if (countdown.length == 0) return []

    let temp = []
    countdown.forEach(assignment => {
      let item = {
        aid: assignment.aid,
        name: assignment.name,
        date: assignment.date,
        time: assignment.time,
        color: assignment.color,
        type: assignment.type
      }
      temp.push(item)
    })
    const classMode = classmode
    let todayDate = moment.tz('Australia/Brisbane')
    if (classMode == "中国境内") {
      todayDate = moment.tz('Asia/Shanghai')
    }
    temp.map((ass) => {
      calcCountdown(ass, classMode)
    })      
    
    temp = temp.sort(function (a, b) {
      return a['diff'] - b['diff']
    })
    return temp
}

/**
 * 按月份划分用户的countdown assignments。如果date为TBD，单独划分一列
 * @param {assignments} 用户全部的countdown
 * @return {monthCountDown} 一个以月份为key的Object, value为每个月份下的countdown
 */
export const splitByMonth = (assignments) => {
  const monthCountDown = {}
  if (assignments == null) return [];
  for (let i = 0; i < assignments.length; i++) {
    monthCountDown[TBD] = []
    if (assignments[i].date == "TBD") {
      monthCountDown['TBD'].push(assignments[i])
    } else {
      let month = assignments[i].date.split('-');
      if (monthCountDown[month[1]] == null) {
        monthCountDown[month[1]] = []
      }
      monthCountDown[month[1]].push(assignments[i])
    }
  }
  return monthCountDown;
}

/**
 * 统计已完成 / 未完成作业数量
 * @param {object} countdown 所有作业
 */
export const countNumOfAssignments = (countdown) => {
  let num = 0
  Object.entries(countdown).map((entry) => {
    num += entry[1].length
  })
  return num
}


export const splitCountDown = (countdown) => {
  const completeCountDown = {}
  const incompleteCountDown = {}
  if (countdown == null) return [];
  for (let i = 0; i < countdown.length; i++) {
    if (countdown[i].diff <= 0) {
      let month = countdown[i].date.split('-');
      let key = month[1]
      if (completeCountDown[key] == null) {
        completeCountDown[key] = []
      }
      completeCountDown[key].push(countdown[i])
    } else if (countdown[i].diff > 0) {
      let month = countdown[i].date.split('-')
      let key = month == "TBD" ? "待定" : month[1]
      if (incompleteCountDown[key] == null) {
        incompleteCountDown[key] = []
      }
      incompleteCountDown[key].push(countdown[i])
    }
  }
  return {
    completeCountDown: completeCountDown,
    incompleteCountDown: incompleteCountDown,
  }
}