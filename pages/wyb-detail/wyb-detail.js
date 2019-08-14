const Common = require("../../utils/common");
var Api = require("../../utils/api");
const app = getApp();
let { regeneratorRuntime } = global;

function throttle(fn) {
  let timeout;
  let currentDate = new Date().now();
  const context = this;
  return function() {
    const now = new Date.now();
    clearTimeout(timeout);
    if (now - currentDate > 100) {
      fn && fn.apply(context);
      currentDate = now;
    } else {
      setTimeout(() => {
        fn && fn.apply(context);
      }, 100);
    }
  };
}

Page({
  data: {
    page: 1,
    wybList: [],
    relList: [],
    records: [], //核销
    currentTab: 0,
    screenHeight: 0,
    type: 2,
    onTab: false,
    filterDate: null,
    outTotal: "0.00",
    feeTotal: "0.00",
    isLas:0,
  },
  // 日期选择
  bindDateChange(e) {
    const { value } = e.detail;
    const { wybList } = this.data;
    const rel = wybList.filter(list => list.months === value);
    this.setData({
      relList: rel,
      filterDate: value
    });
  },
  // 分享
  onShareAppMessage: function(res) {
    return {
      title: "物业币明细",
      path: "pages/wyb-detail/wyb-detail"
    };
  },
  // 导航
  gotoWybDetail(e) {
    const { wybid, type, orderid } = e.currentTarget.dataset;
    if (type) {
      wx.navigateTo({
        url: "/pages/bills/bills?wybId=" + wybid
      });
    } else {
      wx.navigateTo({
        url: "/pages/order-detail/order-detail?orderId=" + orderid
      });
    }
  },
  // 滚动行为
  async scrolltolower(e) {
    let { dataset } = e.currentTarget;
    let { allPage, page, wybList, type, tabIndex } = this.data;
    let p = page + 1;
    let limit = 10;
    let offset = 1;
    if (p > 1) {
      offset = (p - 1) * limit;
    } else {
      offset = 1;
    }
    if (p <= allPage) {
      //有数据就继续加载
      let list = await this.getList(Common.getUser().userCode, offset, type);
      let alllist = wybList.concat(list);
      this.setData({
        page: p,
        wybList: alllist
      });
    }else{
      this.setData({ isLas:1})
    }
  },
  async getList(userCode, offset, type) {
    let limit = 10;
    let url = Api.housing.list;
    let params = {
      userCode,
      type,
      limit,
      offset
    };
    let MD5signStr = Common.md5sign(params);
    let reqParams = { sign: MD5signStr, ...params };
    let res = await Common.ajax.post(url, reqParams);
    wx.hideLoading();
    let outTotal = 0;
    res.rows.forEach(item => (outTotal += Number(item.outlay)));
    let allPage = Math.ceil(res.total / 10);
    this.setData({
      allPage,
      filterDate: null,
      outTotal: outTotal.toFixed(2)
    });
    return res.rows;
  },
  async onLoad(options) {
    let user = Common.getUser();
    let list = await this.getList(user.userCode, 1, 2);
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          wybList: list,
          relList: list,
          screenHeight: (res.windowHeight - 55) * 2
        });
      }
    });
    // intersectionObserver
    /*  this._observer = wx.createIntersectionObserver(this);
      this._observer
        .relativeTo(".scroll-view")
        .observe(".all-content-wrap", ({ dataset }) => {
          console.log(dataset)
          const { date } = dataset;
          this.setData({ date });
        }); */
  },
  // 核销记录
  async getRecords() {
    let userCode = Common.getUser().userCode;
    const res = await Common.ajax.get(Api.housing.verify, { userCode });
    const { records } = res.message;
    let feeTotal = 0;
    records.forEach(item => (feeTotal += item.cancel_fee));
    this.setData({
      records,
      feeTotal: feeTotal.toFixed(2)
    });
    wx.hideLoading();
  },
  //滑动切换
  async swiperTab(e) {
    var that = this;
    let index = e.detail.current;
    let userCode = Common.getUser().userCode;
    wx.showLoading();
    this.setData({
      onTab: true
    });
    if (index == 0) {
      console.log("全部");
      let list = await this.getList(userCode, 1, 2);
      this.setData({
        type: 2,
        wybList: list,
        relList: list,
        onTab: false
      });
    }

    if (index == 1) {
      console.log("收入");
      let list = await this.getList(userCode, 1, 0);
      this.setData({
        type: 0,
        wybList: list,
        relList: list,
        onTab: false
      });
    }

    if (index == 2) {
      let list = await this.getList(userCode, 1, 1);
      this.setData({
        type: 1,
        wybList: list,
        relList: list,
        onTab: false
      });
    }

    if (index == 3) {
      await this.getRecords();
      this.setData({
        onTab: false
      });
    }

    that.setData({
      currentTab: index
    });
  },
  //点击切换
  clickTab(e) {
    let index = e.target.dataset.current;
    if (this.data.onTab) return false;
    if (this.data.currentTab === index) {
      const { wybList } = this.data;
      this.setData({
        relList: wybList
      });
    } else {
      this.setData({
        currentTab: index
      });
    }
  },
  onShow(){
    let currentTab = Common.getStorage('curType')
    Common.removeStorage('curType')
    console.log("当前状态currentTab:",currentTab)
    this.setData({ currentTab})
  }
});
