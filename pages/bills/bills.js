// pages/bills/bills.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'1',
    params:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {wybId} = options
    this.getBill(wybId)
  },
  getBill(id) {
    let _this = this;
    var url = Api.housing.myCusHousingCoin
    var parm = {
      id
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    console.log(parm)
    Common.request.post(url, parm, function (data) {
      if (data.status == 'OK') {
        _this.setData({
          orderInfo: data.message
        })
      }
    })
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
    return {
      title: '账单详情',
      path: 'pages/bills/bills'
    }
  }
})