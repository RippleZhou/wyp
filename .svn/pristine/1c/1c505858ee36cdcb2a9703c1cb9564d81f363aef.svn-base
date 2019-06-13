// pages/details/details.js

var imageUtil = require('../../utils/util.js');
// var buyerList = require('../../data/home_data.js')
var json = require('../../data/home_data.js')
// import { pricelist } from '../index/index.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HomeIndex: 0,
    cartItems: [],
    orderDetail: {},
    imgUrls: [
    {
     url: '/img/banimg.jpg'
      }, {
        url: '/img/001.jpg'
      },  {
        url: '/img/002.jpg'
      }
    ],
    setlist:'',
    prolistId: '',
    type:'',
    indicatorDots: false, //小点
    indicatorColor: "white",//指示点颜色
    activeColor: "coral",//当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  scrollbottom: function () {//滚动到底部
    wx.showToast({
      title: '成功',
      icon: 'success',//当icon：'none'时，没有图标 只有文字
      duration: 2000
    })

    var _this = this;
    if (_this.data.offset != 0) {//有数据就继续加载
      _this.getList();
      console.log(_this.data.offset)
    }
  },
  onLoad: function (options) {
    console.log(options)
    var prolistId = options.prolistId
    console.log(prolistId)
    // var that = this;
      // var homeid = options.id
    // var Homedata = json.homeIndex[homeid];
    // this.setData({
    //   data: Homedata
    // })
    this.setData({
      //jsonData.dataList获取json.js里定义的json数据，并赋值给dataList
      prolistId: prolistId,
      cartItems: json.buyerList
    });
  },
  getOrderDetail () {
  },
  //立即付款
  goPay: function (e) {
    var Id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/pay/pay?id=' + Id
    })
  },
  //加入到购物车
   addcart: function (e) {
    var cartItems = wx.getStorageSync("cartItems") || []
    var exist = cartItems.find(function (el) {
      return el.id == e.target.dataset.id
    })
    //如果购物车里面有该商品那么他的数量每次加一
    if (exist) {
      exist.value = parseInt(exist.value) + 1
    } else {
      cartItems.push({
        id: e.target.dataset.id,
        title: e.target.dataset.title,
        image: e.target.dataset.image,
        price: e.target.dataset.price,
        value: 1,
        selected: true
      })
    }
     wx.showToast({
       title: "加入购物车成功！",
       duration: 1000
     });
    //更新缓存数据
    wx.setStorageSync("cartItems", cartItems)

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
    var cartItems = json.buyerList
    // var cartItems = wx.getStorageSync("cartItems")
    this.setData({
      cartList: false,
      cartItems: cartItems
    })
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
  onShareAppMessage: function () {

  }
})