const Utils = require('../../utils/util')
const Common = require('../../utils/common')
var Api = require("../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global

Page({
  data: {
    latitude: '',
    longitude: '',
    wyb: 0,
    fee:0,
    totalWyb:0,
    hiddenUser: false,
    urlImg:'/img/wypp.png'
  },
  GoLogin: function () {
    wx.redirectTo({
      url: '/pages/home/home',
    })
  },
  async GoMyWyb() {
    await this.goToLogin()
    let isBinding=Common.getStorage('user').isBinding;
    console.log('==isBinding===', isBinding)
    if(isBinding){
      wx.navigateTo({
        url: '/pages/mywyb/mywyb',
      })
    }else{
      return false;
    }
  },
  GoMyBind: function () {
    this.goToLogin()
    wx.navigateTo({
      url: '/pages/bindAddress/bindAddress',
    })
  },
  gowyDetail(){
    this.goToLogin()
    Common.setStorage('curType',2)
    wx.navigateTo({
      url: "/pages/wyb-detail/wyb-detail"
    });
  },
  GoSet: function () {
    this.goToLogin()
    wx.navigateTo({
       url: "/pages/Setting/Setting",
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '我的',
      path: 'pages/owner/owner'
    }
  },
  GoMyAddress(){
    this.goToLogin()
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  GoSuggest: function () {
    this.goToLogin()
    let storeName = this.data.storeName
    let storeId = this.data.storeId
    let customerName = this.data.customerName
    wx.navigateTo({
      url: '/pages/suggest/suggest?storeId=' + storeId + '&storeName=' + storeName + '&customerName=' + customerName,
    })
  },
  GoAllOrder: function (e) {
    this.goToLogin()
    console.log(e)
    let states = e.currentTarget.dataset.states
    app.globalData.states = states
    wx.switchTab({
      url: '/pages/order/order',
      success() {
        var page = getCurrentPages().pop();
        page.onLoad()
      }
    })
  },
  GoOrder: function () {
    this.goToLogin()
    // wx.navigateTo({
    //   url: '/pages/order-detail/order-detail',
    // })
  },
  GoCall: function () {
    wx.makePhoneCall({
      phoneNumber: '客服热线：400-720-0000',
    })
  },
  GoScan: function () {
    this.goToLogin()
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async GoMyWy() {
    await this.goToLogin()
    let {
      address,
      storeId,
      housingCode,
      cellPhone,
      storeName,
      storeAddress,
      // residualFee,// 欠费金额
      customerName,
      myAddress,// 用户详细地址
    } = this.data
    let housingAddress = storeName + ' (' + storeAddress + ')' //拼接的 物业+小区地址 //拼接的 物业+小区地址
    let IsBind = this.data.isBinDing
    let user = Common.getUser();
    Common.saveUser(user)
    let userCode = user.userCode
    var that = this;
    if (IsBind == 0) {
      let cityId = Common.getStorage('cityId');
      wx.navigateTo({
        url: '/pages/bindAddress/bindAddress',
      })
    } else {
      let wy = {
        address,
        storeName,
        storeId,
        housingCode,
        cellPhone,
        housingAddress,
        customerName,
        myAddress
      }
      Common.setStorage('wy', wy)
      wx.navigateTo({
        url: '/pages/mywy/mywy'
      })
    }
      },
//获取我绑定的小区信息
  getMyHousing(){
    let that=this
    var url = Api.housing.myHousing
    let user = Common.getUser()||Common.getStorage('user');
    console.log('user==',user)
    let userCode = user.userCode
    var parm = {
      userCode
    }
    let MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(Api.housing.myHousing, parm, function (data) {
      if (data.status == 'OK') {
        // console.log(data)
        let MyHousing = data.message
        let isBingHouse = MyHousing.isBinDing
        let address = MyHousing.address // 用户详细地址
        let cellPhone = MyHousing.cellPhone //物业电话
        let housingCode = MyHousing.housingCode //缴费户号
        let storeAddress = MyHousing.storeAddress //小区地址
        let storeName = MyHousing.storeName    //物业名称
        let customerName = MyHousing.customerName //用户名称
        let housingAddress = storeName + ' (' + storeAddress + ')' //拼接的 物业+小区地址
        let myAddress = storeAddress + '(' + address + ')'// 用户详细地址
        // let residualFee = MyHousing.residualFee //欠费金额
        let isBinDing = MyHousing.isBinDing //1已绑定 0是未绑定
        let storeId = MyHousing.storeId
        that.setData({
          address,
          storeName,
          storeAddress,
          storeId,
          cellPhone,
          housingCode,
          housingAddress,
          customerName,
          myAddress,
          isBinDing
        })
      }
    })
  },
  getMyInfo(){
    let user = Common.getUser()
    let userCode = user.userCode
    var url = Api.housing.getUser
    let parm={
      userCode
    }
    let MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    Common.request.post(url,parm,function(data){
      if(data.states=="ok"){
      }
    })
  },
  onShow() {
    Common.setStorage('Isb', 1)
    let userInfo = Common.getStorage('userInfo')
    this.setData({
      userInfo
    })
    console.log('userInfo===', userInfo, '***********', userInfo.avatarUrl)
    let user = Common.getUser()
    console.log('user===',user)
    Common.saveUser(user)
    console.log('---user===', user)
    let userCode = user.userCode||Common.getStorage('userCode')
    this.render()
    this.getMyHousing()
    if (userCode) {
      console.log('11111sadadas')
      Common.setTabBar(this);
    }else{
      console.log('无usercode')
    }
  },
  onLoad: function (options) {
    console.log('onload')
    // let user=Common.getUser()
    //  Common.saveUser(user)
    // console.log('user????',user)
    // let userCode=user.userCode
    // this.render()
    // this.getMyHousing()
  },
  getStorage(key) {
    try {
      var value = wx.getStorageSync(key)
      if (value) {
        return value
      } else {
        return ''
      }
    } catch (e) {
      this.showStorageError()
    }
  },
  getUser() {
    let user = Common.getUser()
    this.setData({
      user
    })
    Common.getStorage();
    console.log(user)
  },
  hidePhone(phone) {
    let start = phone.substring(0, 3)
    let last = phone.substring(7, 12)
    return `${start}****${last}`
  },
  renderUser() {
    let user = Common.getUser()
    let userCode = user.userCode
    user.cellPhone = this.hidePhone(user.cellPhone)
    this.setData({
      user,
      hiddenUser: true
    })
  },
  async getWYB() {
    let user = Common.getUser()
    let userwyb = await Common.getUserFromApi(user.userCode)
    return userwyb.message
  },
  async renderWYB() {
    let {housingCoin,residualFee,totalHousingCoin} = await this.getWYB()
    this.setData({
      wyb:Number(residualFee),
      totalWyb:Number(totalHousingCoin),
      fee:Number(housingCoin)
    })
  },
  render() {
    this.renderUser()
    this.renderWYB()
  },
  goToLogin(){
    let user = Common.getUser() || Common.getStorage('user');
    let userCode=Common.getStorage('userCode')||user.userCode
    if (userCode){
      return true;
    }else{
      wx.redirectTo({
        url: '/pages/home/home',
      })
      return false
     }
  }
})