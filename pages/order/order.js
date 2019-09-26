// pages/order/order.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
// var model = require("../components/model/model.js")
const app = getApp();

Page({
  data: {
    // tab切换
    orderTab: ["全部", "待支付", "待收货","已完成","退货/售后"],
    states: 0,
    list: [],
    offset: 0,
    limit: 10,
    noPage:0,
    isShows:true,
    tipTxt:'',
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    noMores: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_02.png',
    cancelShow:false,
    cancelList: [],//取消列表
    cancelReason:0,//取消原因
    orderId:'',
  },
  onShareAppMessage: function (res) {
    return {
      title: '我的订单',
      path: 'pages/order/order'
    }
  },
  onLoad: function (options) {
    // let user = Common.getStorage('user') || Common.getUser()
    // let isBinding = user.isBinding
    // console.log(isBinding)
    // if (!isBinding) {
    //   console.log('未绑定小区')
    // }else{
    //   let st = app.globalData.states
    //   if (!app.globalData.states) {
    //     st = 0
    //   } else {
    //     st = app.globalData.states
    //   }
    //   this.setData({
    //     states: st
    //   })
    // }
    
  },
  onShow: function () {
    Common.setStorage('Isb', 1)
    let user = Common.getStorage('user') || Common.getUser()
    let userCode=user.userCode
    if(!userCode){
      this.setData({
        isShows:false
      })
    }
    let isBinding = user.isBinding
    console.log(isBinding)
    if (!isBinding) {
      console.log('未绑定小区')
    } else {
      let st = app.globalData.states
      if (!app.globalData.states) {
        st = 0
      } else {
        st = app.globalData.states
      }
      this.setData({
        states: st
      })
    }

    this.setData({
      list: [],
      offset: 0,
      noPage: 0,
      isShows: true,
    })
    if(userCode){
      this.getList(this.data.states)
      Common.setTabBar(this);
    }    
    this.getCancelList()
  },
  //点击时切换
  clickTab(e) {
    
    let _this = this
    let dataIndex = e.currentTarget.dataset.index
    if (_this.data.states == dataIndex) { return }
    _this.setData({
      states: dataIndex,
      list: [],
      offset: 0,
      noPage: 0,
      isShows: true,
    })
    // _this.getList(_this.data.states)
  },
  //滑动时切换
  swiperChangeTab(e) {
    console.log('current', e.detail.current)
    let _this = this
    _this.setData({
      states: e.detail.current,
      list: [],
      offset: 0,
      noPage: 0,
      isShows: true,
    })
    let user = Common.getStorage('user') || Common.getUser()
    let userCode = user.userCode
    if(userCode){
      _this.getList(e.detail.current)
    }
    // _this.getList(e.detail.current)
  },
  //是否到底
  scrolltolower(e) {
    let _this = this
    let dataset = e.currentTarget.dataset
    let user = Common.getStorage('user') || Common.getUser()
    let userCode = user.userCode
    if (_this.data.offset != 0) {//有数据就继续加载
    if(userCode){
      _this.getList(dataset.index)
      _this.setData({
        tipTxt: '加载中'
      })
    }
      // _this.getList(dataset.index)
      // _this.setData({
      //   tipTxt: '加载中'
      // })
      // console.log(_this.data.offset)
    } else {
      _this.setData({
        tipTxt: '没有更多数据了'
      })
    }
  },
  //获取订单列表
  getList(states){
    //订单状态（空:全部，0:待付款，4待收货，6已送达，待评价）
    //订单状态（查询全部:字段不传，0:待付款，1,2,3,4,14待收货
    let _this = this
    var url = Api.order.getMyOrders
    let user = Common.getUser()
    var parm = {}
    let tas=0
    //全部订单
    if (states == 1){
      tas = 0
      //待支付
    } else if (states ==2){
      //待收货
      tas ='1,2,3,4,14'
    } else if (states == 3) {
      tas = '6,15'
      //已完成
    } else if (states == 4){
      //退货售后
      url = Api.order.getReturnOrderList
      tas = 99
    }else{
      tas = 88
    }
    if(tas==88){
      parm = {
        userCode: user.userCode,
        offset: _this.data.offset,
        limit: _this.data.limit
      }
    } else if (tas == 99){
      parm = {
        userCode: user.userCode,
        orderState: tas,
        userType:1,
        offset: _this.data.offset,
        limit: _this.data.limit
      }
    }else{
      parm = {
        userCode: user.userCode,
        orderState: tas,
        offset: _this.data.offset,
        limit: _this.data.limit
      }
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(url, parm, function (data) {
      if (data.status == 'OK') {
        console.log("订单列表data", data)
        var rows = data.rows
        if (data.total <= 0) {
          _this.setData({
            offset: 0, noPage: 0, isShows: false
          })
          return
        }
        if (rows.length > 0) {
          var items = _this.data.list
          for (var i = 0; i < rows.length; i++) {
            items.push(rows[i])
          }
          if (items.length < _this.data.limit) {
            _this.setData({
              list: items, noPage: 1, offset: 0
            })
          }else{
            _this.setData({
              list: items, noPage: 0, offset: _this.data.offset + 10
            })
          }
          // console.log(items,'//////')
          // console.log(_this.data.list,'***')
        } else {
          _this.setData({
            offset: 0, noPage: 1, isShows: true
          })
        }
        
      }
    })
  },
  //再次购买
  goCars(e){
    // console.log(e)
    let _this = this
    let user = Common.getUser()
    let item = [],newItem=[],parms={}
    item=e.currentTarget.dataset.orderitem
    for (var i = 0; i < item.length; i++) {
      let ind = item[i]
      newItem.push(sortedObject({ productId: ind.productId, amount: ind.productNum.toString(), immediately: "0", limitAmount:"1"}))
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
  getPay(e){
    let user = Common.getUser()
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
        if (data.message.allinPay.status == 'ERROR') {
          wx.showToast({
            title: data.message.allinPay.message.message,
            icon: 'none'
          })
          return;
        }
        console.log(data)
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
  cancelShows(e){
    let _this =this
    _this.setData({
      cancelShow:true
    })
    var orderId = e.currentTarget.dataset.orderid
    this.setData({
      orderId: orderId,
    })
  },
  //撤销退货
  cancelReturn(e){
    let _this = this
    let user = Common.getStorage('user') || Common.getUser()
    let userCode = user.userCode
    console.log("退货Id:", e.currentTarget.dataset.orderid)
   wx.showModal({
     title: "确认要撤销退货吗？",
     showCancel: true,//是否显示取消按钮
     success:function(res){
       if (res.confirm) {
         let parms = { sopOrderReturnId: e.currentTarget.dataset.orderid}
         Common.request.post(Api.order.returndCancel, parms, function (data) {
           if (data.status == 'OK') {
             wx.showToast({
               title: data.message,
               icon: 'none'
             })
             setTimeout(function () {
               _this.setData({
                 states: 3,
                 list: [],
                 offset: 0,
                 noPage: 0,
                 isShows: true,
               })
               if(userCode){
                 _this.getList(_this.data.states)
               }
             },1000)
           }
         })
       }
     }
   })
  },
  cancel(){
    this.setData({
      cancelShow: false
    })
  },
  //收起取消原因弹层
  cancelConfirm(){
    let _this = this
    let user = Common.getUser()
    this.setData({
      cancelShow: false
    })
    let parms={
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
            _this.setData({
              states:0,
              list: [],
              offset: 0,
              noPage: 0,
              isShows: true,
            })
            _this.getList(_this.data.states)
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
  radioChange(e){
    this.setData({
      cancelReason:e.detail.value
    })
  },
  errImg: function (e) {
    let _this = this
    Common.errImgFun(e, _this)
  },
  //订单详情
  getDetial(e){
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderId=' + orderId,
    })
  },
  //退货详情
  getDetial2(e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/orderApplication/orderApplication?orderId=' + orderId,
    })
  }
})
