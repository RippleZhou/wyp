// pages/mywy/mywy.js
Page({

  /**
   * 页面的初始数据
   */
  show: {
    type: Boolean,
    value: false
  },
  //modal的高度
  height: {
    type: String,
    value: '80%'
  },
  data: {
    cancelReason: [
      { title: '确认重新绑定' },
      { content: '重新绑定物业公司，之前的物业币即被清空，您确定要重新绑定物业？' }
    ],
  },
  clickMask() {
    // this.setData({show: false})
  },

  cancel() {
    this.setData({ show: false })
    this.triggerEvent('cancel')
  },

  conFirm() {
    this.setData({ show: false })
    this.triggerEvent('conFirm')
    wx.navigateTo({
      url: '/pages/bindAddress/bindAddress',
    })
  },
  resetWy: function (e) {
    this.setData({
      show: {
        type: Boolean,
        value: true
      },
      //modal的高度
      height: {
        type: String,
        value: '100%'
      },
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})