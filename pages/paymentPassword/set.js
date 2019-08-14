// pages/paymentPassword/set.js
const Utils = require("../../utils/util");
const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    showRegisterToast: false,
    cellPhone: "",
    codeTxt: "获取验证码",
    authCode: "",
    pwdInput: "",
    btnDisabled: false,
    captchaShow: false,
    captchaReload: false,
    type: 0,
    options: {
      appId: "7035b7125c0596a0ee719ef95e3f5f30",
      style: "popup"
    }
  },
  async submit() {
    console.log("type:",this.data.type)
    let cellPhone = this.data.cellPhone.toString()
    let authCode = this.data.authCode.toString()
    let pwdInput = this.data.pwdInput.toString()
    let type = this.data.type.toString()
    let user = Common.getUser() || Common.getStorage("user");
    const { userCode } = user;
    const url = Api.housing.saveCusPayPw;
    const payPassWord = pwdInput;
    let params = {
      cellPhone,
      payPassWord,
      authCode,
      userCode,
      type
    };
    params.sign = Common.md5sign(params);
    try {
      let res = await Common.ajax.post(url, params);
      wx.showToast({
        title: "设置成功",
        icon: "none",
        duration: 1500
      });
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        });
      },2000)
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: "none"
      });
    }
  },
  handleSubmit() {
    let { cellPhone, authCode, pwdInput } = this.data;

    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: "请输入正确的手机号码!",
        icon: "none"
      });
    } else if (!authCode) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none"
      });
    } else if (!pwdInput) {
      wx.showToast({
        title: "请输入密码",
        icon: "none"
      });
    } else if (pwdInput * 1 != pwdInput) {
      wx.showToast({
        title: "密码格式不正确",
        icon: "none"
      });
    } else {
      this.submit();
    }
  },
  pwdInput(e) {
    this.setData({
      pwdInput: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      authCode: e.detail.value
    });
  },
  phoneInput(e) {
    this.setData({
      cellPhone: e.detail.value
    });
  },
  showRegToast() {
    this.setData({
      showRegisterToast: true
    });
  },
  showCaptcha() {
    this.setData({
      showRegisterToast: false,
      captchaShow: true
    });
  },
  async getCode() {
    let { cellPhone } = this.data;
    if (!Utils.validatePhoneNum(cellPhone)) {
      wx.showToast({
        title: "手机号码格式不正确",
        icon: "none"
      });
      return;
    }
    this.showCaptcha();
  },
  async requestCode(token) {
    let params = {
      cellPhone: this.data.cellPhone,
      type: "103",
      token: token.detail
    };
    let sign = Common.md5sign(params);
    let url = `${Api.common.getmsAuthCode}?cellPhone=${params.cellPhone}&type=${
      params.type
    }&sign=${sign}&token=${params.token}`;
    try {
      return await Common.ajax.get(url);
    } catch (err) {
      wx.showModal({
        content: err,
        showCancel: false
      });
    }
  },
  // 验证码成功回调
  captchaSuccess: function(token) {
    Common.codeTime(this);
    this.requestCode(token);
    this.setData({
      captchaShow: false
    });
  },
  // 验证码关闭回调
  captchaHide: function() {
    this.setData({
      captchaShow: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let type = app.globalData.pwType
    console.log("type:",type)
    this.setData({
      type
    });
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {}
});
