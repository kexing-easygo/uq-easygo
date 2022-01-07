import { AU_TIME_ZONE, MILLI_SECONDS_OF_WEEK, START_DATE } from "./constant";

/**
 * 根据开始时间和课程时长计算结束时间，返回结束的时间字符串
 * @param {string} startTime 开始时间
 * @param {string} duration 持续分钟
 */
export const computeEndTime = (startTime, duration) => {
  if (!startTime || !duration) return '';
  let start = startTime.split(":").map(e => parseInt(e));
  let hours = Math.ceil(parseInt(duration) / 60) + start[0],
    min = parseInt(duration) % 60 + start[1];
  min = min < 10 ? `0${min}` : min;
  return `${hours}:${min}`;
}

/**
 * 移除个位数前的0，用于适配USYD课程数据接口中的activeDays
 * @param {string} date - 'dd/mm/yyyy'
 */
export const removeZero = (date) => {
  return date.split('/').map(n => parseInt(n)).join('/');
}

/**
 * 将日期对象转换为相应的格式，
 * mm-dd用于显示课程白周中日期
 * dd/mm/yyyy用于请求当日课程
 * @param {array} dates 
 */
export const formatDates = (dates, format = 'dd/mm/yyyy') => {
  return dates.map(date => {
    let formated = "";
    switch (format) {
      case 'dd/mm/yyyy':
        formated = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        break;
      case 'mm-dd':
        formated = `${date.getMonth() + 1}-${date.getDate()}`
        break;
      default:
        formated = date.toDateString();
    }
    return formated;
  })
}

/**
 * 获取某天所在的周一。用于生成周一到周五的日期
 * @param {date} date 
 */
const getMondayDate = date => {
  let dd = new Date(date)
  let week = dd.getDay(); //获取时间的星期数
  let minus = week ? week - 1 : 6;
  dd.setDate(dd.getDate() - minus); //获取周一日期
  return dd;
}

export const getDatesByWeek = (currentWeek, startDate) => {
  // 根据周数计算该周周一的日期
  const START_DATE = startDate
  const diff = MILLI_SECONDS_OF_WEEK * currentWeek;
  const targetDate = diff + START_DATE.valueOf();
  const monday = new Date(targetDate);
  const dates = getDates(monday);
  return dates;
}

/**
 * 获取本周从周一到周日的日期
 * 格式为mm-dd
 * @param {boolean} date - 默认根据今天的日期计算本周的日期
 * @returns {array} 包含本周日期的数组
 */
export const getDates = (date = new Date()) => {
  let weekdaysDate = []
  for (let i = 0; i < 5; i++) {
    let monday = getMondayDate(date);
    let newDate = new Date(monday.setDate(monday.getDate() + i));
    weekdaysDate.push(newDate);
  }
  return weekdaysDate;
}

/**
 * 基于9/8为第二学期第一周第一天，计算现在是第几周,
 * 第八周为break，不计入教学周
 */
export const getCurrentWeek = (startDate) => {
  const targetDate = new Date();
  const diff = targetDate.valueOf() - START_DATE.valueOf();
  
  return diff <= 0 ? 1 : Math.ceil(diff / MILLI_SECONDS_OF_WEEK)
}

/**
 * 将澳洲时间转换成北京时间
 * @param {string} time 
 */
export const convert2CST = time => {
  if (!time) return;
  let cst = parseInt(time.split(":")[0]) - (AU_TIME_ZONE === 'AEDT' ? 3 : 2);
  if (cst < 10) cst = "0" + cst;
  return cst + ":00";
}