const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    cellPhone:'',
    pwdInput:'',
    authCode:'',
    codeTxt: '获取验证码',
    captchaShow: false,
    captchaReload: false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
  },
  async resetPassword() {
    let { cellPhone, authCode, pwdInput } = this.data
    let url = Api.user.resetPassword
    let params = { cellPhone, passWord: pwdInput, authCode }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    try {
      let res = await Common.ajax.post(url, reqParams)
      wx.showModal({
        title: '密码找回成功，请重新登录',
        showCancel: false,
        success() {
          wx.navigateTo({
            url: '/pages/home/home',
          })
        }
      })
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
  },
  submit(){
    let { cellPhone, authCode, pwdInput } = this.data

    console.log('pwdInput', pwdInput)

    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: '请输入正确的手机号码!',
        icon: 'none'
      })
    } else if (!authCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (!pwdInput) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    } else if (!Common.validPassword(pwdInput)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: 'none'
      })
    } else {
      this.resetPassword()
    }
  },
  // 验证码关闭回调
  captchaHide: function () {
    this.setData({
      captchaShow: false
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
    let params = { cellPhone: this.data.cellPhone, type: '103', token: token.detail }
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
  getCode() {
    let { cellPhone } = this.data
    console.log('cellPhone:', cellPhone)
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
  codeInput(e) {
    this.setData({
      authCode: e.detail.value
    })
  },
  cellphoneInput(e) {
    this.setData({
      cellPhone: e.detail.value
    })
  },
  pwdInput(e) {
    this.setData({
      pwdInput: e.detail.value
    })
  },
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
  onShareAppMessage: function (res) {
    return {
      title: '找回密码',
      path: 'pages/forget/forget'
    }
  }
})