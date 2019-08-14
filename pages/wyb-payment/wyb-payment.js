// pages/wyb-payment/wyb-payment.js
const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showType: "password",
    isFocus: false,
    showChargePwd: false,
    dataSource: [
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      }
    ]
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
  onShow: async function() {
    var user = Common.getUser() || Common.getStorage("user");
    const { userCode } = user;
    if (userCode) {
      const sign = Common.md5sign({ userCode });
      Common.ajax
        .get(Api.housing.charge, { userCode, sign })
        .then(data => {
          console.log("resolve", data);
          const {
            address,
            cusHousingId,
            housingCoin,
            storeAddress,
            storeName,
            userId
          } = data.message;
          this.setData({
            address,
            cusHousingId,
            userwyb:housingCoin,
            storeAddress,
            storeName,
            userId,
            userCode
          });
        })
        .catch(data => {
          console.log("reject", data);
          wx.showModal({
            title: "提示",
            content: data.message + "是否前去设置",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/Setting/Setting"
                });
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        });
    }
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
  onShareAppMessage: function() {},

  handleInput(e) {
    this.setData({
      chargewyb: e.detail.value
    });
  },

  chargeAll() {
    const { userwyb } = this.data;
    this.setData({
      chargewyb: userwyb
    });
  },

  onTapFocus: function() {
    this.setData({
      isFocus: true
    });
  },

  mobileInput: function(e) {
    let dataSource = this.data.dataSource;
    let curInpArr = e.detail.value.split("");
    let curInpArrLength = curInpArr.length;

    if (curInpArr.length != this.data.dataSource.length)
      for (let i = 0; i < dataSource.length - curInpArrLength; i++)
        curInpArr.push("");

    for (let i = 0; i < this.data.dataSource.length; i++) {
      let initValue = "dataSource[" + i + "].initValue";
      this.setData({
        [initValue]: curInpArr[i]
      });
    }
  },

  // cancel
  cancel() {
    let dataSource = [
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      }
    ]
    this.setData({
      showChargePwd: false,
      dataSource: dataSource
    });
  },
  //获取我绑定的小区信息
  getMyHousing() {
    let that = this;
    var url = Api.housing.myHousing;
    let user = Common.getUser() || Common.getStorage("user");
    let userCode = user.userCode;
    var parm = {
      userCode
    };
    let MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr;

    Common.request.post(Api.housing.myHousing, parm, function(data) {
      if (data.status == "OK") {
        let MyHousing = data.message;
        let address = MyHousing.address; // 用户详细地址
        let storeName = MyHousing.storeName;
        that.setData({
          address,
          storeName
        });
      }
    });
  },

  //充值
  charge() {
    const { chargewyb, userwyb } = this.data;
    if (Number(chargewyb) <= 0) {
      wx.showToast({
        title: "充值金额应该大于0",
        icon: "none",
        duration: 1500
      });
      return;
    }
    // if (Number(chargewyb) > Number(userwyb)) {
    //   wx.showToast({
    //     title: `已超出最大金额`,
    //     icon: "none",
    //     duration: 1500
    //   });
    //   return;
    // }
    this.setData({
      showChargePwd: true
    });
    /* */
  },
  // 提交
  chargeSubmit() {
    let _this = this
    const { chargewyb , userCode} = this.data;
    const password = this.data.dataSource
      .map(i => i.initValue)
      .reduce((a, b) => a + b, "");
    const params = {
      housingCoin: chargewyb,
      userCode,
      password
    };
    let dataSource = [
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      },
      {
        initValue: ""
      }
    ]
    params.sign = Common.md5sign(params);
    Common.request.post(Api.housing.charge, params, function(data) {
      if (data.status == "OK" || data.status === "ok") {
        wx.showToast({
          title: "缴费成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(
          () =>
            wx.navigateBack({
              delta: 1
            }),
          2000
        );
        _this.setData({
          dataSource
        })
      }else{
        _this.setData({
          showChargePwd: false,
          dataSource
        })
      }
    });
  }
});
