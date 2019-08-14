// const QQMapWX = require('../utils/qqmap-wx-jssdk.min.js')
// var demo = new QQMapWX({
//   key: 'HVUBZ-JFRH4-XZNUL-DA6AP-TXK45-4IBUM' // 必填
// });
var json = require('../../data/home_data.js')
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();
let {
  regeneratorRuntime
} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sign:false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
  },
  onLoad: function(options) {
    console.log("options:",options)
  },
  async nearHousing() {
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
        console.log("nearHousing:",data);
        console.log(data.message.storeId, '******************',Common.storeId2())
        let storeId = data.message.storeId || Common.storeId2();
        let address = data.message.address
        let storeName = data.message.storeName
        let user = Common.getStorage('user');
        Common.setStorage('user', Object.assign(user, { storeId: storeId })) 
        Common.setStorage('user', Object.assign(user, { address: address })) 
        Common.setStorage('user', Object.assign(user, { storeName: storeName })) 
        Common.saveUser(user)
        // Common.gotoLogin();
        console.log('--==--==user==--==', user)
      } else {
        console.log('aaaaaaaaaaaaa', Common.storeId2())
        let storeId = Common.storeId2()
        Common.setStorage('storeId', storeId)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onGotUserInfo: function (e) {
    console.log(e)
    console.log("errMsg:",e.detail.errMsg)
    console.log("userInfo:",e.detail.userInfo)
    Common.setStorage('userInfo', JSON.parse(e.detail.rawData))
    console.log('aaaaa:', e.detail.rawData)
    try {
      let {
        avatarUrl,
        nickName
      } = JSON.parse(e.detail.rawData)
      Common.gotoLogin()
      // Common.GoWechat(nickName, avatarUrl)
    } catch (err) {
      console.log(err)
      wx.showModal({
        title: '授权失败',
        showCancel: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow: function() {
    let targetUrl = Common.getStorage('targetUrl')
    let targetUrl1 = Common.getStorage('targetUrl1')
    console.log('targetUrl', targetUrl)
    this.nearHousing()
    // Common.gotoIndex();
    var that=this
    var token = wx.getStorageSync('token')
    console.log('token===',token)
    if (token == '' || token == undefined) {
      wx.getSetting({
        success: function (res) {
          console.log("getSetting:",res)
          if (res.authSetting['scope.userInfo']) {
            console.log("sign:", that.data.sign)
            wx.getUserInfo({
              success: function (de) {
                console.log("用户已经授权过",de)
                //用户已经授权过
                let e={
                  detail: de
                  }
                console.log("用户已经授权过2", e)
                that.onGotUserInfo(e)

              }
            })
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            // that.onGotUserInfo()
          } else {
            console.log('头像授权失败')
            that.setData({
              sign: true
            })
          }
        }
      })
    } else {
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})