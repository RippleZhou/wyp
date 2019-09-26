const Common = require('../../utils/common');
var Utils = require('../../utils/util.js');
var Api = require("../../utils/api");
var app = getApp();
let {
  regeneratorRuntime
} = global

Page({
  data: {
    IsTimer: true,
    activityTxt: '',
    longtime: '',
    actShow: false,
    searchText: "",
    activityStatus:false,
    imgheights: [],
    current: 0,
    limit: 10,
    offset: 1,
    page: 1,
    isShow: false,
    pages: 0,
    isScrollUp: 'true',
    isScrollDown: false,
    hide_good_box: true,
    Hei: "",
    masterPicture: [],
    hidden: false,
    hiddenTexts: "加载更多",
    scrollTop: 0,
    scrollHeight: 0,
    cartItems: [],
    cartItems1: [],
    hasActivity: false,
    imgUrls: [{
      imgUrl: '/img/2.jpg',
      directUrl: "",
      name: 'f1',
      sortNo: 1
    }, {
      imgUrl: '/img/4.jpg',
      directUrl: "",
      name: 'f1',
      sortNo: 1
    }, {
      imgUrl: '/img/3.jpg',
      directUrl: "",
      name: 'f1',
      sortNo: 1
    }],
    takeTurnsNotice: [],
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    indicatorDots: false, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
    userinfo: {},
  },
  errImg: function(e) {
    let _this = this
    console.log(e)
    // Common.errImgFun(e, _this);
    var index = e.target.dataset.index
    var errObj = []
    errObj = "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
    this.data.masterPicture[index] = errObj
    this.setData({
      masterPicture: this.data.masterPicture
    })
  },

  GoSearch: function() {
    this.setData({ //重置分页
      offset: 1,
      cartItems: [],
      cartItems1: [],
      isScrollUp: 'false'
    })
    this.getproList();
  },
  SearchInput: function(e) {
    console.log(e.detail.value)
    var value = e.detail.value
    this.setData({
      searchText: value
    })
  },
  MoreFlash() {
    wx.navigateTo({
      url: '/pages/moreFlash/moreFlash',
    })
  },
  scrollbottom: function() { //滚动到底部
    wx.showToast({
      title: '成功',
      icon: 'success', //当icon：'none'时，没有图标 只有文字
      duration: 2000
    })
    var _this = this;
    if (_this.data.offset != 0) { //有数据就继续加载
      _this.getList();
      console.log(_this.data.offset)
    }
  },
  async checkProduct(pid, sid) {
    var parm = {
      productId: pid,
      storeId: `${sid}`
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    try {
      await Common.ajax.post(Api.order.detai, parm)
      return true
    } catch (err) {
      return false
    }
  },
  async createCar(Item) {
    let user = Common.getUser()
    let isBinding = user.isBinding
    if (Item.storeId != user.storeId) {
      const enable = await this.checkProduct(Item.productId, user.storeId)
      if (!enable) return false
    }
    if (!isBinding) {
      wx.showModal({
        title: '温馨提示',
        content: '为了方便充缴物业费，下单前请先绑定小区哦~',
        cancelText: '再想想',
        confirmText: '绑定小区',
        success(res) {
          if (res.confirm) {
            Common.setStorage('Isb', 1)
            console.log('用户点击确定')
            app.globalData.requireBindingForCart = true // 需要绑定
            app.globalData.product = Item // 商品
            setTimeout(function() {
              wx.navigateTo({
                url: '/pages/bindAddress/bindAddress',
              })
            }, 1000)
          } else if (res.cancel) {
            app.globalData.requireBindingForCart = false
            console.log('用户点击取消')
            return false;
          }
        }
      })
    } else {
      var cartItems = wx.getStorageSync("cartItems") || []
      var exist = cartItems.find(function(el) {
        return el.productId == Item.productid;
      })
      //如果购物车里面有该商品那么他的数量每次加一
      if (exist) {
        exist.value = parseInt(exist.value) + 1;
      } else {
        cartItems.push({
          productId: Item.productid,
          title: Item.title,
          price: Item.price,
          value: 1
        })
      }
      let _this = this;
      var Num = wx.getStorageSync("cartItemsNum") || 0
      Num += 1;
      wx.setStorageSync('cartItemsNum', Num)
      //更新缓存数据
      wx.setStorageSync("cartItems", cartItems)
      let params = {};
      // let user = Common.getUser();
      params.userCode = user.userCode;
      params.productId = parseInt(Item.productid);
      params.amount = 1;
      params.immediately = 0;
      params.limitAmount = 1;
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.car.addCart, params,
        function(data) {
          console.log(data)
          if (data.status == "OK") {
            //更新缓存数据
            wx.setStorageSync("cartItems", cartItems)
            wx.showToast({
              title: "加购成功！",
              duration: 1500
            });
            Common.setTabBar(_this);
          } else {
            console.log(data.message);
          }
        })
    }
  },
  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
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
  //加入到购物车
  addCar:async function(e) {
    await Common.goToLogin()
    console.log(e)
    let user = Common.getUser()
    let userCode = user.userCode
    let isBinding = user.isBinding
    if (!userCode) {
      return Common.gotoHome()
    } else{
      if (!isBinding) {
        wx.showModal({
          title: '温馨提示',
          content: '为了方便充缴物业费，下单前请先绑定小区哦~',
          cancelText: '再想想',
          confirmText: '绑定小区',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/bindAddress/bindAddress',
                })
              }, 1000)
            } else if (res.cancel) {
              console.log('用户点击取消')
              return false;
            }
          }
        })
      } else {
        let self = this;
        let storeId = Common.getStorage('storeId') || user.storeId
        console.log('storeId:', storeId)
        var cartItems = wx.getStorageSync("cartItems") || []
        self.createCar({
          productid: parseInt(e.target.dataset.productid),
          title: e.target.dataset.title,
          image: e.target.dataset.image,
          price: e.target.dataset.price,
          storeId: storeId
        });
        Common.setTabBar(self);
      }
    }


    // if (!Common.biz.loggedIn()) {
    //   wx.navigateTo({
    //     url: '/pages/isLogin/isLogin',
    //   })
    //   return
    // };

  },
  GoScan: function() {
    let _this = this;
    wx.scanCode({
      success: (res) => {},
      fail: (res) => {
        console.log(res);
      }
    })
  },
  imgH: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　 //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    // 　等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      scrollHeight: res.windowHeight,
      Hei: swiperH　　　　　　　　 //设置高度
    })
  },
  housingInfo() {
    let params = {};
    let _this = this;
    let user = Common.getUser();
    let users=Common.getStorage('users')
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString()|| Common.getStorage("shareStoreId2").toString();
    console.log('storeId', storeId)
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0 || storeId == -1) {
      storeId = Common.storeId2()
      console.log(storeId, 'storeId2===')
    }
    if(users == 3 && user=="用户不存在"){
      storeId = Common.getStorage('storeId').toString()
      if (storeId == " ") {
        return false;
      }
    }
    params.storeId = storeId
    console.log(params.storeId, '---storeId2===')
    // console.log()
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.productHousing.housingInfo, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data);
          _this.setData({
            storeId: data.message.id,
            dwaddress: data.message.storeAddress,
            wyname: data.message.storeName
          });
        } else {
          console.log(data.message);
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
    Common.request.post(Api.housingbanner.queryBannerList, params,
      function(data) {
        if (data.status == "OK") {
          // console.log('00000',data);
          if (data.message.length > 0) {
            console.log(data.message);
            _this.setData({
              imgUrls: data.message
            });
            // console.log(_this.data.imgUrls)
          }
        } else {
          // console.log(data);
          _this.setData({
            imgUrls: _this.data.imgUrls
          })
        }
      })
  },
  getOpenIdFromServer() {
    wx.login({
      success(res) {
        if (res.code) {
          let url = Api.user.getOpenId
          let params = {
            jsCode: res.code
          }
          let MD5signStr = Common.md5sign(params);
          let reqParams = Object.assign(params, {
            sign: MD5signStr
          })

          Common.request.post(url, reqParams, function(res) {
            if (res.status == "OK") {
              Common.setStorage('openid', res.message.wxOpenId)

              let openid = Common.getWxOpenId()
              // console.log('openid----911', openid)
            }
          })
        }
      }
    })
  },
  //获取最近小区
  nearHousing(latitude, longitude) {
    let that = this
    console.log(that.data)
    latitude = Common.getStorage('latitude').toString()
    longitude = Common.getStorage('longitude').toString()
    if (latitude == " " || longitude == " "){
      return false;
    }
    console.log('latitude', latitude)
    console.log('longitude', longitude)
    let url = Api.housing.nearestStore
    let params = {
      longitude,
      latitude
    }
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(url, params, function(data) {
      if (data.status == "OK") {
        console.log(data);
        let user = Common.getStorage('user');
        console.log('user===--==', user)
        let dwaddress = data.message.address
        let storeId = data.message.storeId
        let wyname = data.message.storeName
        Common.setStorage('user', Object.assign(user, {
          wyname: wyname
        }))
        Common.setStorage('user', Object.assign(user, {
          storeId: storeId
        }))
        Common.setStorage('user', Object.assign(user, {
          dwaddress: dwaddress
        }))
        Common.setStorage('dwaddress', dwaddress)
        Common.setStorage('wyname', wyname)
        Common.setStorage('storeId', storeId)
        Common.saveUser(user)
        // Common.getUser(user);
        console.log('--==--==user==--==', user)
        that.setData({
          dwaddress,
          storeId,
          wyname
        })
        that.getproList();
        that.getActivityList()
      }
    })
  },
  //首次加载
  onLoad: function(options) {
    let that = this
    let Isb = Common.getStorage('Isb')
    if (!Isb) {
      that.setData({ //重置分页
        offset: 1,
        cartItems: [],
        cartItems1: [],
        hidden: false
      })
      that.housingInfo();
      // that.getproList();
      // that.getActivityList()
    }
    console.log('|||000==user', Common.getUser())
    console.log('|||000==user', Common.getStorage('user'))
    console.log(options, '********************************')
    let user = Common.getUser() || Common.getStorage('user');
    let isS = Common.getStorage("isShare")
    if ((options && options.isShare) || isS) {
      console.log('分享進入')
      Common.removeStorage("isShare")
      let shareStoreId = options.shareStoreId || Common.getStorage('shareStoreId')
      let isScrollUp = JSON.parse(this.data.isScrollUp) ? 'true' : 'false'
      console.log('shareStoreId', shareStoreId)
      if (!user) {
        console.log('not login')
        Common.setStorage('shareStoreId', shareStoreId)
        return Common.gotoHome() //登录
      }
    }

    let storeId = user.storeId
    that.setData({
      storeId
    })
    console.log('--==user--', user)
    let cars = Common.getStorage('isAddCar')
    Common.removeStorage('isAddCar')
    console.log(cars + "isAddCars")
    if (cars == 1) {
      that.addCar()
    }
    if (options && options.isShare) {
      let isScrollUp = options.isScrollUp
      that.setData({
        "isScrollUp": isScrollUp
      })
      storeId = user.storeId || options.shareStoreId;
      Common.setStorage("shareStoreId2", storeId)
    }

  },
  onShow: function() {
    // Common.setTabBar(this)
    this.setData({
      offset: 1,
      cartItems:[],
      cartItems1:[]
    })
    let Isb = Common.getStorage('Isb')
    console.log('isb', Isb)
    var that = this;
    let user = Common.getStorage('user')
    let userCode = user.userCode;
    Common.setStorage('userCode', userCode)
    console.log('--==user--', user)
    let isBinding = user.isBinding
    let users = Common.getStorage('users')
    if(isBinding && users==3){
      that.setData({
        dwaddress: Common.getStorage('dwaddress'),
        wyname: Common.getStorage('wyname')
      })
    }
    // let storeId = user.storeId
    // console.log('-=-storeId', storeId)
    console.log('==--isBinDing--', isBinding)
    if (Isb == 1) {
      console.log(Isb, '************')
      that.setData({ //重置分页
        offset: 1,
        cartItems1: [],
        cartItems: [],
        hidden: false
      })
      // that.getproList();
      // that.getActivityList()
    }
    if (!isBinding) {
      console.log("1111---", isBinding)
      that.nearHousing()
      that.housingInfo()
      // that.getActivityList()
    } else {
      if (Isb == 1) {
        console.log(Isb, '************')
        that.setData({ //重置分页
          offset: 1,
          cartItems1: [],
          cartItems: [],
          hidden: false
        })
        that.housingInfo();
        // that.getproList();
        Common.removeStorage('Isb')
      }
      this.getOpenIdFromServer()
      console.log('===user===', user)
      let cellPhone = Common.getStorage('cellPhone') || Common.getStorage('phone') || user.cellPhone
      let userInfo = Common.getStorage('userInfo')
      let nickName = userInfo.nickName
      let imageUrl = userInfo.avatarUrl
      Common.setStorage('user', Object.assign(user, {
        cellPhone: cellPhone
      }))
      console.log('---user---', user)
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            scrollHeight: res.windowHeight
          });
        }
      });
    }
    if (userCode) {
      Common.setTabBar(that);
       that.getproList();
       that.getActivityList()
    }
    // that.getActivityList()
    that.setData({
      longtime: setTimeout(function () {
        that.getTime()
      }, 4000)
    })
    that.getTakeTurnsNotice()
    const vm = that;
    //  判断是否是从购物车引导绑定的
    if (app.globalData.requireBindingForCart) {
      const {
        product
      } = app.globalData
      app.globalData.requireBindingForCart = false
      app.globalData.product = null
      this.createCar(product)
    }
  },
  scroll: function(event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    let scrollTop = event.detail.scrollTop
    if (scrollTop >= 100 || this.data.searchText) {
      this.setData({
        isScrollUp: true
      });
    } else {
      this.setData({
        isScrollUp: false
      });
    }
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      scrollHeight: res.windowHeight,
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  wybAbout: function() {
    wx.navigateTo({
      url: '/pages/wybexplain/wybexplain',
    })
  },
  choosedetai2: function(e) {
    console.log(e);
    const e_data = e.currentTarget.dataset;
    console.log(e_data);
    let user = Common.getUser();
    let users=Common.getStorage('users')
    let storeId = user.storeId
    if(user=="用户不存在"&&users==3){
      storeId = Common.getStorage('storeId')
    }
    var prolistId = e_data.listdata.proId
    var activityCode = e_data.listdata.activityCode
    var sourceType = e_data.listdata.sourceType
    wx.navigateTo({
      url: '/pages/flashSale-detail/flashSale-detail?productId=' + prolistId + '&storeId=' + storeId + '&activityCode=' + activityCode + '&sourceType=' + sourceType,
    })
  },
  choosedetail: function(e) {
    const e_data = e.currentTarget.dataset;
    // console.log(e_data);
    let user = Common.getUser();
    let storeId=user.storeId;
    if(user=="用户不存在"){
      storeId = Common.getStorage('storeId')
    }
    var prolistId = e_data.listdata.proId
    wx.navigateTo({
      url: '/pages/details/details?productId=' + prolistId + '&storeId=' + storeId,
    })
  },
  getActivityList() {
    let _this = this;
    let params = {};
    var cartItems = {};
    let user = Common.getUser() || Common.getStorage('user');
    let users=Common.getStorage('users')
    console.log('user',user)
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString()|| Common.getStorage("shareStoreId2").toString();
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0 || storeId == -1) {
      storeId = Common.storeId2()
    }
    if (user == "用户不存在" && users == 3) {
      console.log(1111)
      storeId = Common.getStorage('storeId').toString()
    }
    params.storeId = storeId
    params.offset = new Number(_this.data.offset).toString();
    params.limit = new Number(_this.data.limit).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.ProductActivity.activityList, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data);
          if (data.rows.length > 0) {
            let activityCode = data.rows[0].activityCode
            console.log('activityCode==', activityCode)
            _this.setData({
              hasActivity: true,
              activityCode,cartItems1:[]
            })
            _this.getActivity()
          }else{
            _this.setData({
              hasActivity:false
            })
          }
        }
      })
  },
  getActivity() {
    let _this = this;
    _this.setData({
      cartItems1:[]
    })
    let params = {};
    var cartItems1 = {};
    let user = Common.getUser() || Common.getStorage('user');
    let users = Common.getStorage('users')
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString()|| Common.getStorage("shareStoreId2").toString();
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0) {
      storeId = Common.storeId2()
    }
    if (user == "用户不存在" && users == 3) {
      storeId = Common.getStorage('storeId').toString()
    }
    params.activityCode = _this.data.activityCode
    params.storeId = storeId
    params.offset = '1'
    // params.offset = new Number(_this.data.offset).toString();
    params.limit = new Number(_this.data.limit).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.ProductActivity.activity, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data);
          let proList1 = _this.data.cartItems1;
          let productList1 = data.message.itemList.slice(0,2) || [];
          for (let i = 0; i < productList1.length; i++) {
            let pro1 = {}; //定义产品对象，获取数据，追加到数组里
            // pro.pname = productList[i].productExpirationNum;
            pro1.pimg = productList1[i].imageUrl; //图片路径
            pro1.num = productList1[i].stockNum; //库存
            // pro1.sourceType = productList1[i].activityProductType //产品类型
            if (productList1[i].activityProductType==1){
              pro1.sourceType=17
            }else{
              pro1.sourceType = 16
            }
            let sourceType = pro1.sourceType;
            let activityBeginDate = productList1[i].activityBeginDate
            console.log('activityBeginDate', productList1[i].activityBeginDate)
            let beginDate = (activityBeginDate.substring(0, 20)).replace(/-/g, '/')
            pro1.beginDate = beginDate; //活动开始时间
            let activityEndDate = productList1[i].activityEndDate
            console.log('activityEndDate', productList1[i].activityEndDate)
            let stopDate = (activityEndDate.substring(0, 20)).replace(/-/g, '/')
            pro1.stopDate = stopDate; //活动结束时间
            pro1.aItemId = productList1[i].activityItemId //id
            pro1.limNub = productList1[i].limitedNumber; //限购
            pro1.bscPrice = productList1[i].productBasicPrice //原价
            pro1.pname = productList1[i].productTitle; //"产品名称";
            pro1.proId = productList1[i].productId; //产品编号
            pro1.activityCode = productList1[i].activityCode //活动编码
            let saleNum = productList1[i].saleNum ? productList1[i].saleNum : 0;
            pro1.saleno = "已售" + saleNum + "件";
            pro1.price = productList1[i].productSalePrice; //商品活动价
            pro1.getwyb = "可获得物业币" + productList1[i].housingCoin;
            pro1.status = productList1[i].stockNum > 0;
            pro1.userimg = productList1[i].buyerImageUrl;
            proList1.push(pro1);
            _this.setData({
              activityBeginDate,
              activityEndDate,
              sourceType
            })
            console.log(pro1)
            console.log(proList1)
          }
          console.log('proList1', proList1)
          let nowDate = +new Date() //获取当前时间戳
          var cartItems1 = proList1;
          _this.data.offset++;
          _this.setData({
            cartList1: false,
            cartItems1: cartItems1,
            offset: _this.data.offset,
            hidden: _this.data.hidden,
            hiddenTexts: _this.data.hiddenTexts
          });
        }
      })
  },
   async getTime() {
    let that = this
    let activityBeginDate = (that.data.activityBeginDate).replace(/-/g, '/');
    let activityEndDate = (that.data.activityEndDate).replace(/-/g, '/');
    let beginDate = +new Date(activityBeginDate); //获取截至时间戳(.getTime()==+)activityBeginDate
    let stopDate = +new Date(activityEndDate); //获取截至时间戳(.getTime()==+)
    console.log(beginDate, stopDate)
    console.log('that.data.activityEndDate', activityEndDate, activityBeginDate)

    let nowDate = +new Date() //获取当前时间戳
    console.log('nowDate1', nowDate)
    let dTime
    let dTime1 = beginDate - nowDate //计算时间差距离活动开始时间
    console.log('dTime1', dTime1)
    let dTime2 = stopDate - nowDate; //计算时间差距离活动结束时间
    if (dTime2 < 0) {
      console.log('活动已结束')
      that.setData({
        actShow: true,
        btnShow: true,
        IsTimer:false,
        activityTxt: '活动已结束'
      })
      console.log('activityTxt', that.data.activityTxt)
      clearTimeout(that.data.longtime)
      console.log(that.data, 'thssadasd')
      return false;
    }
    if (dTime1 > 0) {
      dTime = dTime1
      console.log('dTime1', dTime)
      that.setData({
        btnShow: false,
        actShow: false,
        IsTimer: true,
        activityTxt: '抢购倒计时'
      })
      that.setData({
        longtime: setTimeout(function() {
          that.getTime()
        }, 1000)
      })
      console.log('activityTxt', that.data.activityTxt)

    }
    if (dTime1 < 0 && dTime2 > 0) {
      dTime = dTime2
      console.log('dTime2', dTime)
      that.setData({
        btnShow: false,
        actShow: false,
        IsTimer: true,
        activityTxt: '距离活动结束'
      })
      that.setData({
        longtime: setTimeout(function() {
          that.getTime()
        }, 1000)
      })
      console.log('activityTxt', that.data.activityTxt)
    }
    let sec = dTime / 1000; //计算秒
    let min = sec / 60; //计算分钟
    let hou = min / 60; //计算小时
    let day = hou / 24; //计算天
    this.setData({
      day: parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day),
      hou: parseInt(hou % 24) < 10 ? '0' + parseInt(hou % 24) : parseInt(hou % 24),
      min: parseInt(min % 60) < 10 ? '0' + parseInt(min % 60) : parseInt(min % 60),
      sec: parseInt(sec % 60) < 10 ? '0' + parseInt(sec % 60) : parseInt(sec % 60)
    })
  },
  getproList() {
    let _this = this;
    let params = {};
    var cartItems = {};
    let user = Common.getUser() || Common.getStorage('user');
    let users = Common.getStorage('users')
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString() || Common.getStorage("shareStoreId2").toString();
    console.log('storeId', storeId)
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0||storeId == -1) {
      storeId = Common.storeId2()
    }
    if (user == "用户不存在" && users == 3) {
      _this.setData({
        cartItems: []
      })
      storeId = Common.getStorage('storeId').toString()
    }
    params.storeId = storeId
    console.log('storeid', params.storeId)
    params.searchText = _this.data.searchText;
    params.offset = new Number(_this.data.offset).toString();
    params.limit = new Number(_this.data.limit).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.productHousing.index, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data)
          let proList = _this.data.cartItems;
          let productList = data.message.productList || [];
          if (productList.length < 10) {
            _this.data.hidden = true;
            _this.data.hiddenTexts = "哈鲁，到底啦~~";
          }
          for (let i = 0; i < productList.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            // pro.pname = productList[i].productExpirationNum;
            pro.pimg = productList[i].imageUrl; //图片路径
            pro.num = productList[i].stockNum;
            pro.bscPrice = productList[i].priceBasicPrice //原价
            pro.pname = productList[i].productTitle; //"产品名称";
            // console.log('productList[i].productId', productList[i].productId)
            pro.proId = productList[i].productId; //产品编号
            let saleNum = productList[i].saleNum ? productList[i].saleNum : 0;
            pro.saleno = "已售" + saleNum + "件";
            pro.price = productList[i].priceCurrentPrice;
            pro.getwyb = "可获得物业币" + productList[i].housingCoin;
            pro.status = productList[i].stockNum > 0;
            pro.userimg = productList[i].buyerImageUrl;
            pro.productIsPutaway = productList[i].productIsPutaway;
            proList.push(pro);

          }
          var cartItems = proList;
          _this.data.offset++;
          _this.setData({
            cartList: false,
            cartItems: cartItems,
            offset: _this.data.offset,
            hidden: _this.data.hidden,
            hiddenTexts: _this.data.hiddenTexts
          });
        } else {
          _this.data.hidden = true;
          _this.data.hiddenTexts = "哈鲁，到底啦~~";
          // console.log(data.message);
        }
      })
  },
  //根据定位获取城市
  getcityName(lat, lng) {
    let params = {};
    params.longitude = new Number(lng).toString();
    params.latitude = new Number(lng).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.customerAddress.getAddressByLngAndLat, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 上拉加载
  onReachBottom: function() {
    if (!this.data.hidden) {
      this.getproList();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onPullDownRefresh: function() {
    this.setData({ //重置分页
      offset: 1,
      cartItems: [],
      cartItems1: [],
      hidden: false
    })
    this.getActivityList();
    this.getproList();
    wx.stopPullDownRefresh();
  },
  getTakeTurnsNotice() {
    let _this = this;
    let params = {};
    Common.request.get(Api.takeTurns.takeTurnsNotice, {},
      function(data) {
        if (data.status == "OK") {
          let takeTurnsNotice = data.message;
          // console.log(takeTurnsNotice)
          _this.setData({
            takeTurnsNotice: takeTurnsNotice
          })
        }
      })
  },
  closePopup() {
    this.setData({
      isScrollUp: 'true',
      searchText: ""
    });
    this.getproList();
    wx.stopPullDownRefresh();
  },
  Tourl(e) {
    let shif = this;
    let dataset = e.currentTarget.dataset;
    let url = shif.data.imgUrls[dataset.index].directUrl;
  },
  onShareAppMessage: function(res) {
    let title = JSON.parse(this.data.isScrollUp) ? '物业拼拼商城' : '物业拼拼-全部商品'
    let user = Common.getUser()
    let shareStoreId = user.storeId
    let isScrollUp = JSON.parse(this.data.isScrollUp) ? 'true' : 'false'
    Common.setStorage("isShare", 1)
    return {
      title,
      path: `pages/index/index?isShare=1&isScrollUp=${isScrollUp}&shareStoreId=${shareStoreId}`
    }
  },
  onUnload() {
    clearTimeout(this.data.longtime);
  },
  onHide: function() {
    //写在onHide()中，切换页面或者切换底部菜单栏时关闭定时器。
    clearTimeout(this.data.longtime)
  },
})