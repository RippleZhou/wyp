// components/index/index-recommend/index-recommend.js
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()

let {
  regeneratorRuntime
} = global

Component({
  properties: {
    showJiedouButtons: {
      type: Boolean,
      value: true
    },
    swiperList: {
      type: Array
    },
    gridList: {
      type: Array
    },
    advertisement: {
      type: Array
    },
    ppList: {
      type: Array
    },
    newproductList: {
      type: Array
    },
    floorList: {
      type: Array
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    showSpellDialog: false,
    adPosition: {},
    envEnvelopeId: -1,
    isShow: false,
    showShop: false,
    status: 0,
    newbie: {
      show: true,
      time: 3
    },
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    errorImgban: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo2.png"
  },
  ready() {
    console.log('newproductList', this.data.newproductList)
    console.log('gridList', this.data.gridList)
    console.log('advertisement', this.data.advertisement[0])
    var aa = this.data.advertisement[0] || null

    let self = this
    self.setData({
      newPosition: aa
      // newPosition:self.data.advertisement[0] || null
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    indexFloor(e) {
      console.log('recommend中的：', e.detail)

      this.triggerEvent('getBeanId', {
        share: e.detail
      })
    },
    gotoDetail(e) {
      var pid = e.currentTarget.dataset.pid
      wx.navigateTo({
        url: `/pages/product/product-view/product-view?productId=${pid}`
      })
    },
    jumpBanner(e) {
      let self = this
      let types = parseInt(e.currentTarget.dataset.types)
      let typeId = e.currentTarget.dataset.typeid
      console.log(e.currentTarget.dataset)
      switch (types) {
        case 0: //跳商品详情
          wx.navigateTo({
            url: `/pages/product/product-view/product-view?productId=${typeId}`
          })
          break;
        case 1: //跳搜索列表
          wx.navigateTo({
            url: `/pages/product/search-list/search-list?type=1&shareType=1&typeId=${typeId}`
          })
          break;
        default:
          throw 'error redirect type'
          break;
      }
    },
    gotoAdvertising() {
      wx.navigateTo({
        url: '/pages/activity0903/activity0903'
      })
    },
    // getLoginCode(){
    //   return new Promise((resolve,reject)=>{
    //     wx.login({
    //       success(res) {
    //         if (res.code) {
    //           resolve(res.code)
    //         } else {
    //           reject(res.errMsg)
    //         }
    //       }
    //     })
    //   })
    // },
    // async getOpenId(loginCode){
    //   let params = {
    //     authCode: loginCode
    //   }
    //   let MD5signStr = Common.md5sign(params);
    //   let url = `${Api.getMiniAppOpenId}?authCode=${loginCode}&sign=${MD5signStr}`
    //   let res= await Common.ajax.post(url)
    //   return res.message;
    // },
    async chooseDireact(e) {
      console.log('bbbb', e.currentTarget.dataset)
      let self = this
      let aurl = e.currentTarget.dataset.url

      if (aurl == '/?show=shop') {
        console.log('分享开店')
        this.triggerEvent('appdownload')
        return;
      }


      if (aurl == '/?show=beanbag') {
        aurl = '/pages/activity0903/activity0903'
      }
      if (aurl == '/spike') {
        aurl = '/pages/spike/spike'
      }
      if (aurl == '/activity0903') {
        aurl = '/pages/activity0903/activity0903'
      }

      if (aurl == '/activityNinetyNine') {
        aurl = '/pages/activityNinetyNine/activityNinetyNine'
      }
      if (aurl == '/inviteFriends') {
        aurl = '/pages/inviteFriends/inviteFriends'
      }
      if (aurl == '/?show=toast') {
        console.log('aaaabbbccc')
        aurl = '/pages/find/find'
        wx.switchTab({
          url: aurl
        })
        return;
      }

      wx.navigateTo({
        url: aurl
      })
    },
    goto(e) {
      let self = this
      let index = parseInt(e.currentTarget.dataset.index)
      let shareType = e.currentTarget.dataset.share
      let obj = self.data.ppList[index]
      switch (parseInt(obj.jumpType)) {
        case 0: //跳商品详情
          var proId = obj.id;
          wx.navigateTo({
            url: `/pages/product/product-view/product-view?productId=${proId}`
          })
          break;
        case 1: //跳搜索列表
          if (shareType) {
            let typeId = obj.jumpIds;
            wx.navigateTo({
              url: `/pages/product/search-list/search-list?type=1&shareType=${shareType}&typeId=${typeId}`//TODO url跳转不存在
            })
            break;
          } else {
            let typeId = obj.jumpIds;
            wx.navigateTo({
              url: `/pages/product/search-list/search-list?type=1&typeId=${typeId}`
            })
            break;
          }
        default:
          throw 'error redirect type'
          break;
      }
    },
  }
})

