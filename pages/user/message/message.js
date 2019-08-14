const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global
 
Page({
  data: {
    canLogin:false,
    cellPhone: '',
    codeTxt: '获取验证码',
    authCode: '',
    btnDisabled: false,
    captchaShow: false,
    captchaReload: false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
  },
  //物业拼拼使用协议
  GoAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  async loginCode(e) {
    let that=this
    let { cellPhone, authCode, canLogin } = that.data
    let targetUrl = Common.getStorage('targetUrl')
    let targetUrl1 = Common.getStorage('targetUrl1')
    if (!canLogin) return;
    let url = Api.user.loginCode
    let params = {
      cellPhone,
      authCode
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    try {
      let res = await Common.ajax.post(url, reqParams)
      console.log(res)
      let user = res.message
      let userCode = user.userCode
      Common.setStorage('userCode')
      Common.setStorage('user',res.message)
      let isBinding = res.message.isBinDing
      console.log('isBinding==', isBinding)
      if (!isBinding){
        that.nearHousing()
        Common.saveUser(user)
        Common.saveLogin()
        if (targetUrl) {
          Common.removeStorage('targetUrl')
          return wx.redirectTo({
            url: targetUrl
          })
        }
      }else{
        Common.setUserCode(user.userCode)
        // Common.gotoBind()
      }
      Common.gotoIndex()
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
  },
  nearHousing(latitude, longitude) {
    let that = this
    console.log(that.data)
    latitude = Common.getStorage('latitude').toString()
    longitude = Common.getStorage('longitude').toString()
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
        //  console.log('--==user==--',user)
        //  Common.saveUser(user)
        let dwaddress = data.message.address
        let storeId = data.message.storeId || Common.storeId2()
        let wyname = data.message.storeName
        user.storeId = storeId
        user.wyname = wyname
        user.dwaddress = dwaddress
        Common.setStorage('dwaddress', dwaddress)
        Common.setStorage('wyname', wyname)
        Common.setStorage('storeId', storeId)
        Common.saveUser(user)
        Common.getUser(user);
        Common.setStorage('user',user)
        console.log('--==--==user==--==', user)
        that.setData({
          dwaddress,
          storeId,
          wyname
        })
      }else{
        console.log('aaaaaaaaaaaaa', Common.storeId2())
        let storeId = Common.storeId2()
        Common.setStorage('storeId', storeId)
      }
    })
  },
  getCode() {
    let { cellPhone } = this.data
    console.log(cellPhone)
    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    } else {
      Common.setStorage('cellPhone', cellPhone)
      this.setData({
        captchaShow: true
      })
    }
  },
  authCodeInput(e) {
    let value = e.detail.value
    let { cellPhone } = this.data

    let canLogin = false
    if (value && cellPhone) {
      canLogin = true
    }

    this.setData({
      canLogin,
      authCode: value
    })
  },
  // 验证码成功回调
  captchaSuccess: function (token) {
    Common.codeTime(this)
    this.requestCode(token)
    this.setData({
      captchaShow: false
    })
  },
  async requestCode(token) {
    let params = { cellPhone: this.data.cellPhone, type: '102', token: token.detail,userType:2 }
    let sign = Common.md5sign(params);

    let url = `${Api.common.getmsAuthCode}?cellPhone=${params.cellPhone}&type=${params.type}&sign=${sign}&token=${params.token}&userType=2`
    try {
      return await Common.ajax.get(url)
    } catch (err) {
      wx.showModal({
        content: err,
        showCancel: false
      })
    }
  },
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
  },
  cellphoneInput(e) {
    let value = e.detail.value
    let {authCode} = this.data
    let canLogin=false
    if(value && authCode){
      canLogin = true
    }
    this.setData({
      canLogin,
      cellPhone: value
    })
  },
  // GoCode: function () {
  //   wx.navigateTo({
  //     url: '/pages/user/codelogin/codelogin',
  //   })
  // },
  // GoWechat: function () {
  //   wx.navigateTo({
  //     url: '/pages/user/wxlogin/wxlogin',
  //   })
  // },
  /**

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  gotologin() {
    wx.redirectTo({
      url: '/pages/home/home'
    })
  },
onshow(){
  Common.isLogin() ? Common.gotoIndex() : this.gotologin();
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '验证码登录',
      path: 'pages/message/message'
    }
  }
})