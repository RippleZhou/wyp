// pages/orderApplication/orderApplication.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();
Page({
  data: {
    orderId:'',
    proList: [],
    orderInfor: {},
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    this.getInor(this.data.orderId)
  },
  //订单详情
  getInor(id) {
    let _this = this
    var parm = { id: id }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(Api.order.getReturnOrderDetail, parm, function (data) {
      if (data.status == 'OK') {
        console.log(data)
        _this.setData({
          proList: data.message.returnOrderItemList,
          orderInfor: data.message
        })
      }
    })
  },
  //撤销退货
  cancelReturn() {
    let _this = this
    wx.showModal({
      title: "确认要撤销退货吗？",
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.confirm) {
          let parms = { sopOrderReturnId: _this.data.orderId }
          Common.request.post(Api.order.returndCancel, parms, function (data) {
            if (data.status == 'OK') {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
              _this.getInor(_this.data.orderId)
            }
          })
        }
      }
    })
  },
  //产品详情
  getDtail(e) {
    var productId = e.currentTarget.dataset.productid
    var storeId = e.currentTarget.dataset.storeid
    var orderSourceType = e.currentTarget.dataset.soutype
    if (orderSourceType == 1) {
      wx.navigateTo({
        url: '/pages/details/details?productId=' + productId + '&storeId=' + storeId,
      })
    }else{
      wx.navigateTo({
        url: `/pages/store-detail/store-detail?storeId=${storeId}&productId=${productId}`
      })
    }
    
  },
  getTel(e){
    var tel = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '订单详情',
      path: 'pages/orderApplication/orderApplication'
    }
  }
})