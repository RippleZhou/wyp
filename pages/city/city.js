// pages/city/city.js
const Common = require('../../utils/common');
const util = require('../../utils/util')
const Api = require("../../utils/api");
const app = getApp();
let {
  regeneratorRuntime
} = global

Page({
  data: {
    emptyHidden:true,
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    cityListSwap: [],
    isShowLetter: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    city: "",
    cityList_search: [],
    address_show: false,
    search_city: [],
    is_data: true,
    seacrch_value: '',
  },
  onShareAppMessage: function (res) {
    return {
      title: '物业拼拼',
      path: 'pages/city/city'
    }
  },
  async onLoad(options) {
    var searchLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    this.getCity()
  },
  gotoHousing(e){
    let cid = e.currentTarget.dataset.cid
    let userCode=Common.getStorage('userCode')
    wx.navigateTo({
      url: `/pages/housing/housing?cityId=${cid}&userCode=${userCode}`
    })
  },
  async getCity() {
    let res = await Common.ajax.get(Api.address.getOpendCityList, {})
    let cityList = res.message
    console.log('cityList:222', cityList)
    let emptyHidden=true
    if (cityList.length==0){
      emptyHidden=false
    }else{
      emptyHidden = true
    }

    this.setData({
      emptyHidden,
      cityList: cityList,
      cityListSwap: cityList
    })
  },
  cancel_city: function(e) {
    // let search_val = e.detail.value;
    let {
      cityList,
      cityListSwap
    } = this.data
    // cityList = cityListSwap
    console.log(11221)
    let that = this;
    that.setData({
      address_show: false,
      seacrch_city: '',
      cityList: cityListSwap
    })
  },
  search_city: function(e) {
    console.log('aaa')
    let that = this;
    that.setData({
      address_show: true
    })
  },
  seacrch_city: function(e) {
    let search_val = e.detail.value;

    let {
      cityList,
      cityListSwap
    } = this.data

    cityList= cityListSwap
    // if (!search_val) {
    //   this.setData({
    //     cityList: cityListSwap
    //   })
    //   console.log('cityList', cityList)
    //   return ;
    // }

     let searchedCitys = []
    cityList.forEach(city => {
      if (city.cityName.indexOf(search_val) >= 0) {
        searchedCitys.push(city)
      }
    })
    this.setData({
      cityList: searchedCitys,
      address_show:true
    })

  },
  //选择城市
  bindCity: function(e) {
    let cityId = e.currentTarget.dataset.cityid;
    let userCode = Common.getStorage('userCode')
    this.setData({
      cityName: e.currentTarget.dataset.cityname,
      cityId: e.currentTarget.dataset.cityid
    })
    console.log(userCode);
    console.log(e);
    Common.setStorage('cityId', cityId)　　 // 回到首页
    wx.navigateTo({
      url: '/pages/housing/housing?cityId=' + cityId + '&userCode=' + userCode,
    })
  }
})