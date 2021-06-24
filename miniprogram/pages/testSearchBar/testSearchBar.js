// miniprogram/pages/testSearchBar.js
Page({

  /**
   * Page initial data
   */
  data: {
    inputShowed: false,
    inputVal: ""
  },
  onLoad() {
      this.setData({
          search: this.search.bind(this)
      })
    //   console.log(this.data.search)
  },
  search: function (value) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}])
          }, 200)
      })
  },
  selectResult: function (e) {
      console.log('select result', e.detail)
  },
  testCrontab: function() {
    wx.cloud.callFunction({
      name: 'database',
      data :{
      },
      success: res => {
          console.log(res)
      },
      fail: err => {
          console.error(err)
      }
    })
  }
})