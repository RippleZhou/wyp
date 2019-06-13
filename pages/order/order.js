// pages/order/order.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
// var model = require("../components/model/model.js")
const app = getApp();

Page({
  show: {
    type: Boolean,
    value: false
  },
  //modal的高度
  height: {
    type: String,
    value: '80%'
  },

  /**
   * 页面的初始数据
   */
  data: {
    cancelReason: [
      { name: '操作有误（商品、地址、到达时间选错了）' },
      { name: '重复下单' },
      { name: '不想买了'},
      { name: '其他原因' }, { name: '重复下单' },
      { name: '不想买了' },
      { name: '其他原因iii' },
    ],
    // tab切换
    tabs: ["全部","待支付","待收货"],
    currentTab: 0,
    list: [],
    newproductList: []

  },
  bindChange: function( e ) {
    var that = this;
    that.setData( { currentTab: e.detail.current });
  },
  swichNav: function( e ) {
    var that = this;
    if( this.data.currentTab === e.target.dataset.current ) {
      return false;
    } else {
      that.setData( {
        currentTab: e.target.dataset.current
      })
    }
  },
  getTabProList(index) {
    const self = this

    let tabData = self.data.tabs[index]
    if (tabData.total <= tabData.offset) return //翻到最后一页 total <= offset

    Common.request.get(
      Api.types.clickSType,
      {
        typeId: tabData.id,
        parentId: tabData.parentId,
        offset: tabData.offset,
        limit: tabData.limit,
        recommend: 1,
        sourceType: 1,
        defaultLimit: 0,
      },
      data => {
        console.log(data)
        let tabs = self.data.tabs
        if (data.rows && data.rows.length > 0) {
          if (tabs[index].proList && tabs[index].proList.length > 0) {
            tabs[index].proList = tabs[index].proList.concat(data.rows)
          } else {
            tabs[index].proList = data.rows
          }
          tabs[index].total = data.total
          tabs[index].offset += tabData.limit
          if (tabs[index].total <= tabs[index].offset) {
            tabs[index].lastFlag = true
          }
          self.setData({
            tabs: tabs
          })
        }
      }
    );
  },
  getTabHead(index) {
    const self = this
    if (self.data.tabs[index].headList && self.data.tabs[index].headList.length > 0) return

    if (index == 0 || self.data.requestLock) return //推荐页面不请求 已经请求的不请求

    self.setData({
      requestLock: true
    })
    // Common.request.get(
    //   Api.types.clickType, {
    //     typeId: self.data.tabs[index].id,
    //     type: 1
    //   },
    //   data => {
    //     // console.log(data)
    //     let tabs = self.data.tabs
    //     let headList = data.message.phTypeList || []
    //     tabs[index].headList = headList.slice(0, 9)
    //     tabs[index].offset = 0
    //     tabs[index].limit = 10
    //     tabs[index].parentId = headList[0].id
    //     self.getTabProList(index)
    //     self.setData({
    //       requestLock: false,
    //       tabs: tabs
    //     })
    //   }
    // );
  },
  // getData() {
  //   const self = this
  //   Common.request.get(Api.indexQuery, {
  //     type: 2
  //   },
  //     (data) => {
  //       let message = data.message
  //       self.setTabs(message.homeTypes)
  //       var newFloors = self.getFloors(message.homeFloors);
  //       message.homeFloors = newFloors
  //       message.newproductList = this.data.newproductList
  //       self.setData({
  //         recommend: message
  //       })
  //     }
  //   );
  // },
  getFloors(floors) {
    const self = this;
    var arr = [];
    floors.forEach(item => {
      arr.push({
        ad_list: {
          proid: item.id,
          url: "",
          img: item.imgUrl,
          jumpId: item.jumpId,
          jumpIds: item.jumpIds,
          jumpType: item.jumpType
        },
        proList: self.getProductList(item.proProductVos)
      });
    });
    return arr;
  },
  GoCommoditylist:function(){
    wx.navigateTo({
      url: '/pages/CommodityList/CommodityList',
    })
  },
  getProductList(productList) {
    var arr = [];
    productList.forEach(item => {
      var flag = {
        payByBean: false,
        payByQuan: false,
        payByGoldenBean: false
      };
      switch (item.sourceType) {
        case 1:
          flag.payByBean = true;
          flag.payByQuan = true;
          break;
        case 2:
          flag.payByQuan = true;
          break;
        case 3:
          flag.payByGoldenBean = true
          break;
        case 4:
          break;
        case 5:
          break;
      }
      // var pro = {
      //   proId: item.productId,
      //   proTit: item.brandName + ' ' + item.productTitle,
      //   proImg: 'http://test.img.3721zh.com/UploadFiles/Product/' + item.productId + '/AppPic/1Master.jpg', //item.imgUrl,
      //   proPrice: new Number(item.priceCurrentPrice).toFixed(2),
      //   pbuyNum: item.requestBuyLimit
      // };
      arr.push(Object.assign(pro, flag));
    });
    return arr;
  },
  // gotoDetail(e) {
  //   var pid = e.currentTarget.dataset.pid
  //   wx.navigateTo({
  //     url: `/pages/product/product-view/product-view?productId=${pid}`
  //   })
  //   console.log(pid)
  //   //跳详情
  // },
  swiperChangeTab(event) {
    var current = event.detail.current
    const self = this
    var typeid = 0
    this.data.recommend.homeTypes.forEach((k, i) => {
      if (i == current - 1) {
        console.log(k.id)
        typeid = k.id
      }
    })

    var params = {
      typeId: typeid,
      sourceType: 2,
      offset: 0,
      limit: 10
    }
    // Common.request.get(Api.clickFType, params, data => {
    //   if (data.status == 'OK') {
    //     this.setData({
    //       list: data.rows
    //     })
    //   }
    // })

    self.getTabHead(current)
    self.setData({
      currentTab: event.detail.current
    })
  },
  jumpTab(e) {
    const self = this
    let dataset = e.currentTarget.dataset
    self.getTabHead(dataset.index)
    self.setData({
      currentTab: dataset.index
    })
  },
  setTabs(homeTypes) {
    let self = this
    var arr = [];
    homeTypes.forEach(item => {
      arr.push({
        id: item.id,
        name: item.name
      });
    });
    arr.unshift({
      id: -1,
      name: "全部"
    });
    self.setData({
      tabs: arr
    })
  },
  clickMask() {
        // this.setData({show: false})
  },

      cancel() {
        this.setData({ show: false })
        this.triggerEvent('cancel')
      },

      confirm() {
        this.setData({ show: false })
        this.triggerEvent('confirm')
  },
  cancel_order:function(e){
    this.setData({
      show: {
        type: Boolean,
        value: true
      },
      //modal的高度
      height: {
        type: String,
        value: '100%'
      },
    })
  },
  onLoad: function (options) {
    // this.getData();
    console.log('Common.getparam([])=', Common.getparam([]))
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
