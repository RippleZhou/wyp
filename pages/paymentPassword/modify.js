// pages/paymentPassword/modify.js
const Utils = require("../../utils/util");
const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pwdOld: "",
    pwdNew: "",
    pwdNewRe: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onShareAppMessage: function() {},

  handleOld(e) {
    this.setData({
      pwdOld: e.detail.value
    });
  },
  handleNew(e) {
    this.setData({
      pwdNew: e.detail.value
    });
  },
  handleNewRe(e) {
    this.setData({
      pwdNewRe: e.detail.value
    });
  },
  handleSubmit() {
    const { pwdOld, pwdNew, pwdNewRe } = this.data;
    const pwds = [pwdOld, pwdNew, pwdNewRe];
    for (let i = 0; i < pwds.length; i++) {
      if (pwds[i].trim() === "") {
        wx.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return
      }
      if (pwds[i] * 1 != pwds[i]) {
        wx.showToast({
          title: "密码格式不正确",
          icon: "none"
        });
        return
      }
    }
    if (pwdNew !== pwdNewRe) {
      wx.showToast({
        title: "密码输入不一致",
        icon: "none"
      });
      return
    }
    this.submit();
  },
  async submit() {
    let { pwdOld, pwdNew } = this.data;
    let user = Common.getUser() || Common.getStorage("user");
    const { userCode } = user;
    const url = Api.housing.modifyWithdrawPassword;
    const params = {
      oldPayPassWord: pwdOld,
      newPayPassWord: pwdNew,
      userCode
    };
    params.sign = Common.md5sign(params);
    try {
      let res = await Common.ajax.post(url, params);
      wx.showToast({
        title: "设置成功",
        icon: "none",
        duration: 1500
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    } catch (err) {
      wx.showToast({
        title: err.message,
        icon: "none"
      });
    }
  }
});
