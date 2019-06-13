// pages/index.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var imageUtil = require('../../utils/util.js');
var json = require('../../data/home_data.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
 
  data: {
    cartItems: [],
    imgUrls: [
      {
        link: '/pages/index/index',
        url: '/img/001.jpg'
      }, {
        link: '/pages/list/list',
        url: '/img/banimg.jpg'
      }, {
        link: '/pages/list/list',
        url: '/img/002.jpg'
      }
    ],
    wyname:'杨新物业中心',//物业名称
    dwaddress:'杨新路88号',//定位地址
    indicatorDots: false, //小点
    indicatorColor: "white",//指示点颜色
    activeColor: "coral",//当前选中的指示点颜色
    autoplay: false, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
  },
 
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
  getAddress(latitude, longitude) {
    // 生成 QQMapWX 实例
    let qqmapsdk = new QQMapWX({
      key: 'xxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx'
    })

    // reverseGeocoder 为 QQMapWX 解析 经纬度的方法
    qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      success(res) {
        console.log('success', res)
        vm.setData({
          // ad_info: res.result.ad_info
          // city： res.result.ad_info
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      //jsonData.dataList获取json.js里定义的json数据，并赋值给dataList
      cartItems: json.buyerList
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log('res=', res)
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })

  },
  //地图定位精确方法

  /**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */

  wgs84togcj02: function (lng, lat) {
    var that = this

    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    if (that.out_of_china(lng, lat)) {
      return [lng, lat]
    }
    else {
      var dlat = that.transformlat(lng - 105.0, lat - 35.0);
      var dlng = that.transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat]
    }
  },
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  gcj02tobd09: function (lng, lat) {
    var that = this
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  },
  transformlat: function (lng, lat) {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  },

  transformlng: function (lng, lat) {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  },

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  out_of_china: function (lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  wybAbout:function(){
    wx.navigateTo({
      url: '/pages/wybexplain/wybexplain',
    })
  },
  choosedetail:function(e){
    const e_data = e.currentTarget.dataset;
    console.log(e_data);
    var prolistId=e_data.listdata.prolistId
    wx.navigateTo({
      url: '/pages/details/details?prolistId=' + prolistId ,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onShow:function(){
    var cartItems = json.buyerList
    // var cartItems = wx.getStorageSync("cartItems")
    this.setData({
      cartList: false,
      cartItems: cartItems
    });
    // wx.getLocation({
    //   type: '',
    //   altitude: true,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    const vm = this;
    wx.getSetting({
      success(res) {
        // 1. scope.userLocation 为真， 代表用户已经授权
        if (res.authSetting['scope.userLocation']) {
          // 1.1 使用 getlocation 获取用户 经纬度位置
          wx.getLocation({
            type: 'wgs84', //wgs84
            success: (res) => {
              var lat = res.latitude
              var lng = res.longitude
              console.log(lat + "||latitude");
              console.log(lng + "||longitude");
              // wgs84转百度坐标系
              var ssws = that.wgs84togcj02(lng, lat)
              ssws = that.gcj02tobd09(ssws[0], ssws[1])
              //解决定位偏移
              var ssssss1 = ssws[1] - 0.000160
              var ssssss2 = ssws[0] - 0.000160

              that.setData({ latitude: ssssss1.toFixed(6), longitude: ssssss2.toFixed(6) })
              that.setData({
                jd: ssssss2.toFixed(6),
                wd: ssssss1.toFixed(6)
              })
            }
          })
        } else {
          // 2. 用户未授权的情况下， 打开授权界面， 引导用户授权.
          wx.openSetting({
            success(res) {
              // 2.1 如果二次授权允许了 userLocation 权限， 就再次执行获取位置的接口
              if (res.authSetting["scope.userLocation"]) {
                wx.getLocation({
                  success(res) {
                    // 2.2 获取用户位置成功后，将会返回 latitude, longitude 两个字段，代表用户的经纬度位置
                    console.log(res)

                    // 2.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址
                    vm.getAddress(res.latitude, res.longitude)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  onReady: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  // 上拉加载
  onReachBottom: function () {
    var that = this;
    that.data.pages++
    that.reach(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ //重置分页
      page: 1
    })
    this.reach();
    wx.stopPullDownRefresh();
  },
  goShare: function (event) {
    const shareLists = [
      "分享给微信好友",
      "分享到到朋友圈",
      "分享到QQ",
      "分享到微博",
    ];
    wx.showActionSheet({        
      //  --------------wx.showActionSheet({ itemList: [], ...})
            itemList: shareLists, 
            // --------------itemList按钮的文字数组，最大长度为6个
            success: function (res) {
        // ----点击菜单某一项成功后的回调，
        // res.tapIndex可获得数组的index
        const index = res.tapIndex;
        wx.showModal({
          title: `分享`,
          content: `确定分享到${shareLists[index]}吗？`,
          showCancel: true,
          confirmText: "确定",
          confirmColor: "#9F79EE",
          cancelText: "取消",
          cancelColor: "silver"
        })
      }
        })
    },
    /*
      地图定位精确方法

    */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // goShare();
  }
})