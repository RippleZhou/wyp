// pages/ReturnRequest/rerurnSuccess/rerurnSuccess.js
const api = require('../../../utils/api.js')
const common = require('../../../utils/common.js')
Component({
  properties: {
    orderId:String,
    // delivery_info: {
    //   type: String,
    //   value: ''
    // },
    // obtain_property_currency: {
    //   type: String,
    //   value: '*'
    // }
  },
  data:{
    property_currency:'*',
    delivery_info:'',
    obtain_property_currency:'**'
  },
  methods:{
    GoPage: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    LookOrder: function () {
      wx.switchTab({
        url: '/pages/order/order',
      })
    }
  },
  ready: function () {
    // debugger
    let that = this 
    let url = api.order.orderDetail
    let data = { orderId: this.data.orderId } //this.data.orderId} 
    common.request.post(url, common.miscellaneous.signedParams(data), data=>{
      let message = data.message
      let obtain_property_currency = message.housingAmount 
      
      let pre= ''
      if (message.wantYearDate){
        let wantYearDate = new Date(message.wantYearDate.replace(/-/g, '/'))
        let now = new Date()
        if (now.getDate() == wantYearDate.getDate())
          pre = '今天' 
        else 
         pre ='明天'
      }

      that.setData({
        delivery_info: (message.wantYearDate ? (pre + ' ' + message.wantDate) : ''),
        obtain_property_currency: obtain_property_currency
      })
    })

    //当前用户物业币
    let num = common.getUser().housingCoin|| 0
    this.setData({
      property_currency : num
    })
  }
})