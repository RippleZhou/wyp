const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellPhone: '',
    codeTxt: '获取验证码',
    authCode: '',
    userInfo: null,
    pwdInput: '',
    btnDisabled: false,
    captchaShow: false,
    captchaReload: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
  },
  getCode() {
    console.log('获取验证码')
    let { cellPhone } = this.data

    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        captchaShow: true
      })
    }
  },
  async requestCode(token) {
    let params = { cellPhone: this.data.cellPhone, type: '110', token: token.detail }
    let sign = Common.md5sign(params);

    let url = `${Api.common.getmsAuthCode}?cellPhone=${params.cellPhone}&type=${params.type}&sign=${sign}&token=${params.token}`
    try {
      return await Common.ajax.get(url)
    } catch (err) {
      wx.showModal({
        content: err,
        showCancel: false
      })
    }

  },
  cellphoneInput(e) {
    this.setData({
      cellPhone: e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      authCode: e.detail.value
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
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
    })
  },

  async wxBindphone() {
    let { cellPhone, authCode, nickName, imageUrl } = this.data
    let wxOpenId = Common.getWxOpenId()

    console.log('wxopenid:', wxOpenId)
    console.log('cellPhone:', this.data.cellPhone)
    console.log('authCode:', this.data.authCode)

    let url = Api.user.wxBindCellPhone
    let params = {
      cellPhone,
      authCode,
      wxOpenId,
      nickName,
      imageUrl
    }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }

    try {
      let res = await Common.ajax.post(url, reqParams)
      let { isLogin, bindingStatus, userCode } = res.message
      let user = await Common.getUserFromApi(userCode)

      //没有绑定物业
      if (!bindingStatus) {
        // Common.saveLogin()
        // Common.saveUser(user)
        //跳绑定
        Common.setStorage('userCode', userCode)
        // wx.navigateTo({
        //   url: '/pages/bindAddress/bindAddress'
        // })
      } else {
        if (isLogin) {
          Common.saveLogin()
          Common.saveUser(user)
          let targetUrl = Common.getStorage('targetUrl')
          if (targetUrl) {
            Common.removeStorage('targetUrl')
            return wx.redirectTo({
              url: targetUrl
            })
          }
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        //跳首页
      }
    } catch (err) {
      wx.showModal({
        title: err.message,
        showCancel: false
      })
       //跳首页
    }
    // bindingStatus :   0
    // info   :   "手机号绑定成功"
    // isLogin   :   1
    // storeId   :   -1
    // userCode   :   "TZ22KLSA3DWN2"
    // wxBindStatus   :   1
  },
  onLoad: function (options) {
    console.log(options.nickName)
    console.log(options.imageUrl)
    let { nickName, imageUrl } = options
    this.setData({
      nickName,
      imageUrl
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
  onShareAppMessage: function (res) {
    return {
      title: '绑定手机号',
      path: 'pages/wxlogin/wxlogin'
    }
  }
})