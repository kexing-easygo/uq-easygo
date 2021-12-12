export default {
  pages: [
    'pages/launch/index',
    'pages/index/index',
    'pages/profile/index',
    'pages/basic-setting/index',
    'pages/basic-info/index',
    'pages/bind-mobile/index',
    'pages/bind-email/index',
    'pages/timetable/index',
    'pages/add-class/index',
    'pages/about-us/index',
    'pages/calculator/index',
    'pages/calculator-result/index',
    'pages/card-management/index',
    'pages/course-management/index',
    'pages/delete-course/index',
  ],
  window: {
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  tabBar: {
    // custom: true, // 自定义全局tab组件仅限微信小程序，其他端和H5, RN均不支持
    selectedColor: '#6190e8',
    list: [{
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: './assets/images/首页.png',
      selectedIconPath: './assets/images/首页.png'
    }, {
      pagePath: 'pages/profile/index',
      text: '我的',
      iconPath: './assets/images/个人中心.png',
      selectedIconPath: './assets/images/个人中心.png'
    }]
  }
}
