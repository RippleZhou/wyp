// pages/gowy/gowy.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  resetWy(){
    wx.navigateTo({
      url: '/pages/bindAddress/bindAddress',
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
  nearHousing :function () {
    let that = this
    console.log(that.data)
    let latitude = Common.getStorage('latitude').toString()
    let longitude = Common.getStorage('longitude').toString()
    let url = Api.housing.nearestStore
    let params = {
      longitude,
      latitude
    }
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(url, params, function (data) {
      if (data.status == "OK") {
        console.log(data);
        let user = Common.getStorage('user');
        console.log('user===--==', user)
        let dwaddress = data.message.address
        let storeId = data.message.storeId
        let wyname = data.message.storeName
        user.storeId = storeId
        user.wyname = wyname
        user.dwaddress = dwaddress
        Common.setStorage('user', Object.assign(user, { wyname: wyname }))
        Common.setStorage('user', Object.assign(user, { storeId: storeId }))
        Common.setStorage('user', Object.assign(user, { dwaddress: dwaddress }))
        Common.setStorage('dwaddress', dwaddress)
        Common.setStorage('wyname', wyname)
        Common.setStorage('storeId', storeId)
        Common.saveUser(user)
        Common.getUser(user);
        console.log('--==--==user==--==', user)
        that.setData({
          dwaddress,
          storeId,
          wyname
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.nearHousing();
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