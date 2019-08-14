// pages/mywy/mywy.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
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
  onShareAppMessage: function (res) {
    return {
      title: '我绑定的物业',
      path: 'pages/mywy/mywy'
    }
  },

  data: {
    // cancelReason: [
    //   { title: '确认重新绑定' },
    //   { content: '重新绑定物业公司，之前的物业币即被清空，您确定要重新绑定物业？' }
    // ],
  },
  // clickMask() {
  //   // this.setData({show: false})
  // },
  goBindAddress(){
    wx.navigateTo({
      url: '/pages/bindAddress/bindAddress',
    })
  },
  // cancel() {
  //   this.setData({ show: false })
  //   this.triggerEvent('cancel')
  // },
  // async conFirm() {
  //   let url = Api.housing.myCusHousing
  //   let user = Common.getStorage('user');
  //   let userCode = Common.getStorage('userCode').toString()
  //   console.log(userCode, 'userCode==')
  //   let parm = {
  //     userCode
  //   }
  //   let MD5signStr = Common.md5sign(parm);
  //   parm.sign = MD5signStr
  //   try {
  //     let unbindResult = Common.ajax.post(url, parm)
  //     Common.setStorage('Isb', 0)
  //     Common.setStorage('user', Object.assign(user, { isBinding: 0 }))
  //     Common.setStorage('storeId', 0)
  //     Common.setStorage('housingAddress', null)
  //     Common.setStorage('storeName', null)
  //     Common.setStorage('wy',null)
  //     Common.setStorage('address', null)
  //     wx.navigateTo({
  //       url: '/pages/bindAddress/bindAddress',
  //       success() {
  //         var page = getCurrentPages().pop();
  //         page.load
  //       }
  //     })
  //     this.setData({
  //       show: false
  //     })
  //   }catch(err){
  //     wx.showToast({
  //       title: err.message,
  //       icon: 'none'
  //     })
  //   }
  // },
  // phone: function (event) {
  //   let phone = event.currentTarget.dataset.phone;
  //   wx.makePhoneCall({
  //     phoneNumber: phone
  //   })
  // },
  // resetWy: function (e) {
  //   this.setData({
  //     show: {
  //       type: Boolean,
  //       value: true
  //     },
  //     //modal的高度
  //     height: {
  //       type: String,
  //       value: '100%'
  //     },
  //   })
  // },
  MyWy() {
    let userCode = Common.getStorage('userCode');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let islogin = Common.getStorage('islogin')
    console.log('islogin++', islogin)
    let {
      address,
      storeName,
      cellPhone,
      housingAddress,
      housingCode,
      storeId,
      customerName,
    } = Common.getStorage('wy')

    this.setData({
      address,
      storeName,
      cellPhone,
      housingAddress,
      housingCode,
      storeId,
      customerName,
    })

    // let user=Common.getUser();
    // let userCode = user.userCode
  }
})