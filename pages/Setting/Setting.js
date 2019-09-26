const Utils = require("../../utils/util");
const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    setted: false
  },
  goHome() {
    wx.navigateTo({
      url: "/pages/user/codelogin/codelogin"
    });
  },
  logout() {
    let storeId = Common.getStorage('storeId')
    Common.removeStorage('user')
    Common.removeLogin();
    Common.gotoHome()
    // Common.gotoIsLogin()
    Common.removeStorage('targetUrl')
    Common.removeStorage('targetUrl1')
    Common.removeStorage('targetUrl2')
    // this.goHome();
  },
  goAbout: function() {
    wx.navigateTo({
      url: "/pages/about/about"
    });
  },
  goSet: function() {
    const type = this.data.setted ? 1 : 0;
    getApp().globalData.pwType = type
    wx.navigateTo({
      url: "/pages/paymentPassword/set?type=" + type
    });
  },
  goModify: function() {
    wx.navigateTo({
      url: "/pages/paymentPassword/modify"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let user = Common.getUser() || Common.getStorage("user");
    const { userCode } = user;
    const sign = Common.md5sign({ userCode });
    Common.ajax
      .post(Api.housing.getCusPayPw, { userCode, sign })
      .then(data => {
        if (data.message.isSettingPayPw) {
          this.setData({
            setted: true
          });
        }
        console.log("resolve:", data);
      })
      .catch(data => {
        console.log("reject:", data);
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
  onShareAppMessage: function() {
    return {
      title: "设置",
      path: "pages/Setting/Setting"
    };
  }
});
