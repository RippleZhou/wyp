// pages/bindAddress/bindAddress.js
const Common = require('../../utils/common');
const util = require('../../utils/util')
const Api = require("../../utils/api");
const app = getApp();
let {
  regeneratorRuntime
} = global
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
  data: {
    address_show: false,
    cityId: '',
    textarea: '',
    storeName: '',
    housingAddress: '',
    address: '',
    MyHousingVal: '',
  },
  CheckHousing: function(e) {
    let cityId = Common.getStorage('cityId');
    wx.navigateTo({
      url: '/pages/city/city?cityId=' + cityId,
    })
  },
  goCheckHousing(e) {
    var that = this
    that.setData({
      textarea: e.detail.value
    })
    if (e.detail.value.length > 10) {
      let userCode = ''
      if (Common.getStorage('userCode')) {
        userCode = Common.getStorage('userCode')
      } else {
        userCode = Common.getStorage('user').userCode
      }
      let propertyId = Common.getStorage('storeId').toString()
      let cityId = Common.getStorage('cityId');
      let cusHousingCode = this.data.textarea
      let params = {
        cusHousingCode,
        propertyId,
        userCode,
        type: '0'
      };
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      let store = Common.getStorage('store')
      Common.request.post(Api.housing.bindingProperty, params,
        function(data) {
          if (data.status == "OK") {
            console.log(data);
            let address = data.message.address // 用户详细地址
            let cellPhone = data.message.cellPhone //物业电话
            let housingCode = data.message.housingCode //缴费户号
            let storeAddress = data.message.storeAddress //小区地址
            let storeName = data.message.storeName //物业名称
            let housingAddress = storeName + ' (' + storeAddress + ')' //拼接的 物业+小区地址
            let myAddress = storeAddress + '(' + address + ')'
            let customerName = data.message.customerName
            let residualFee = data.message.residualFee // 欠费金额
            // Common.setStorage({ 'housingAddress': housingAddress, 'myAddress': myAddress, 'residualFee': residualFee})
            Common.setStorage('housingAddress', housingAddress)
            Common.setStorage('myAddress', myAddress)
            Common.setStorage('residualFee', residualFee)
            that.setData({
              residualFee,
              housingAddress: housingAddress,
              myAddress: myAddress,
              customerName
            })
          } else {
            console.log(error);
          }
        })
    }
  },
  housingInfo() {
    let params = {};
    let _this = this;
    let user = Common.getUser();
    let storeId = Common.getStorage('storeId').toString()
    console.log('storeId', storeId)
    params.storeId = storeId
    console.log(params.storeId, '---storeId2===')
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
          Common.setStorage('dwaddress', data.message.storeAddress)
          Common.setStorage('wyname', data.message.storeName)
          Common.setStorage('storeId', data.message.id)
        } else {
          console.log(data.message);
        }
      })
  },
  async conFirm() {
    var that = this
    let cityId = Common.getStorage('cityId');
    let propertyId = Common.getStorage('storeId').toString()
    let userCode = ''
    if (Common.getStorage('userCode')) {
      userCode = Common.getStorage('userCode')
    } else {
      userCode = Common.getStorage('user').userCode
    }
    let store = Common.getStorage('store')
    let cusHousingCode = that.data.cusHousingCode
    if (!cusHousingCode) {
      wx.showToast({
        title: '请输入正确的门牌号',
        icon: 'none'
      })
      return false;
    }
    console.log('cusHousingCode==', cusHousingCode)
    let params = {
      cusHousingCode,
      propertyId,
      userCode,
      type: '1'
    };
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    console.log("userCode01", userCode)
    let res = await Common.getUserFromApi(userCode)
    console.log("绑定res:", res)
    let user = Common.getUser();
    console.log("绑定User:", user)
    // let isBinging = user.isBinging
    Common.request.post(Api.housing.bindingProperty, params,
      function(data) {
        console.log(data);
        if (data.status == "OK") {
          that.housingInfo()
          Common.setStorage('isBinding', 1)
          Common.saveUser(user)
          Common.setStorage('user', Object.assign(user, {
            isBinding: 1
          }))
          Common.setStorage('user', Object.assign(user, {
            storeId: propertyId
          }))
          Common.setStorage('dwaddress', )
          let targetUrl = Common.getStorage('targetUrl')
          let isAddPay = Common.getStorage('isAddPay')
          if (targetUrl) {
            if (isAddPay == 1) {
              Common.setStorage('isAddCar', 2)
            } else {
              Common.setStorage('isAddCar', 1)
            }
            Common.removeStorage('isAddPay')
            Common.removeStorage('targetUrl')
            return wx.redirectTo({
              url: targetUrl
            })
          }
          that.goIndex()
        } else {
          console.log(error);
        }
      })
  },
  cancel() {
    this.setData({
      show: false
    })
    this.triggerEvent('cancel')
  },
  bindingProperty() {
    let that = this
    let isBinding = Common.getUser().isBinding
    if (isBinding == 0) {
      console.log('isbing', isBinding)
      this.setData({
        show: false
      })
      this.triggerEvent('cancel')
      that.conFirm()
    } else {
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
    }
  },
  goIndex() {
    Common.setStorage('Isb', 1)
    // 如果是从购物车引导绑定的，返回首页
    if (app.globalData.requireBindingForCart) {
      // Common.setStorage('Isb', 0)
      wx.switchTab({
        url: '/pages/index/index',
      })
      return
    }
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  cancel_HouseNum: function(e) {
    let that = this;
    that.setData({
      // HouseNumList: HouseNumListSwap,
      address_show: false,
      BindAddress: '',
    })
  },
  search_HouseNum: function(e) {
    let that = this;
    that.setData({
      address_show: true
    })
  },
  seacrch_HouseNum: function(e) {
    let that = this
    that.setData({
      search_val: e.detail.value
    })
    that.setData({
      address_show: true
    })
    let propertyId = Common.getStorage('storeId').toString()
    let address = that.data.search_val.toString()
    let params = {
      address,
      propertyId,
    };
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.address.customerHousing, params, function(data) {
      if (data.status == "OK") {
        console.log(data);
        let HouseNumList = data.rows
        console.log(HouseNumList)
        that.setData({
          HouseNumList,
          // HouseNumListSwap
        })
        // HouseNumList = HouseNumListSwap
        console.log('HouseNumList', HouseNumList)
        // console.log('HouseNumListSwap', HouseNumListSwap)
      }
    })
    console.log('address++', address)
    // let {
    //   HouseNumList,
    //   HouseNumListSwap
    // } = that.data
    // HouseNumList = HouseNumListSwap
    // console.log('HouseNumList', HouseNumList)
    // console.log('HouseNumListSwap', HouseNumListSwap)
    let searchedHouseNums = []
    // HouseNumList.forEach(HouseNumList => {
    //   if (HouseNumList.storeName.indexOf(that.search_val) >= 0) {
    //     searchedHouseNums.push(HouseNumList)
    //   }
    // })
    that.setData({
      HouseNumList: searchedHouseNums
    })
  },
  goBindHouseNum(e) {
    console.log(e)
    let BindAddress = e.currentTarget.dataset.address
    let cusHousingCode = e.currentTarget.dataset.housing
    this.setData({
      BindAddress,
      address_show: false,
      cusHousingCode
    })
  },
  onShareAppMessage: function(res) {
    return {
      title: '绑定小区',
      path: 'pages/bindAddress/bindAddress'
    }
  },
  onLoad() {
    let customerName = ''
    let storeId = ''
    let store = ''
    let storeName = ''
    // let cityId = Common.getStorage('cityId')
    let address = ''
  },
  async onShow() {
    let userCode = Common.getStorage('userCode');
    if (!userCode) {
      userCode = Common.getStorage('user').userCode;
    }
    let residualFee = ''
    if (!this.data.textarea) {
      residualFee = ''
    } else {
      residualFee = Common.getStorage('residualFee');
    }
    let customerName = Common.getStorage('customerName')
    let storeId = Common.getStorage('storeId')
    let store = Common.getStorage('store')
    let storeName = Common.getStorage('storeName')
    // let cityId = Common.getStorage('cityId')
    let address = Common.getStorage('address')
    let housingAddress = ""
    if (address && storeName) {
      housingAddress = storeName + ' ( ' + address + ')' //拼接的 物业+小区地址
    }
    let MyAddress = Common.getStorage('MyAddress')
    this.setData({
      userCode,
      housingAddress,
      storeName,
      storeId,
      store,
      customerName
    })
  },
})