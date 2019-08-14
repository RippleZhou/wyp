// pages/ReturnRequest/returnfail/returnfail.js
const api = require('../../../utils/api.js')
const common = require('../../../utils/common')
const app = getApp();
Component({
  properties: {
    orderId: String
  },
  methods: {
    // 调取微信支付
    rePay: function() {
      app.globalData.states = 1
      wx.switchTab({
        url: "/pages/order/order"
      })
      //{"payMethod":0,"orderId":13,"openId": "oSBLy5CC6ByjMLORAyiKy9arJ83I", "aliUserId": "208802678739", "sign": "EA01040A91E114BE86CCE4C443D7BF0F"}
      // let url = api.order.pay
      // let data = {
      //   "payMethod": 7, 
      //   "orderId": this.properties.orderId,
      //   "openId": common.getWxOpenId() 
      // }
      // app.globalData.states = 0
      // common.request.post(url, common.miscellaneous.signedParams(data),
      //   data => {
      //     let payment = JSON.parse(JSON.parse(data.message.allinPay.message).payInfo)
      //     wx.requestPayment(
      //       Object.assign(payment, {
      //         success: data => wx.switchTab({
      //           url: "/pages/order/order"
      //         }),
      //         error: res => wx.showToast({
      //           title: JSON.stringify(res),
      //           icon: 'none',
      //           duration: 2000
      //         })
      //       })
      //     )
      //   })
    },
    LookOrder: function() {
      app.globalData.states = 0
      wx.switchTab({
        url: '/pages/order/order'
      })
    }
  },
  ready: function () {
    if (!common.biz.loggedIn()) return; 
  }
})