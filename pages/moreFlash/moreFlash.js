// pages/moreFlash/moreFlash.js
const Common = require('../../utils/common');
var Utils = require('../../utils/util.js');
var Api = require("../../utils/api");
var app = getApp();
let {
  regeneratorRuntime
} = global
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    IsTimer: false,
    longtime: '',
    limit: 10,
    offset: 1,
    ActivityList: [],
  },
  async getActivityList() {
    
    let _this = this;
    let params = {};
    var cartItems = {};
    let user = Common.getUser() || Common.getStorage('user');
    let users=Common.getStorage('users')
    let storeId = new Number(user.storeId).toString() || Common.getStorage("shareStoreId2").toString();
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0) {
      storeId = Common.storeId2()
    }
    if (users == 3 && user == "用户不存在") {
      storeId = Common.getStorage('storeId').toString()
      if (storeId == " ") {
        return false;
      }
    }
    params.storeId = storeId
    params.offset = new Number(_this.data.offset).toString();
    params.limit = new Number(_this.data.limit).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    try {
      console.log('parm', params)
      let data = await Common.ajax.post(Api.ProductActivity.activityList, params)
      console.log('接口返回：', data)
      if (data.rows) {
        let ActivityList = data.rows;
        let endTimeList = [],
          beginTimeList = []
        console.log('ActivityList====', ActivityList)
        ActivityList.forEach(function (item) {
          Object.assign(item, {
            activityBeginDate: (item.activityBeginDate).replace(/-/g, '/'),
            activityEndDate: (item.activityEndDate).replace(/-/g, '/'),
          })
          endTimeList.push((item.activityEndDate).replace(/-/g, '/'))
          beginTimeList.push((item.activityBeginDate).replace(/-/g, '/'))
        })
        _this.setData({
          ActivityList,
          actEndTimeList: endTimeList,
          actBeginTimeList: beginTimeList
        });
        console.log(_this.data.ActivityList)
        console.log('-thissaas', _this.data.actEndTimeList)
        console.log('-thissaas', _this.data.actBeginTimeList)
        let idx, ActivityPro, ActivityProList = []
        for (let i in ActivityList) {
          idx = i;
          console.log('idx', idx)
          ActivityPro = ActivityList[idx]
          ActivityProList.push(ActivityPro)
        }
        console.log('ActivityProList', ActivityProList)

        _this.setData({
          ActivityProList,
        })
        console.log('ActivityList====', ActivityList)
        console.log('message01', data.rows)
        return true
      } else {
        console.log('message02', data.rows)
        return false
      }
    } catch (err) {
      console.log('----false---')
      return false
    }
  },
  errImg: function(e) {
    let _this = this
    console.log(e)
    var index = e.target.dataset.index
    var errObj = []
    errObj = "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
    this.data.masterPicture[index] = errObj
    this.setData({
      masterPicture: this.data.masterPicture
    })
  },
  async getTime() {
    let _this = this
    console.log('_this.data.ActivityList', _this.data.ActivityList)
    _this.data.ActivityList.forEach(o => {
     
      let activityEndDate = o.activityEndDate
      let EndDate = +new Date(activityEndDate)
      let activityBeginDate = o.activityBeginDate
      let BeginDate = +new Date(activityBeginDate)
      let nowDate = +new Date() //获取当前时间戳
      let dTime
      let dTime1 = BeginDate - nowDate //计算时间差距离活动开始时间
      console.log('dTime1', dTime1)
      let dTime2 = EndDate - nowDate; //计算时间差距离活动结束时间
      if (dTime2 < 0) {
        console.log('活动已结束')
        Object.assign(o, {
          IsTimer: true,
          activityTxt: '活动已结束'
        })
        console.log(_this.data, 'thssadasd')
      }
      if (dTime1 > 0) {
        dTime = dTime1
        console.log('dTime1', dTime)
        Object.assign(o, {
          IsTimer: false,
          activityTxt: '抢购倒计时'
        })
      }
      if (dTime1 < 0 && dTime2 > 0) {
        dTime = dTime2
        console.log('dTime2', dTime)
        Object.assign(o, {
          IsTimer: false,
          activityTxt: '距离结束'
        })
        console.log('activityTxt', _this.data.activityTxt)
      }
      let sec = dTime / 1000; //计算秒
      let min = sec / 60; //计算分钟
      let hou = min / 60; //计算小时
      let day = hou / 24; //计算天
      Object.assign(o, {
        day: parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day),
        hou: parseInt(hou % 24) < 10 ? '0' + parseInt(hou % 24) : parseInt(hou % 24),
        min: parseInt(min % 60) < 10 ? '0' + parseInt(min % 60) : parseInt(min % 60),
        sec: parseInt(sec % 60) < 10 ? '0' + parseInt(sec % 60) : parseInt(sec % 60)
      })
      _this.setData({
        ActivityList: _this.data.ActivityList
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  choosedetail: function(e) {
    console.log(e);
    const e_data = e.currentTarget.dataset;
    console.log(e_data);
    let user = Common.getUser();
    let users = Common.getStorage('users')
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString() || Common.getStorage("shareStoreId2").toString();
    console.log('storeId', storeId)
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0 || storeId == -1) {
      storeId = Common.storeId2()
      console.log(storeId, 'storeId2===')
    }
    if (users == 3 && user == "用户不存在") {
      storeId = Common.getStorage('storeId').toString()
      if (storeId == " ") {
        return false;
      }
    }
    var prolistId = e_data.listdata.productId
    var activityCode = e_data.listdata.activityCode
    let sourceType = e_data.listdata.activityProductType
    if (sourceType == 1){
      sourceType = 17
    }else{
      sourceType = 16
    }
    wx.navigateTo({
      url: '/pages/flashSale-detail/flashSale-detail?productId=' + prolistId + '&storeId=' + storeId + '&activityCode=' + activityCode + '&sourceType=' + sourceType,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // clearInterval(that.data.longtime);
    that.getActivityList();
    // that.getTime()
    that.setData({
      longtime: setInterval(function () {
        console.log(11111)
        that.getTime()
      }, 1000)
    })
    // setTimeout(that.data.longtime)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onUnload() {
    console.log('离开了')
    clearInterval(this.data.longtime);
    this.setData({
      longtime:'',
      ActivityProList:'',
      ActivityList:''
    })
  },
  onHide: function() {
    //写在onHide()中，切换页面或者切换底部菜单栏时关闭定时器。
    console.log('离开了1')
    this.setData({
      longtime: '',
      ActivityProList: '',
      ActivityList: ''
    })
    clearInterval(this.data.longtime);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})