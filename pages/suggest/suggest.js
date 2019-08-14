// pages/suggest/suggest.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    pics2: [],
    textarea: '',
    btn_msg: true,
    content:'',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShareAppMessage: function (res) {
    return {
      title: '意见反馈',
      path: 'pages/suggest/suggest'
    }
  },
  onLoad: function (options) {
    console.log(options)
    let customerName = options.customerName
    let storeName = options.storeName
    let storeId = options.storeId
    this.setData({
      customerName,
      storeName,
      storeId
    })
  },
  textarea: function (e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  submit: function () {
    console.log(this.data)
    let that = this;
   
    let customerName = that.data.customerName
    let storeName = that.data.storeName
    let storeId = that.data.storeId
    let user = Common.getUser()
    console.log('user==',user)
    let userCode=user.userCode
    console.log('userCode==', userCode)
    console.log(that.data.pics)
    let imageUrl= []
    // 获取描述内容
    console.log(that.data)
    let content = that.data.textarea;
    console.log(content)
    if (content == '') {
      wx.showToast({ title: "请填写您的意见!", icon: 'none' })
      return
    }
    if (that.data.pics.length>0){
      imageUrl = JSON.stringify(that.data.pics2)
    }else{
      wx.showToast({
        title: '请上传图片',
        icon:'none'
      })
      return
    }
  
    let parms = {
      customerName,
      storeName,
      storeId,
      userCode ,
      content: content,
      imageUrl
    }
    var MD5signStr = Common.md5sign(parms);
    parms.sign = MD5signStr
    Common.request.post(Api.housing.mySuggest, parms, function (data) {
      if (data.status == 'OK') {
        wx.showToast({
          title: "意见提交成功",
          icon: 'none'
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/owner/owner'
          })
        },
        2000)
      } else {
        wx.showToast({
          title: '请上传图片和您的意见',
          icon: 'none'
        })
      }
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
          if (picAll<=6){
            console.log(picsImg)
            pics.push(picsImg[i])
            console.log(pics)
            _this.setData({
              pics: pics
            })
          }else{
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
              if (count<=6){
                count++;
                console.log('count++', count)
                let imgs = data.message
                _this.data.pics2.push(imgs)
                console.log(_this.data.pics2)
              }else{
                wx.showToast({
                  title: "最多可提交6张图片",
                  icon: 'none'
                })
                return
              }

              
            } else {
              wx.showToast({
                title: '最多可提交6张图片',
                icon: 'none'
              })
            }
          })
        }
        
      }
    })
    
  },
  
  listenerButtonPreviewImage: function (e) {
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


})