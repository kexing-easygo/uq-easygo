// components/my-searchbar.js
Component({
  /**
   * Component properties
   */
  properties: {
    focus: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: "搜索"
    },
    inputValue: {
      type: String,
      value: ''
    },
    search: {
      type: Function,
      value: null
    },
    cancel: {
      type: Boolean, 
      value: true
    },
    throttle: {
      type: Number,
      value: 500
  },

  },

  /**
   * Component initial data
   */
  data: {
    result: []
  },
  lastSearch: Date.now(),
  lifetimes: {
    attached: function attached() {
        if (this.data.focus) {
            this.setData({
                searchState: true
            });
        }
    }
},
  /**
   * Component methods
   */
  methods: {
    clearInput: function clearInput() {
      this.setData({
        inputValue: ''
      })
      this.triggerEvent('clear');
    },
    inputFocus: function inputFocus(e) {
      this.setData({
        focus: true,
        searchState: true
    });
      this.triggerEvent("focus", e.detail.value)
    },
    inputBlur: function inputBlur(e) {
      this.setData({
          focus: false,
          searchState: false
      });
      this.triggerEvent('blur', e.detail);
    },
    showInput: function showInput() {
      this.setData({
          focus: true,
          searchState: true
      });
    },
    inputChange: function inputChange(e) {
      var _this = this;
      console.log()
      this.setData({
          inputValue: e.detail.value
      });
      this.triggerEvent('input', e.detail);
      if (Date.now() - this.lastSearch < this.data.throttle) {
          return;
      }
      if (typeof this.data.search !== 'function') {
          return;
      }
      this.lastSearch = Date.now();
      this.timerId = setTimeout(function () {
          _this.data.search(e.detail.value).then(function (json) {
              _this.setData({
                  result: json
              });
          }).catch(function (err) {
              console.log('search error', err);
          });
      }, this.data.throttle);
  },
    selectResult: function selectResult(e) {
      var index = e.currentTarget.dataset.index;

      var item = this.data.result[index];
      this.triggerEvent('selectresult', { index: index, item: item });
  }
  }
})
