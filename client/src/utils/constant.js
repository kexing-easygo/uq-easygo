// 环境变量
export const APPID = 'wx363ec811fefffb9b';
export const RESOURCE_APP_ID = 'wxc51fd512a103a723'
export const RESOURCE_ENV = 'uqeasygo1'
export const BRANCH_NAME = 'UQ'
// 时间
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
export const WEEKS_NO = 14; // 包含break一共14周
export const BREAK = 10; // 第八周为break
export const AU_TIME_ZONE = 'AEDT' // AEST(冬令时 CST-2) or AEDT(夏令时 CST-3)
export const START_DATE = new Date("Mon Jul 26 2021 00:00:00 GMT+1000 (Australian Eastern Standard Time)");
export const MILLI_SECONDS_OF_WEEK = 1000 * 60 * 60 * 24 * 7;

// 课程表
export const COLORS = ['#FA5151', '#FFC300', '#07C160', '#1485EE', '#576B95']; // 可选择的课程模块背景
export const DEFAULT_REMARK = "我是一个没有感情的备注框…可以随时修改我" // 默认的备注信息
export const SEMESTERS = ['Semester 2, 2021', 'Semester 1, 2022', 'Semester 2, 2022']; // 可选择的学期范围
export const CURRENT_SEMESTER = 'Semester 2, 2021' // 当前学期
export const CLASS_MODE_OPTIONS = ['Internal', 'External']; // 可选择的上课模式

// 我的
export const ICON_COLOR = '#89acee';
export const ICON_SIZE = 24;