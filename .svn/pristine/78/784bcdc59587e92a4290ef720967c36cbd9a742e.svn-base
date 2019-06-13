var app = getApp()
Page({
  data: {
    currentTab: 0,
    screenHeight:0
  },
  scrolltolower(e){
    let dataset = e.currentTarget.dataset
    let {offset} = this.data
    if (offset) {//有数据就继续加载
      console.log('有数据就继续加载')
      // _this.getList(dataset.index)
      // _this.setData({
      //   tipTxt: '加载中'
      // })
      // console.log(_this.data.offset)
    } else {
      console.log('没有更多数据了')
      // _this.setData({
      //   tipTxt: '没有更多数据了'
      // })
    }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        console.log('res.windowHeight', res.windowHeight)
        that.setData({
          screenHeight: (res.windowHeight-55)*2
        })
      }
    })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})
