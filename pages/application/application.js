// pages/application /application.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();
Page({
  data: {
    hidden:false,
    cancelShow:false,
    IsHidden:false,
    showFlag:true,
    pics:[],
    pics2:[],
    textarea:'',
    orderId: '',
    productId:'',
    cancelReason: '',
    cancelTxts: '',
    cancelList: [],
  },
  onLoad: function (options) {
    this.getCancelList()
    this.setData({
      orderId: options.orderId,
      productId: options.productId||''
    })
  },
  onShow: function () {

  },
  textarea:function(e){
    this.setData({
      textarea: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '物业拼拼',
      path: 'pages/application/application'
    }
  },
  //取消退货原因模态框
  cancel() {
    this.setData({
      cancelShow: false,
    })
  },
//取消原因弹层
  cancelShows(e) {
    let _this = this
    _this.setData({
      cancelShow: true
    })
  },
  //确认退货原因
  cancelConfirm() {
    let _this = this
    let user = Common.getUser()
    this.setData({
      cancelShow: false,
      hidden:true
    })
    
  },
  //获取退货原因列表
  getCancelList() {
    
    let _this = this
    Common.request.get(Api.order.getReasonsForReturn + '?type=2', {}, function (data) {
      if (data.status == 'OK') {
        let list = data.message
        _this.setData({
          cancelList: list
        })
      }
    })
  },
  radioChange(e) {
    console.log(e)
    this.setData({
      cancelReason: e.detail.value,
    })
    if (this.data.cancelReason.indexOf('其他') == 0) {
      console.log("indexOf:", this.data.cancelReason.indexOf('其他'))
      this.setData({
        IsHidden: true
      })
    }else{
      this.setData({
        IsHidden: false
      })
    }
  },
  errImg: function (e) {
    let _this = this
    // Common.errImgFun(e, _this)
  },
  // 提交
  submit: function (e) {
    let that = this;
    let user = Common.getUser()
    let userCode = user.userCode
    let imageUrl = []
    // 获取描述内容
    let content = that.data.textarea
    // if (content == '') {
    //   wx.showToast({title: "请填写退货原因!",icon: 'none'})
    //   return;
    // }
    if (that.data.cancelReason==''){
      wx.showToast({ title: "请选择退货原因!", icon: 'none' })
      return;
    }
    if (that.data.pics.length > 0) {
      imageUrl = JSON.stringify(that.data.pics2)
    } else {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    let parms={}
    let productId = that.data.productId
    if (productId == undefined || productId == null || productId == '' || productId == 'undefined' || productId == 'null' ){
      console.log("productId-Null:", that.data.productId)
      parms = {
        orderId: that.data.orderId,
        userCode, //'HFMAB34GIVYSA',
        refundReason: that.data.cancelReason,
        imgUrl: JSON.stringify(that.data.pics2)
      }
    }else{
      console.log("productId-Have:", that.data.productId)
      parms = {
        orderId: that.data.orderId,
        productId: that.data.productId,
        userCode, //'HFMAB34GIVYSA',
        refundReason: that.data.cancelReason,
        imgUrl: JSON.stringify(that.data.pics2)
      }
    }
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.order.returndOrderSubmit, parms, function (data) {
      if (data.status == 'OK') {
        wx.showToast({
          title: "退货申请提交成功",
          icon: 'none'
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/order/order',
          })
        },2000)
      }else{
        wx.showToast({
          title:'请填写退货原因',
          icon: 'none'
        })
      }
    })
  },
  listenerButtonPreviewImage: function (e) {
    console.log(e)
    let index = e.target.dataset.index;//预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.pics[index],//预览图片链接
      urls: that.data.pics,//图片预览list列表
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },
  delete_this: function (e) {
    var pics = this.data.pics;
    var pics2 = this.data.pics2;
    var src = e.currentTarget.dataset.src;
    for (var i = 0; i < pics.length; i++) {
      if (pics[i] == src) {
        pics.splice(i, 1);
        pics2.splice(i, 1);
      }
    }
    this.setData({
      pics: pics,
      pics2: pics2
    })
  },
  uploadImg(e){
    var _this =this
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        let picsImg = res.tempFilePaths;
        let pics = _this.data.pics
        let picAll = picsImg.length + pics.length
        var count = 0;
        for (var i = 0, h = picsImg.length; i < h; i++) {
          console.log(picAll)
          if (picAll <= 6) {
            console.log(picsImg)
            pics.push(picsImg[i])
            console.log(pics)
            _this.setData({
              pics: pics
            })
          } else {
            wx.showToast({
              title: "最多可提交6张图片",
              icon: 'none'
            })
          }
          var MD5signStr = Common.md5sign({
            base64Imgs: picsImg.toString()
          })
          Common.request.post(Api.order.uploadImg, {
            base64Imgs: picsImg.toString(),
            sign: MD5signStr
          }, function (data) {
            if (data.status == 'OK') {
              if (count <= 6) {
                count++;
                console.log('count++', count)
                let imgs = data.message
                _this.data.pics2.push(imgs)
                console.log(_this.data.pics2)
              } else {
                wx.showToast({
                  title: "最多可提交6张图片",
                  icon: 'none'
                })
                return
              }
              
            } else {
              wx.showToast({
                title: '请填写退货原因及上传退货商品图片',
                icon: 'none'
              })
            }
          })
        }
        
      }
    })
    
  }
})