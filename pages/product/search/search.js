// pages/product/search/search.js
const Common = require("../../../utils/common");
var Api = require("../../../utils/api");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShows: true,
    address_show: false,
    historySearchKeys: [],
    hotKeys: [],
    list: [],
    searchKey: "",
    type: 1,
    current: 0,
    limit: 10,
    offset: 1,
    page: 1,
    storeId: 0
  },
  closePopup() {
    this.setData({
      address_show: false,
      searchKey: ""
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    if (options.type) {
      self.setData({
        type: options.type
      });
    }
  },
  onShow: function() {
    const self = this;
    let historySearchKeys = wx.getStorageSync("historySearchKeys") || [];
    historySearchKeys = historySearchKeys.reverse();
    self.setData({
      searchKey: "",
      historySearchKeys
    });
  },
  getData() {
    const _this = this;
    let params = {};
    var cartItems = {};
    let user = Common.getUser() || Common.getStorage("user");
    params.storeId = new Number(user.storeId).toString();
    params.searchKey = _this.data.searchKey;
    params.offset = new Number(_this.data.offset).toString();
    params.limit = new Number(_this.data.limit).toString();
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.mall.search, params, data => {
      let hotKeys = data.message.hotSearch;
      console.log(hotKeys);
      _this.setData({
        hotKeys: hotKeys,
        list: data.message.productList
      });
    });
  },

  setDefaultValue: function(e) {
    const self = this;
    var value = e.detail.value;
    self.setData({
      searchKey: value,
      address_show: true
    });
  },
  goBack() {
    wx.navigateBack();
  },
  deleteSearchKeys() {
    const self = this;
    self.setData({
      historySearchKeys: []
    });
    wx.removeStorage({
      key: "historySearchKeys"
    });
  },
  goSearchList(e) {
    const { key } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/product/search_list/search_list?searchText=" + key
    });
  },
  search(e) {
    var value = e.detail.value;
    this.setData({
      searchKey: value,
      address_show: true
    });
    const self = this;
    if (self.data.searchKey.trim() == "") return;
    let historySearchKeys = self.data.historySearchKeys;
    for (var index in historySearchKeys) {
      //去掉重复的搜索
      if (historySearchKeys[index] == self.data.searchKey) {
        historySearchKeys.splice(index, 1);
      }
    }
    historySearchKeys.push(self.data.searchKey);
    Common.setStorage("historySearchKeys", historySearchKeys);
    wx.navigateTo({
      url:
        "/pages/product/search_list/search_list?searchText=" +
        self.data.searchKey
    });
  }
});
