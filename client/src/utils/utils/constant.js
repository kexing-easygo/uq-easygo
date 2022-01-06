import { APPID, RESOURCE_APP_ID, RESOURCE_ENV, BRANCH_NAME } from '../config.json'
import { SUMMER_WEEKS, SUMMER_START_DATE_STRING, SEMESTER_WEEKS, SEMESTER_START_DATE_STRING, SEMESTERS, CURRENT_SEMESTER } from "../config.json"
import { CLASS_MODE_OPTIONS, AU_TIME_ZONE, SEMESTER_BREAK, WELCOME_MESSAGE, SEARCHBAR_DEFAULT_PLACEHOLDER } from "../config.json"
import  Taro  from "@tarojs/taro";


// 课程表常数
export const NUMBERS = {
  0: "Break",
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
  10: "十",
  11: "十一",
  12: "十二",
  13: "十三"
}
export const DAY_OF_WEEK = {
  'Mon': 1,
  'Tue': 2,
  'Wed': 3,
  'Thu': 4,
  'Fri': 5
}
export const WEEK_DAYS = ["周一", "周二", "周三", "周四", "周五"];
export const HOURS = 13; // 每一天的小时数，即课程表格子的行数
export const WEEKS_NO = SUMMER_WEEKS; // 默认周数为summer的长度
export const BREAK = SEMESTER_BREAK; // 第八周为break
export const MILLI_SECONDS_OF_WEEK = 1000 * 60 * 60 * 24 * 7;
export const SUMMER_START_DATE = new Date(SUMMER_START_DATE_STRING)
export const SEMESTER_START_DATE = new Date(SEMESTER_START_DATE_STRING);
export const START_DATE = SUMMER_START_DATE;  // 默认开始日期为summer开始日期
export const COLORS = ['#FA5151', '#FFC300', '#07C160', '#1485EE', '#576B95']; // 可选择的课程模块背景
export const DEFAULT_REMARK = "我是一个没有感情的备注框…可以随时修改我" // 默认的备注信息

// 我的
export const ICON_COLOR = '#89acee';
export const ICON_SIZE = 24;

// 由config导出的环境变量
export {
  APPID,                          // app id
  RESOURCE_APP_ID, RESOURCE_ENV,  // 资源方，可选填
  BRANCH_NAME,                    // 环境变量
  AU_TIME_ZONE,                   // AEST(冬令时 CST-2) or AEDT(夏令时 CST-3)
  SUMMER_WEEKS, SEMESTER_WEEKS,   // 夏季课程一共几周，正常学期一共几周
  SEMESTERS,                      // 可选择的学期范围
  CURRENT_SEMESTER,               // 当前学期
  CLASS_MODE_OPTIONS,             // 可选择的上课模式
  WELCOME_MESSAGE,                // 开屏欢迎语
  SEARCHBAR_DEFAULT_PLACEHOLDER   // 搜索框的默认placeholder
}
