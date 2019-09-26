// pages/product/search_list/search_list.js
const Common = require("../../../utils/common");
var Api = require("../../../utils/api");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 10,
    total: 0,
    items: [],
    searchText: "",
    noDataImgUrl:
      "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_02.png",
    imgIsShow: false,
    options: {},
    requestUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    let requestUrl = Api.mall.search;
    self.setData({
      searchText: options.searchText || "",
      requestUrl,
      options
    });

    self.getProList();
  },
  goSearch(){
    wx.switchTab({
      url: '/pages/exchangeBox/exchangeBox',
    })
  },
  scrolltolower() {
    var self = this;
    self.getProList();
  },
  getProList() {
    var self = this;

    if (self.data.total <= self.data.offset && self.data.total != 0) return; //翻到最后一页

    const { searchText } = self.data;
    let users=Common.getStorage('users')
    let user = Common.getUser() || Common.getStorage("user");
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString();
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
    var params = {
      storeId,
      searchText
    };
    let MD5signStr = Common.md5sign(params);
    params.sign = MD5signStr;
    Common.request.post(self.data.requestUrl, params, data => {
      const { productList } = data.message;
      if (productList.length) {
        self.setData({
          items: productList
        });
      }
    });
  },
  setDefaultValue: function(e) {
    var self = this;
    self.setData({
      searchText: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  search() {
    var self = this;
    self.setData({
      offset: 0,
      limit: 10,
      total: 0,
      items: []
    });
    self.getProList();
  },
  navigate(e) {
    const { productid } = e.currentTarget.dataset;
    // console.log(e.currentTarget)
    let users = Common.getStorage('users')
    let user = Common.getUser() || Common.getStorage("user");
    let storeId = new Number(user.storeId).toString() || Common.getStorage('storeId').toString();
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
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?storeId=${storeId}&productId=${productid}`
    });
  },
  onUnload: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
