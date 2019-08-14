// components/index/index-floor/index-floor.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()

Component({
  properties: {
    showJiedouButtons: {
      type: Boolean,
      value: true
    },
    floorList: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: 1,
    showShare: false,
    shareShow: false,//
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    errorImgban: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo2.png"
  },
  ready() {
    console.log('indexfloor:', this)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goto(e) {
      console.log('aaaa')
      var self = this
      let obj = e.currentTarget.dataset
      console.log(obj)
      switch (parseInt(obj.jumptype)) {
        case 0: //跳商品详情
          var productId = obj.jumpid;
          wx.navigateTo({
            url: `/pages/product/product-view/product-view?productId=${productId}`
          })
          break;
        case 1: //跳搜索列表
          let typeId = obj.jumpids;
          let type = self.data.type
          wx.navigateTo({
            url: `/pages/product/search-list/search-list?type=${type}&typeId=${typeId}`
          })
          break;
        default:
          console.log("error redirect type");
          break;
      }
    },
    share(e) {
      //借豆 分享
      let dataset = e.currentTarget.dataset
      let that = this

      if (!Common.biz.loggedIn(Common.getRoute())) return;//检查登录

      let params = { productId: dataset.proid, customerCode: Common.getCustomerCode() }
      Common.request.get(Api.product.getShareByKey, params,
        (data) => {

          let shareUrl = data.message.shareUrl
          let title = data.message.mainTitle
          let desc = data.message.secondTitle
          // let link = shareUrl.split('#')[0] + 'static/html/redirect.html?app3Redirect=' + encodeURIComponent(shareUrl)
          that.triggerEvent('indexFloor', {
            shareUrl, title
          })
        })

      // that.setData({
      //   shareShow: true
      // })
    },
  },
})
