const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    showRegisterToast: false,
    cellPhone: '',
    codeTxt: '获取验证码',
    authCode: '',
    pwdInput: '',
    btnDisabled: false,
    captchaShow: false,
    captchaReload: false,
    options: {
      appId: '7035b7125c0596a0ee719ef95e3f5f30',
      style: 'popup'
    },
  },
  async register() {
    let { cellPhone, authCode, pwdInput } = this.data
    let url = Api.user.register
    let params = { cellPhone, passWord: pwdInput, authCode }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    try {
      let res = await Common.ajax.post(url, reqParams)

      wx.navigateTo({
        url: '/pages/home/home',
      })
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    }
  },
  doRegister() {
    let { cellPhone, authCode, pwdInput } = this.data

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
      this.register()
    }
  },
  pwdInput(e) {
    this.setData({
      pwdInput: e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      authCode: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      cellPhone: e.detail.value
    })
  },
  async isRegister(cellPhone) {
    let url = Api.user.checkCellPhoneExist
    let params = { cellPhone }
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params }
    let res =await Common.ajax.post(url, reqParams)
    return res.message
  },
  showRegToast() {
    this.setData({
      showRegisterToast: true
    })
  },
  showCaptcha() {
    this.setData({
      showRegisterToast: false,
      captchaShow: true
    })
  },
 async getCode() {
    let { cellPhone } = this.data

    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    } else {
      let isreg =await this.isRegister(cellPhone)
      console.log('isreg',isreg)
      isreg == '手机号码已注册' ? this.showRegToast() : this.showCaptcha()

    }
  },
  async requestCode(token) {
    let params = { cellPhone: this.data.cellPhone, type: '101', token: token.detail, userType:'2'}
    let sign = Common.md5sign(params);

    let url = `${Api.common.getmsAuthCode}?cellPhone=${params.cellPhone}&type=${params.type}&sign=${sign}&token=${params.token}&userType=${params.userType}`
    try {
      return await Common.ajax.get(url)
    } catch (err) {
      wx.showModal({
        content: err,
        showCancel: false
      })
    }

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
      title: '注册',
      path: 'pages/register/register'
    }
  }
})