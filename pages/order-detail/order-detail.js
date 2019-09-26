// pages/order-detail/order-detail.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    hidden:false,
    proList:[],
    orderInfor:{},
    cancelReason:'',
    cancelShow:false,
    cancelTxts:'',
    cancelList:[]
  },
  onShareAppMessage: function (res) {
    return {
      title: '订单详情',
      path: 'pages/order-detail/order-detail'
    }
  },
  onLoad: function (options) {
    this.getCancelList()
    // console.log('options',options)
    this.setData({
      orderId: options.orderId
    })
  },
  onShow: function () {
    this.getInor(this.data.orderId)
  },
  //撤销退货
  // cancelReturn(e) {
  //   let _this = this
  //   wx.showModal({
  //     title: "确认要撤销退货吗？",
  //     showCancel: true,//是否显示取消按钮
  //     success: function (res) {
  //       if (res.confirm) {
  //         let parms = { sopOrderReturnId: e.currentTarget.dataset.orderid }
  //         Common.request.post(Api.order.returndCancel, parms, function (data) {
  //           if (data.status == 'OK') {
  //             wx.showToast({
  //               title: data.message,
  //               icon: 'none'
  //             })
  //             setTimeout(function () {
  //               _this.getInor(e.currentTarget.dataset.orderid )
  //             }, 1000)
  //           }else{
  //             wx.showToast({
  //               title: data.message,
  //               icon: 'none'
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  //订单详情
  getInor(id){
    let _this = this
    var parm = {orderId:id}
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(Api.order.orderDetail, parm, function (data) {
      if (data.status == 'OK') {
        console.log("orderDetail:", data.message)
        if (!data.message.pickUpCode || !data.message.qrcodeImg){
          console.log('没有取件码')
          _this.setData({
            hidden:false
          })
        }else{
          _this.setData({
            pickUpCode: data.message.pickUpCode,
            qrcodeImg: data.message.qrcodeImg,
            hidden: true
          })
        }
        _this.setData({
          proList: data.message.orderItemList,
          orderInfor: data.message,
        })
        let typs = _this.data.orderInfor.cancelReason
        let txt=''
        for (var i = 0; i < _this.data.cancelList.length;i++){
          // console.log(_this.data.cancelList[i].value)
          if (typs == _this.data.cancelList[i].value){
            txt = _this.data.cancelList[i].text
          }
        }
        if (typs == '' || typs == null || typs == undefined){
          txt = '订单超时未支付'
        }
        _this.setData({
          cancelTxts: txt
        })
        console.log(typs)
        // console.log(_this.data.cancelList)
        // console.log(_this.data.cancelTxts)
      }
    })
  },
  //产品详情
  getDtail(e){
    console.log(e);
    var productId = e.currentTarget.dataset.productid
    var storeId = e.currentTarget.dataset.storeid
    var orderSourceType = e.currentTarget.dataset.soutype
    var activityCode = e.currentTarget.dataset.activitycode
    if (orderSourceType==1){
      wx.navigateTo({
        url: '/pages/details/details?productId=' + productId + '&storeId=' + storeId,
      })
    }
    if (orderSourceType == 2){
      wx.navigateTo({
        url: `/pages/store-detail/store-detail?storeId=${storeId}&productId=${productId}`
      })
    }
    if (orderSourceType == 3) {
      wx.navigateTo({
        url: `/pages/flashSale-detail/flashSale-detail?storeId=${storeId}&productId=${productId}&activityCode=${activityCode}&orderSourceType=${orderSourceType}`
      })
    }
  },
  //再次购买
  goCars(e) {
    // console.log(e)
    let _this = this
    let user = Common.getUser()
    let item = [], newItem = [], parms = {}
    item = e.currentTarget.dataset.orderitem
    for (var i = 0; i < item.length; i++) {
      let ind = item[i]
      newItem.push(sortedObject({ productId: ind.productId, amount: ind.productNum.toString(), immediately: "0", limitAmount: "1" }))
    }
    
    parms['userCode'] = user.userCode
    parms['items'] = getStrforParamValue(newItem)
    var MD5signStr = Common.md5sign(parms);
    parms['sign'] = MD5signStr
    console.log(parms)
    parms['items'] = newItem
    Common.request.post(Api.car.addCartByBatch, parms, function (data) {
      if (data.status == 'OK') {
        wx.switchTab({
          url: '/pages/exchangeBox/exchangeBox',
        })
      } else {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })
      }
    })
    //返回一个按key排序的对象
    function sortedObject(data) {
      let ret = [];
      let obj = {};
      let sortedObj = {};
      for (let item in data) {
        ret.push(item.toLowerCase());
        obj[item.toLowerCase()] = item;
      }
      ret.sort();
      for (let key in ret) {
        let _key = obj[ret[key]];
        let res = data[_key];
        sortedObj[_key] = res;
      }
      return sortedObj;
    }
    //参数是数组对象的，获取加密前字符串(参数值是数组，数组的元素是对象的情况才使用此方法)
    function getStrforParamValue(data) {
      let obj = '[';
      for (let item in data) {
        let str = '';
        obj += '{';
        for (let o in data[item]) {
          if (str == '') {
            str = o + '=' + data[item][o];
          } else {
            str += ',' + o + '=' + data[item][o];
          }
        }
        obj += str + "},";
      }
      obj = obj.substring(0, obj.length - 1);
      obj += ']';
      return obj;

    }

  },
  //立即支付
  getPay(e) {
    var parm = {
      payMethod: 7,
      orderId: e.currentTarget.dataset.orderid,
      openId: Common.getWxOpenId() 
    }
    // var user = app.globalData.userInfo
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr

    Common.request.post(Api.order.pay, parm, function (data) {
      if (data.status == 'OK') {
        // console.log(data)
        if (data.message.allinPay.status == 'ERROR') {
          wx.showToast({
            title: data.message.allinPay.message.message,
            icon: 'none'
          })
          return;
        }
        let obj = JSON.parse(data.message.allinPay.message)
        let payinfo = JSON.parse(obj.payInfo)
        let orderId = e.currentTarget.dataset.orderid
        Common.callPay(payinfo, 1, orderId)
      } else {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })
      }
    })
  },
  //取消订单
  cancelShows(e) {
    let _this = this
    _this.setData({
      cancelShow: true
    })
    var orderId = e.currentTarget.dataset.orderid
    this.setData({
      orderId: orderId,
    })
  },
  cancel() {
    this.setData({
      cancelShow: false
    })
  },
  //收起取消原因弹层
  cancelConfirm() {
    let _this = this
    let user = Common.getUser()
    this.setData({
      cancelShow: false
    })
    let parms = {
      orderId: _this.data.orderId,
      userCode: user.userCode,
      cancelReason: _this.data.cancelReason
    }
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.order.cancelOrder, parms, function (data) {
      if (data.status == 'OK') {
        wx.showModal({
          content: data.message,
          confirmColor: '#E61817',
          success(res) {
            _this.getInor(_this.data.orderId)
          }
        })
      } else {
        wx.showModal({
          content: data.message,
          showCancel: false,
          confirmColor: '#E61817'
        })
      }
    })
  },
  //获取取消原因列表
  getCancelList() {
    let _this = this
    Common.request.get(Api.order.getReasonsForReturn+'?type=1', {}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        _this.setData({
          cancelList: list
        })
      }
    })
  },
  radioChange(e) {
    console.log(e)
    this.setData({
      cancelReason: e.detail.value
    })
  },
  errImg: function (e) {
    let _this = this
    // Common.errImgFun(e, _this)
  },
  //退款详情
  getRrfundDetail(e){
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/orderApplication/orderApplication?orderId=' + orderId,
    })
  },
  //退货 
  getRefund(e){
    var orderId = e.currentTarget.dataset.orderid
    var productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/application/application?orderId=' + orderId + '&productId=' + productId,
    })
  },
  //电话
  getTel(e){
    var tel = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})