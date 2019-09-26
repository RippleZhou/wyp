// pages/fillOrder/fillOrder.js
const computedBehavior = require("miniprogram-computed");
const api = require('../../utils/api.js')
const common = require('../../utils/common')
const selecteds = 0
var app = getApp();
let {
  regeneratorRuntime
} = global
const status = {
  selected: {
    src: '/img/circlered.jpg',
    select: true
  },
  unselected: {
    src: '/img/circlegrey.jpg',
    select: false
  }
}
Component({
  behaviors: [computedBehavior],
  properties: {},
  data: {
    delivery_methods: [{
      name: '自提',
      orderType: 2,
      status: status.selected,
    }, {
      name: '送货上门',
      orderType: 1,
      status: status.unselected,
    }],
    multiIndex: [0, 0],
    address: {
      storeName: '',
      storeAddress: '',
      addressDetail: '',
      contactCellPhone: '',
      contactName: ''
    },
    address2: {
      addressDetail: '',
      contactCellPhone: '',
      contactName: '请填写联系人信息',
    },
    address3: {
      addressDetail: '',
      contactCellPhone: '',
      contactName: '请填写联系人信息',
    },
    store: {
      cellPhone: "***********",
      openDate: "08:00:00",
      closeDate: "17:30:00"
    },
    itemsHj: [],
    itemsXs: [],
    itemsHd: [],
    itemsAty: [],
    items: [],
    deliveryFee: {
      userTransferAmount: 0
    },
    deliveryFee2: {
      userTransferShoppingAmount: 0
    },
    housingCoinRate: 0,
    isIpX: false
  },
  computed: {
    total_price() {
      return parseFloat((this.data.itemsHj.reduce((total, currentValue) => total + currentValue.priceCurrentPrice * currentValue.productNum, 0)).toFixed(2))
    },
    total_price2() {
      return parseFloat((this.data.itemsXs.reduce((total, currentValue) => total + currentValue.priceCurrentPrice * currentValue.productNum, 0)).toFixed(2))
    },
    total_price_with_shipping() {
      let f01 = 0
      let f02 = 0
      let f03 = 0
      if (this.data.itemsHj.length > 0) {
        f01 = this.data.deliveryFee.userTransferAmount
      }
      if (this.data.itemsXs.length > 0) {
        f02 = this.data.deliveryFee2.userTransferShoppingAmount
      }
      if (this.data.itemsAty.length > 0) {
        f03 = this.data.itemsAty.reduce((free, li) => free + li.userTransferAmount, 0)
      }
      let del01 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f01
      let del02 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f02
      let del03 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f03
      return parseFloat((this.data.items.reduce((total, currentValue) => total + currentValue.priceCurrentPrice * currentValue.productNum.toFixed(2), 0) +
        (del01) + (del02) + (del03)).toFixed(2))
    },
    shipping() {
      if (this.data.delivery_methods.find(item => item.status.select).name == '自提') return '(自提)'
      if (this.data.deliveryFee.userTransferAmount <= 0 && this.data.deliveryFee2.userTransferShoppingAmount <= 0 && this.data.deliveryFee3 <= 0) return '(已包邮)'
      else {
        let f01 = 0
        let f02 = 0
        let f03 = 0
        if (this.data.itemsHj.length > 0) {
          f01 = this.data.deliveryFee.userTransferAmount
        }
        if (this.data.itemsXs.length > 0) {
          f02 = this.data.deliveryFee2.userTransferShoppingAmount
        }
        if (this.data.itemsAty.length > 0) {
          f03 = this.data.itemsAty.reduce((free, li) => free + li.userTransferAmount, 0)
        }
        return `(邮费￥${f01 + f02 + f03})`
      }
    },
    property_currency() {
      return this.data.housingCoinRate
    },
    current_method_name() {
      return this.data.delivery_methods.find(item => item.status.select).name
    },
    products_number() {
      let temp = this.data.itemsHj.reduce((accumulator, currentValue) => accumulator + currentValue.productNum, 0)
      return temp
    },
    products_number2() {
      let temp = this.data.itemsXs.reduce((accumulator, currentValue) => accumulator + currentValue.productNum, 0)
      return temp
    },
    selector() {
      let multiArray = []
      let now = new Date()
      let tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24)

      let list = get_list(this.data.store.openDate, this.data.store.closeDate, 1000 * 60 * 30)
      //加入当天没有数据
      let today_list = list.filter(item => item.value >= now)

      multiArray[0] =
        (today_list.length > 0 ? [{
          key: format(now, '今天MM月dd日'),
          pre: '今天',
          value: format(now, 'yyyy-MM-dd')
        }] : []).concat([{
          key: format(tomorrow, '明天MM月dd日'),
          pre: '明天',
          value: format(tomorrow, 'yyyy-MM-dd')
        }])

      multiArray[1] =
        today_list.length > 0 ?
          (this.data.multiIndex[0] == 0 ? today_list : list) :
          list

      return {
        multiIndex: this.data.multiIndex,
        multiArray
      }

      function format(date, format_string) {
        let temp = format_string;
        temp = temp.replace('yyyy', date.getFullYear())
        temp = temp.replace('MM', date.getMonth() + 1).toString().padStart(2, '0')
        temp = temp.replace('dd', date.getDate().toString().padStart(2, '0'))
        temp = temp.replace('HH', date.getHours().toString().padStart(2, '0'))
        temp = temp.replace('mm', date.getMinutes().toString().padStart(2, '0'))
        return temp
      }

      function get_list(openDate, closeDate, span) {
        openDate = openDate.replace(/\-/g, '/')
        closeDate = closeDate.replace(/\-/g, '/')
        let start = get_start(openDate, span)
        let end = get_end(closeDate, span)

        let list = []
        let element = start;
        do {
          let start_item = new Date(element)
          let end_item = new Date(start_item.getTime() + span)
          list.push({
            key: format(start_item, 'HH:mm') + '-' + format(end_item, 'HH:mm'),
            value: start_item,
            start_value: format(start_item, 'HH:mm'),
            end_value: format(end_item, 'HH:mm'),
          })
          element += span
        } while (element <= end)

        return list;
      }

      function get_start(openDate, span) {
        let date = new Date();
        let temp = format(date, 'yyyy-MM-dd') // '2019-06-21'
        temp = temp.replace(/\-/g, '/')
        let timespan = new Date(temp + ' ' + openDate).getTime() - new Date(temp).getTime() // '2019-06-21' - '2019-06-21 19:00'
        return new Date(temp).getTime() + Math.ceil(timespan / span) * span
      }

      function get_end(closeDate, span) {
        let date = new Date();
        let temp = format(date, 'yyyy-MM-dd') // '2019-06-21'
        temp = temp.replace(/\-/g, '/')
        let timespan = new Date(temp + ' ' + closeDate).getTime() - new Date(temp).getTime() // '2019-06-21' - '2019-06-21 19:00'
        return new Date(temp).getTime() + Math.floor(timespan / span) * span - span
      }
    },
  },
  ready: function () {
    let that = this;
    let selt = app.globalData.selecteds
    let openId = common.getWxOpenId()
    if (!openId) {
      console.log("openId:", openId)
      that.getOpenIdFromServer()
    }
    console.log("1:送货上门,0:自提物业", selt)
    console.log("current_method_name", that.current_method_name)
    if (selt == 1) {
      getApp().globalData.selecteds = 0
      let delivery_methods = this.data.delivery_methods.map(
        item => Object.assign(item, {
          status: status[item.orderType == 1 ? 'selected' : 'unselected']
        })
      )
      this.setData({
        delivery_methods: delivery_methods
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X') {
          that.setData({
            isIpx: true
          })
        }
      }
    })
    const url = api.order.getSettlementOrder;
    let data = {
      customerCode: common.getUser().userCode, //'HFMAB34GIVYSA', //
      storeId: common.getUser().storeId //973//
      //sign: "30834A5DF7B1E5A923B6F396EFF64E82"
    };
    console.log("data:", data)
    common.request.get(url, common.miscellaneous.signedParams(data), //data, //
      data => {
        const message = data.message
        console.log('message', message)
        let items = message.items
        let activityLists = message.activityItems
        let itemsHj = [],
          itemsXs = [],
          itemsHd = [],
          itemsAty = activityLists;
        let pros={}
        for (var s = 0; s < activityLists.length;s++){
          pros.activityCode = activityLists[s].list[0].activityCode.toString()
          pros.companyTransferAmount = activityLists[s].companyTransferAmount
          pros.userTransferAmount = activityLists[s].userTransferAmount
          itemsHd.push(pros)
        }
        console.log('itemsAty****:', itemsAty)
        for (let i = 0; i < items.length; i++) {
          if (items[i].orderSourceType == 1) { //1是货架订单 2是商城订单3 限时抢购
            itemsHj.push(items[i])
          }
          if (items[i].orderSourceType == 2) {
            itemsXs.push(items[i])
          }
        }

        let fee01 = message.deliveryFee
        let fee02 = message.shoppingDeliveryFee
        
        that.setData({
          address: {
            storeName: message.address.storeName,
            storeAddress: message.address.storeAddress,
            contactName: message.address.contactName,
            contactCellPhone: message.address.contactCellPhone,
            addressDetail: message.address.addressDetail,
          },
          itemsHj,
          itemsXs,
          itemsHd,
          itemsAty,
          items,
          deliveryFee: fee01,
          deliveryFee2: fee02,
          housingCoinRate: message.housingCoinRate,
          store: message.store
        })
      },
      function (err) {
        console.log('err:', err)
      })
    var url2 = api.housing.getAddressList + '?userCode=' + common.getUser().userCode
    console.log('User:', common.getUser().userCode)
    common.request.get(url2, {},
      function (data) {
        if (data.status == "OK") {
          console.log(that.data.activityFe)
          var list = data.message
          for (var i = 0; i < list.length; i++) {
            if (list[i].isDefault == 1) {
              console.log("contactName:", list[i].contactName)
              that.setData({
                address2: {
                  addressDetail: list[i].addressDetail,
                  contactCellPhone: list[i].contactCellPhone,
                  contactName: list[i].contactName,
                }
              })
            } else {
              that.setData({
                address2: {
                  addressDetail: list[0].addressDetail,
                  contactCellPhone: list[0].contactCellPhone,
                  contactName: list[0].contactName,
                }
              })
            }
          }
        }
      })
  },
  methods: {
    getOpenIdFromServer() {
      wx.login({
        success(res) {
          if (res.code) {
            let url = api.user.getOpenId
            let params = {
              jsCode: res.code
            }
            let MD5signStr = common.md5sign(params);
            let reqParams = Object.assign(params, {
              sign: MD5signStr
            })

            common.request.post(url, reqParams, function (res) {
              if (res.status == "OK") {
                common.setStorage('openid', res.message.wxOpenId)

                let openid = common.getWxOpenId()
                // console.log('openid----911', openid)
              }
            })
          }
        }
      })
    },
    swith: function (event) {
      const name = event.currentTarget.dataset.name
      let delivery_methods = this.data.delivery_methods.map(
        item => Object.assign(item, {
          status: status[item.name == name ? 'selected' : 'unselected']
        })
      )
      this.setData({
        delivery_methods: delivery_methods
      })

    },
    phone: function (event) {
      let phone = event.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    get_help: function () {
      wx.navigateTo({
        url: '/pages/help/help',
      })
    },
    submit: function () {
      // console.log(111)

      function getStrforParamValue(data) {
        let obj = '[';
        for (let item in data) {
          let str = '';
          obj += '{';
          for (let o in data[item]) {
            if (str == '') {
              str = o + '=' + data[item][o];
            } else {
              str += ',' + o + '=' + data[item][o];
            }
          }
          obj += str + "},";
        }
        obj = obj.substring(0, obj.length - 1);
        obj += ']';
        return obj;
      }

      function getStrforParamValue2(data) {
        let str = '';
        str += '{'
        for (var prop in data) {
          str += `${prop}=`
          if (typeof (data[prop]) == 'object') {
            str += getStrforParamValue2(data[prop]);
          } else str += data[prop] + ','
        }
        if (str[str.length - 1] == ",")
          str = str.substr(0, str.length - 1);
        str += '}'
        return str;
      }
      function getStrforParamValue3(data) {
        let str = '';
        str += '{'
        for (var prop in data) {
          str += `"${prop}":`
          if (typeof (data[prop]) == 'object') {
            str += getStrforParamValue3(data[prop]);
          } else str += data[prop] + ','
        }
        if (str[str.length - 1] == ",")
          str = str.substr(0, str.length - 1);
        str += '}'
        return str;
      }
      let that = this;
      let user = common.getUser()
      let url = api.order.submitOrder;
      console.log('this.data', that.data)

      let items = this.data.items.map(
        item => {
          if (item.activityCode) {
            return {
              'activityCode': item.activityCode,
              "amount": item.productNum,
              "price": item.priceCurrentPrice,
              "productId": item.productId,
              "sourceType": item.orderSourceType,
            }
          } else {
            return {
              "amount": item.productNum,
              "price": item.priceCurrentPrice,
              "productId": item.productId,
              "sourceType": item.orderSourceType,
            }
          }
        })
      let {
        mIndex,
        mArray
      } = {
        mIndex: this.data.selector.multiIndex,
        mArray: this.data.selector.multiArray
      }
      let item = mArray[1][mIndex[1]]
      let date = mArray[0][mIndex[0]].value
      let start = item.start_value
      let end = item.end_value
      let openId = common.getWxOpenId()
      let orderType = this.data.delivery_methods.find(item => item.status.select == true).orderType
      if (orderType == 1 && (!this.data.address2.contactName || !this.data.address2.contactCellPhone)) {
        wx.showToast({
          title: '请填写联系人信息',
          icon: 'none'
        });
        return false
      }
      let f01 = 0
      let f02 = 0
      let f03 = 0
      console.log(this.data)
      if (this.data.itemsHj.length > 0) {
        f01 = this.data.deliveryFee.userTransferAmount
        console.log(this.data)
      }
      if (this.data.itemsXs.length > 0) {
        f02 = this.data.deliveryFee2.userTransferShoppingAmount
      }
      if (this.data.itemsAty.length > 0) {
        f03 = this.data.itemsAty.reduce((free, li) => free + li.userTransferAmount, 0)
      }
      let del01 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f01
      let del02 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f02
      let del03 = this.data.delivery_methods.find(item => item.status.select).name == '自提' ? 0 : f03
      let totalAmount = parseFloat((this.data.items.reduce((total, currentValue) => total + currentValue.priceCurrentPrice * currentValue.productNum, 0) +
        (del01) + (del02) + (del03)).toFixed(2))
      console.log("del01:", del01, "del02:", del01, "totalAmount:", totalAmount.toFixed(2), "del03:", del03)
      let sourceType = this.data.items.sourceType
      let data = {}
      console.log(this.data)
      let to = totalAmount.toFixed(2)
      console.log('itemsHd', that.data.itemsHd)
      if (orderType == 1) {
        data = {
          "shopId": user.storeId,
          "userCode": user.userCode,
          "productItems": getStrforParamValue(items),
          "activityDeliveryAmount": getStrforParamValue(that.data.itemsHd),
          "userTransferAmount": this.data.deliveryFee.userTransferAmount.toString(),
          "companyTransferAmount": this.data.deliveryFee.companyTransferAmount,
          "userTransferShoppingAmount": this.data.deliveryFee2.userTransferShoppingAmount.toString(),
          "companyTransferShoppingAmount": this.data.deliveryFee2.companyTransferShoppingAmount,
          "totalAmount": to.toString(),
          "remark": "物业用户下单",
          "payMethod": 7,
          "openId": openId,
          "orderType": orderType,
          "contactName": this.data.address2.contactName,
          "contactCellPhone": this.data.address2.contactCellPhone,
          "addressDetail": this.data.address2.addressDetail
        };
        Object.assign(data, {
          "arriveBeginDate": date + ' ' + start,
          "arriveEndDate": date + ' ' + end
        })
      }
      if (orderType == 2) {
        data = {
          "shopId": user.storeId,
          "arriveBeginDate": "2019-05-25 13:00",
          "arriveEndDate": "2019-05-25 13:30",
          "userCode": user.userCode,
          "productItems": getStrforParamValue(items),
          "activityDeliveryAmount": getStrforParamValue(that.data.itemsHd),
          "userTransferAmount": this.data.deliveryFee.userTransferAmount.toString(),
          "companyTransferAmount": this.data.deliveryFee.companyTransferAmount,
          "userTransferShoppingAmount": this.data.deliveryFee2.userTransferShoppingAmount.toString(),
          "companyTransferShoppingAmount": this.data.deliveryFee2.companyTransferShoppingAmount,
          "totalAmount": to.toString(),
          "remark": "物业用户下单",
          "payMethod": 7,
          "openId": openId,
          "orderType": orderType,
          "contactCellPhone": this.data.address.contactCellPhone,
          "contactName": this.data.address.contactName,
          "addressDetail": this.data.address.addressDetail
        };
      };
      common.request.post(url, Object.assign(common.miscellaneous.signedParams(data),{
        productItems: items,
        activityDeliveryAmount: that.data.itemsHd
      }),
        data => {
          if (data.message.allinPay.status == 'ERROR') {
            wx.showToast({
              title: data.message.allinPay.message.message,
              icon: 'none'
            })
            return;
          }
          common.setTabBar(that);
          let message = JSON.parse(data.message.allinPay.message)
          let payment = JSON.parse(message.payInfo)
          let orderId = data.message.sopHousingOrderList[0].orderItems[0].orderId
          let delivery_info = orderType == 1 ? (mArray[0][mIndex[0]].pre + start + '-' + end) : '';
          let obtain_property_currency = that.data.property_currency
          that.call_pay(payment, orderId, delivery_info, obtain_property_currency)
        })
    },
    call_pay: function (payment, orderId, delivery_info, obtain_property_currency) {
      wx.requestPayment(
        Object.assign(payment, {
          success(res) {
            wx.redirectTo({
              //url: `/pages/ReturnRequest/rerurnSuccess/rerurnSuccess?delivery_info=${delivery_info}&obtain_property_currency=${obtain_property_currency}`
              url: `/pages/ReturnRequest/rerurnSuccess/rerurnSuccess?orderId=${orderId}`
            })
          },
          fail(res) {
            wx.redirectTo({
              url: `/pages/ReturnRequest/returnfail/returnfail?orderId=${orderId}`
            })
          }
        }))
    },
    products_list: function (event) {
      let list = JSON.stringify(event.currentTarget.dataset.list);
      console.log('list001', event)
      wx.navigateTo({
        url: `/pages/CommodityList/CommodityList?list=${decodeURIComponent(list)}`,
      })
    },
    bindMultiPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
    },
    bindMultiPickerColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      this.data.multiIndex[e.detail.column] = e.detail.value;
      if (!e.detail.column) this.data.multiIndex[1] = 0;
      console.log(this.data.multiIndex);
      this.setData(this.data);
    },
    select_address: function () {
      let _this = this
      console.log("contactName:", _this.data.address2.contactName)
      common.setStorage('fillOrder', 1)
      if (_this.data.address2.contactName) {
        wx.navigateTo({
          url: `/pages/addressList/addressList`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/editorAddress/editorAddress`,
        })
      }

    },
    set_address: function (address) {
      let {
        contactName,
        contactCellPhone
      } = address
      this.setData({
        address: Object.assign(this.data.address, {
          contactName,
          contactCellPhone
        })
      })
    }
  }
})
