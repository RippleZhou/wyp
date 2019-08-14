// pages/editorAddress/editorAddress.js
const common = require('../../utils/common')
const api = require('../../utils/api.js')

Component({
  properties: {
    storeAddress: String,
    addressDetail: String,
    addressId:Number,
    isDefault:Number
  },
  data: {
    address: {
      contactName: '',
      contactCellPhone: '',
      address: '',
      addressDetail: '',
    },
    checkeds:false,
    isDefault: 0
  },
  created: function() {
    // let that = this
      // let url = api.address.getAddressList
      // common.request.get(url, {
      //   userCode: common.getUser().userCode
      // },
      //   data => {
      //     let list = data.message

      //     that.setData({
      //       address: list.length <= 0 ? Object.assign(that.data.address, {
      //         address: that.properties.storeAddress,
      //         addressDetail: that.properties.addressDetail
      //       }) :
      //         list[0]
      //     })
      //   })
    
    
  },
  ready(){
    let that = this
    let isD = that.properties.isDefault || 0
    if (isD==1){
      that.setData({
        isDefault: isD,
        checkeds:true
      })
    }else{
      that.setData({
        isDefault: isD,
        checkeds: false
      })
    }
    console.log("id:", this.properties.addressId, "isDefault:", this.properties.isDefault)
    if (that.properties.addressId){
      let url = api.address.getAddressList
      common.request.get(url, {
        userCode: common.getUser().userCode
      },
        data => {
          let rows = data.message
          let list=[]
          for (var i = 0; i < rows.length;i++){
            if (rows[i].id == that.properties.addressId){
              list.push(rows[i])
            }
          }
          that.setData({
            address: list.length <= 0 ? Object.assign(that.data.address, {
              address: that.properties.storeAddress,
              addressDetail: that.properties.addressDetail,
              isDefault: isD
            }) :list[0]
          })
        })
    }else{
      that.housingInfo()
    }
  },
  
  methods: {
    isCheck(e) {//是否为默认
      if (e.detail.value == '') {
        this.setData({
          isDefault: 0,
          checkeds: false
        })
      } else {
        this.setData({
          isDefault: 1,
          checkeds: true
        })
      }
    },
    housingInfo() {
      let params = {};
      let _this = this;
      let user = common.getUser();
      
      params.userCode = user.userCode
      let MD5sign = common.md5sign(params);
      params.sign = MD5sign;
      common.request.post(api.housing.myHousing, params,
        function (data) {
          if (data.status == "OK") {
            console.log("myHousing:",data);
            _this.setData({
              address: {
                address: data.message.storeAddress,
                addressDetail: data.message.address,
              }
            });
          } else {
            console.log(data.message);
          }
        })
    },
    sysnc_info: function(event) {
      console.count('sysnc_info')
      let obj = {}
      obj[event.target.dataset.propName] = event.detail.value
      this.setData({
        address: Object.assign(this.data.address, obj)
      })
    },
    save: function() {
      // if (this.data.address.contactName)
      if (!this.check(this.data.address)) return false;
      let fills = common.getStorage("fillOrder")
      let that = this;
      let url_edit = api.address.editAddress
      let url_add = api.address.addAddress
      
      console.log('isDefault', that.data.isDefault)
       
      let data = Object.assign(this.data.address, {
        "userCode": common.getUser().userCode,
        "isDefault": that.data.isDefault,
      })
      delete data.address
      common.request.post(data.id ? url_edit : url_add, common.miscellaneous.signedParams(data),
        data => {
          wx.showToast({
            title:'修改成功' ,
            icon: 'none',
            success: function() {
              let pages = getCurrentPages()
              console.log('fillOrder:', fills)
              if (fills == 1) {
                console.log('fillOrder02:', fills)
                common.removeStorage("fillOrder")
                getApp().globalData.selecteds = 1
                console.log('fillOrder03:', fills)
                wx.redirectTo({
                  url: "/pages/fillOrder/fillOrder"
                })
              }else{
                wx.navigateBack()
              }
            }
          })
        })
    },
    check: function(obj) {
      if (!obj.contactName){
        wx.showToast({
          title: '收货人不能为空',
          icon: 'none',
        })
        return false
      }
      if (!/^1[0-9]{10,10}$/.test(obj.contactCellPhone)) {
        wx.showToast({
          title: '手机号 不正确',
          icon: 'none',
        })
        return false
      }
      return true
    }
  }
})