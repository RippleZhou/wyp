var json = require("../../data/home_data.js");
const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    wyb: "0",
    showDetailButton: false,
    wyblist: [
      // {
      //   shoppingNum: 1223487837434723,
      //   timer: "2019 - 02 - 25 09: 40: 21",
      //   acount: 240
      // }
    ]
  },
  GoBill: function(e) {
    let wybid = e.currentTarget.dataset.wybid;
    let type = e.currentTarget.dataset.type;
    let orderid = e.currentTarget.dataset.orderid;

    if (!type) {
      wx.navigateTo({
        url: "/pages/bills/bills?wybid=" + wybid
      });
    } else {
      wx.navigateTo({
        url: "/pages/order-detail/order-detail?orderId=" + orderid
      });
    }
  },
  GoMyDetail: function() {
    wx.navigateTo({
      url: "/pages/wyb-detail/wyb-detail"
    });
  },
  GoWyExplain: function() {
    wx.navigateTo({
      url: "/pages/wybexplain/wybexplain"
    });
  },
  onLoad: function(options) {},

  getHoming(userCode) {
    let _this = this;
    var url = Api.housing.myHousing;
    var userCode = _this.user.userCode;
    var parm = {
      userCode
    };
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr;
    Common.request.post(Api.housing.myHousing, parm, function(data) {
      if (data.status == "OK") {
        console.log(data);
        _this.setData({
          orderInfor: data.message,
          parmInfo: data.params
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  async getList(userCode) {
    let url = Api.housing.list;
    let params = {
      userCode,
      type: 2,
      limit: 10,
      offset: 1
    };
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params };
    let res = await Common.ajax.post(url, reqParams);
    return res.rows;
  },
  async onShow() {
    var user = Common.getUser() || Common.getStorage("user");
    // var isLogin = Common.isLogin()
    console.log("----user--", user);
    let isBinding = user.isBinding;
    if (isBinding) {
      // var user = Common.getUser()||Common.getStorage('user')
      this.setData({
        user
      });

      try {
        let userwyb = await Common.getUserFromApi(user.userCode);
        let list = await this.getList(user.userCode);
        if (list.length == 0) {
          this.setData({
            showDetailButton: true
          });
        } else {
          this.setData({
            showDetailButton: false
          });
        }
        let details = [];
        list.forEach(item => {
          if (details.length < 10) {
            details = details.concat(item.details);
          }
        });
        if (details.length > 10) details = details.slice(0, 9);
        this.setData({
          wyb: userwyb.message.residualFee,
          wyblist: details
        });
      } catch (error) {
        wx.showToast({
          title: error.message,
          icon: "none"
        });
      }
    }
    // else {
    //   Common.gotoLogin('/pages/mywyb/mywyb')
    // }
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
      title: "我的物业币",
      path: "pages/mywyb/mywyb"
    };
  },
  // 导航
  gotoWybDetail(e) {
    const { wybid, type, orderid } = e.currentTarget.dataset;
    if (type) {
      wx.navigateTo({
        url: "/pages/bills/bills?wybId=" + wybid
      });
    } else {
      wx.navigateTo({
        url: "/pages/order-detail/order-detail?orderId=" + orderid
      });
    }
  },
});
