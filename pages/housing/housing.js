// pages/housing/housing.js
const Common = require('../../utils/common');
const util = require('../../utils/util')
const Api = require("../../utils/api");
const app = getApp();
let {
  regeneratorRuntime
} = global

Page({
  data: { 
    emptyHidden: true,
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    housingList: [],
    housingListSwap: [],
    isShowLetter: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    housing: "",
    housingList_search: [],
    address_show: false,
    search_housing: [],
    is_data: true,
    seacrch_value: '',
  },
  onShareAppMessage: function (res) {
    return {
      title: '物业拼拼',
      path: 'pages/housing/housing'
    }
  },
  async onLoad(options) {
    console.log('options22222',options)
    var searchLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    this.gethousing()
    console.log('options===', options)
    let cityId=options.cityId;
    console.log('cityId===', cityId)
    this.setData({
      cityId
    })
    console.log('cityId===',cityId)
  },
  async gethousing() {
    console.log(this);
    let cityId = this.options.cityId;
    console.log('cityId==',cityId)
    let params={
      cityId,
    }
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
  
    let res = await Common.ajax.post(Api.address.getHousingListByCityId, params)
    console.log('res==',res.message)
    let housingList = res.message

    let emptyHidden = true
    if (housingList.length == 0) {
      emptyHidden = false
    } else {
      emptyHidden = true
    }

    this.setData({
      emptyHidden,
      housingList: housingList,
      housingListSwap: housingList
    })
  },
  cancel_housing: function (e) {
    let {
      housingList,
      housingListSwap
    } = this.data
    let that = this;
    that.setData({
      housingList: housingListSwap,
      address_show: false,
      seacrch_housing: '',
    })
  },
  search_housing: function (e) {
    let that = this;
    that.setData({
      address_show: true
    })
  },
  seacrch_housing: function (e) {
    this.setData({
      address_show: true
    })
    let search_val = e.detail.value;
    console.log('search_val++', search_val)
    let {
      housingList,
      housingListSwap
    } = this.data
    housingList = housingListSwap
    // console.log('housingList==', housingList)

    // if (!search_val) {
    //   console.log('housingListSwap', housingListSwap)
    //   this.setData({
    //     housingList: housingListSwap
    //   })
    //   return;
    // }

    let searchedhousings = []
    housingList.forEach(housing => {
      if (housing.storeName.indexOf(search_val) >= 0) {
        searchedhousings.push(housing)
      }
    })
    this.setData({
      housingList: searchedhousings
    })

  },
  //选择城市
  bindHousing: function (e) {
    console.log(e);
    let user = Common.getUser() || Common.getStorage('user');
    let address = e.currentTarget.dataset.address;
    let storeName = e.currentTarget.dataset.storename;
    let storeId = e.currentTarget.dataset.storeid;
    this.setData({
      address,
      storeName,
      storeId
    })
    Common.setStorage('address', address)　　 // 回到首页
    Common.setStorage('storeName', storeName)　　 // 回到首页
    Common.setStorage('storeId', storeId)　　 // 回到首页
    wx.navigateTo({
      url: '/pages/bindAddress/bindAddress?address=' + address + '&storeName=' + storeName + '&storeId' + storeId,
    })
  }
})