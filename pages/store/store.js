// pages/store/store.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();
let {
  regeneratorRuntime
} = global
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShows: true,
    address_show:false,
    orderTab:[],
    states: 0,
    categorySysNo:'',
    list: [],
    offset: 1,
    limit: 10,
    noPage: 0,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    noMores: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_02.png',
    imgUrls:[],
    imgheights: [],
    tipTxt:'哈鲁，到底啦!看看别的分类呗~',
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
  },
  onShareAppMessage: function (res) {
    let title = '物业拼拼商城'
    let user = Common.getUser()
    let sourceType = 14
    let shareStoreId = user.storeId
    let shareProductId = 14
    Common.setStorage("isShare", 1)
    return {
      title,
      path: `pages/store/store?isShare=1&shareStoreId=${shareStoreId}`
    }
  },
  imageLoad(e) {
    //宽高比 
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  GoSearch: function () {
    wx.navigateTo({
      url: '/pages/product/search/search',
    })
  },
  navigate(e){
    const {productid} = e.currentTarget.dataset
    // console.log(e.currentTarget)
    let users=Common.getStorage('users')
    let user = Common.getUser() || Common.getStorage('user');
    let storeId = new Number(user.storeId).toString();
    if(users=="3"&& user=="用户不存在"){
      storeId = Common.getStorage('storeId').toString()
    }
    wx.navigateTo({
      url:`/pages/store-detail/store-detail?storeId=${storeId}&productId=${productid}`
    })
  },
  
  closePopup() {
    this.setData({
      address_show: false,
      searchText: ""
    });
  },
  clickTab(e) {
    let _this = this
    console.log("clickTab:",e);
    let dataIndex = e.currentTarget.dataset.index
    let datN = e.currentTarget.dataset.numb
    if (_this.data.states == dataIndex) { return }
    _this.setData({
      states: dataIndex,
      categorySysNo: datN,
      list: [],
      offset: 1,
      noPage: 0,
      isShows: true,
    })
    // Common.setStorage('states')
    console.log("clickTab:", this.data.categorySysNo);
  },
  //滑动时切换
  swiperChangeTab(e) {
    console.log("swiperChangeTab:", e);
    let _this = this
    let datN = ''
    for (var i = 0; i < _this.data.orderTab.length;i++){
      if (e.detail.current == i){
        datN = _this.data.orderTab[i].numN
      }
    }
    _this.setData({
      states: e.detail.current,
      categorySysNo: datN,
      list: [],
      offset: 1,
      noPage: 0,
      isShows: true,
    })
    console.log("swiperChangeTab:", this.data.categorySysNo);
    Common.setStorage('categorySysNo', this.data.categorySysNo)
    this.getFloorList(this.data.categorySysNo)
    this.getqueryBannerList()
  },
   async getData() {
    let _this = this
    let params = {};
    var cartItems = {};
    let user = Common.getUser() || Common.getStorage('user');
     let storeId = new Number(user.storeId).toString() || Common.getStorage("shareStoreId2").toString();
     if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0 || storeId == -1) {
       storeId = Common.storeId2()
     }
     if(user=="用户不存在"){
       storeId = Common.getStorage('storeId').toString()
     }
     params.storeId = storeId
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.mall.activityTypeTree,
      params, data => {
        console.log(data)
        if (data.status=='OK'){
          let orderTab = []
          let isNo = _this.data.categorySysNo||1
          if (data.message.length<=0){
            _this.setData({
              orderTab: [{ name: '全部', numN: '0' }],
              categorySysNo: 2,
              list: [],
              offset: 1,
              noPage: 0,
              isShows: true,
            })
            _this.getFloorList(_this.data.categorySysNo)
            console.log(_this.data.orderTab)
            console.log("isShows", _this.data.isShows)
            return
          }
          _this.setData({
            orderTab: [],
            categorySysNo: isNo,
            list: [],
            offset: 1,
            noPage: 0,
            isShows: false,
          })
          orderTab.push({ name: data.message[0].name, numN: data.message[0].value }, { name: '全部', numN: '2' })
          // if (_this.data.states == data.message[0].value) {
          //   isNo = data.message[0].value
          // }
        
          console.log("states***:", this.data.states)
          _this.setData({
            orderTab: orderTab,
            categorySysNo: isNo,
            list: [],
            offset: 1,
            noPage: 0,
            isShows: true,
          })
          console.log('queryFirstTypeTree****OK:', this.data.orderTab)
          console.log(this.data.categorySysNo)
          this.getFloorList(this.data.categorySysNo)
          this.getqueryBannerList()
        }else{
          console.log('queryFirstTypeTree****Error:', this.data.message)
        }
      }
    )
  },
  onLoad: async function (options) {
    if(!this.data.status){
      this.setData({
        status:1
      })
    }
        console.log('options',options)
    let isS = Common.getStorage("isShare")
    // this.getFloorList(states)
    if ((options && options.isShare) || isS) {
      this.getFloorList(isS)
      console.log('分享進入')
      Common.removeStorage("isShare")
      let user = Common.getUser()
      let shareStoreId = options.shareStoreId || Common.getStorage('shareStoreId')
      console.log('shareStoreId', shareStoreId)
      if (!user) {
        console.log('not login')
        Common.setStorage('shareStoreId', shareStoreId)
        Common.setStorage('targetUrl1', `/pages/store/store?isShare=1&shareStoreId=${shareStoreId}`)
        return Common.gotoHome() //登录
      }
    }
  },
  onShow: async function () {
    Common.setStorage('Isb', 1)
    console.log("categorySysNo01:s", this.data.categorySysNo)
    
    let that=this
    let categorySysNo = parseInt(Common.getStorage('categorySysNo'))
    if (categorySysNo){
      that.setData({
        categorySysNo:categorySysNo,
        list:[],
        offset:1
      })
      console.log("categorySysNo02:", this.data.categorySysNo)
    }
    let user = Common.getUser()
    let userCode = user.userCode || Common.getStorage('userCode')
    // Common.setTabBar(this)
    if (userCode) {
      console.log('购物车')
      Common.setTabBar(that)
    }
    let users=Common.getStorage('users')
    this.getData()
    // Common.setTabBar(this)
  }, 
  bindchange(){
  },
  async getFloorList(states) {
    let _this = this
    var url = ''
    var parm = {}
    let user = Common.getUser()
    let users=Common.getStorage('users')
    let storeId = user.storeId
    if(user=="用户不存在" && users == 3){
      storeId = Common.getStorage('storeId')
      console.log('storeid',storeId)
    }
    // let states=_this.data.categorySysNo
    console.log(states,'status-==-')

    if (states==1){
      url = Api.mall.activityTypeProduct
      parm = {
        type: states.toString(),
        storeId: storeId.toString(),
        offset: _this.data.offset.toString(),
        limit: _this.data.limit.toString()
      }
    }
    else if (states==2){
      url=Api.mall.search
      parm = {
        searchText:'',
        storeId: storeId.toString(),
        offset: _this.data.offset.toString(),
        limit: _this.data.limit.toString()
      }
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(url, parm, function (data) {
      if (data.status == 'OK') {
        console.log(data)
        var rows = data.message.productList
        // if (data.total <= 0) {
        //   _this.setData({
        //     offset: 1, noPage: 0, isShows: false
        //   })
        //   return
        // }
        if (rows.length > 0) {
          var items = _this.data.list
          for (let i = 0; i < rows.length; i++) {
            items.push(rows[i])
          }
          if (items.length < _this.data.limit) {
            _this.setData({
              list: items, noPage: 1, offset: 1
            })
          } else {
            _this.setData({
              list: items, noPage: 0, offset: _this.data.offset + 10
            })
          }
          // console.log(items,'//////')
          console.log(_this.data.list,'***')
        } else {
          _this.setData({
            offset: 1, noPage: 1, isShows: true
          })
        }

      }
    })
  },
  getqueryBannerList() {
    let _this = this;
    let params = {};
    let user = Common.getUser();
    params.storeId = new Number(user.storeId).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.mall.organBannerList, params,
      function (data) {
        if (data.status == "OK") {
          if (data.message.length > 0) {
            console.log("queryBannerList:",data.message);
            _this.setData({
              imgUrls: data.message
            });
          }
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
  },
  
  //是否到底
  scrolltolower(e) {
    let _this = this
    let dataset = e.currentTarget.dataset
    console.log(_this.data.status)
    // let 
    if (_this.data.offset != 1) {//有数据就继续加载
      console.log('dataset.index', dataset.index)
      let Sta =  dataset.index
      if (_this.data.orderTab.length>1){
        Sta = Sta+1
      }else{
        Sta = 2
      }
      _this.getFloorList(Sta)
      _this.setData({
        tipTxt: '加载中'
      })
    } else {
      _this.setData({
        tipTxt: '哈鲁，到底啦!看看别的分类呗~'
      })
    }
  },
})