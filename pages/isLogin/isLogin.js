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

  },

  onLoad: function (options) {

  },
  nearHousing (){
    let that = this
    console.log(that.data)
    let latitude = Common.getStorage('latitude').toString()
    let longitude = Common.getStorage('longitude').toString()
    console.log('latitude', latitude)
    console.log('longitude', longitude)
    let url = Api.housing.nearestStore
    let params = {
      longitude,
      latitude
    }
    console.log(params)
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(url, params, function (data) {
      if (data.status == "OK") {
        let user = Common.getStorage('user')
        console.log('****user==--==', user)
        console.log(data);
        let dwaddress = data.message.address
        let storeId = data.message.storeId
        let wyname = data.message.storeName
        Common.setStorage('user', Object.assign(user, { wyname: wyname }))
        Common.setStorage('user', Object.assign(user, { storeId: storeId }))
        Common.setStorage('user', Object.assign(user, { dwaddress: dwaddress }))
        Common.saveUser(user)
        Common.gotoIndex()
        console.log('--==--==user==--==', user)
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
  gotologin() {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },
  onShow: function () {
    let that = this
    wx.removeStorageSync('cartItemsNum');
    wx.login({
      success(res) {
        if (res.code) {
          let params = {
            jsCode: res.code,
          }
          let MD5signStr = Common.md5sign(params);
          let reqParams = {
            sign: MD5signStr,
            ...params
          }
          //发起网络请求
          wx.request({
            url: Api.user.wXLogin,
            method: 'post',
            data: reqParams,
            success(res) {
              console.log(res)
              let user = res.data.message
              let targetUrl = Common.getStorage('targetUrl')
              let targetUrl1 = Common.getStorage('targetUrl1')
              Common.setStorage('user', user);
              console.log('targetUrl', targetUrl)
              console.log('targetUrl1', targetUrl1)
              Common.removeStorage('targetUrl')
              Common.removeStorage('targetUrl1')
              if (targetUrl) {
                return wx.redirectTo({
                  url: targetUrl
                })
              }
              if (targetUrl1) {
                return wx.redirectTo({
                  url: targetUrl1
                })
              }
              if (user.wxBindStatus) {
                Common.setStorage('user', user);
                if (user.isBinding) {
                  console.log('已经绑定物业，已登录过')
                  Common.setStorage('users_', 2)
                  Common.gotoIndex()
                } else {
                  console.log('未绑定物业 ，已登录过')
                  Common.setStorage('users_',1)
                  Common.gotoHome()
                }
              }else {
                console.log('新用户')
                Common.setStorage('users',1)
                Common.gotoHome()
              }
              Common.setWxOpenId(res.data.message.wxOpenId)
            },
            fail(err) {
              wx.showToast({
                title: err,
                icon: 'none'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
    // let islogin=Common.getStorage('islogin');
    // console.log(islogin,'islogin')
    // console.log(Common.isLogin())
    // islogin ? Common.gotoIndex() : this.gotologin()
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
