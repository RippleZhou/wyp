// pages/addressList/addressList.js
let app = getApp();
const Common = require('../../utils/common')
var Api = require("../../utils/api")
var Utils = require("../../utils/util.js")
Page({
  data: {
    delBtnWidth: 180,
    list: [],
    startX: ""
  },
  onLoad: function (options) {
    this.initEleWidth();
  },

  onShow: function () {
    this.getList()
  },
  goAddads(){
    wx.navigateTo({
      url: '/pages/editorAddress/editorAddress',
    })
  },
  getList(){
    let _this=this
    var user = Common.getUser();
    var url = Api.housing.getAddressList + '?userCode=' + user.userCode
    console.log('User:', user)
    Common.request.get(url, {},
      function (data) {
        if (data.status == "OK") {
          var list = data.message
          for (var i = 0; i < list.length;i++){
            list[i].txtStyle=''
          }
          console.log("list:",list)
          _this.setData({
            list
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    let _this =this
    var id = e.currentTarget.dataset.ids;
    var user = Common.getUser();
    console.log('User:', user)
    var url = Api.housing.deleteAddress
    let parm = { userCode: user.userCode,id:id}
    let MD5sign = Common.md5sign(parm);
    parm.sign = MD5sign;
    
    Common.request.post(url, parm,
      function (data) {
        if (data.status == "OK") {
          // wx.showToast({
          //   title: data.message,
          //   icon: 'none'
          // })
          _this.getList()
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
  },
  //点击修改地址
  goEditads:function(e){
    var id = e.currentTarget.dataset.ids;
    var isdef = e.currentTarget.dataset.isdef
    wx.navigateTo({
      url: `/pages/editorAddress/editorAddress?addressId=${id}&isDefault=${isdef}`,
    })
  },
  // goOrder(){
  //   let fills = Common.getStorage("fillOrder")
  //   if (fills==1){
  //     Common.removeStorage("fillOrder")
  //     wx.navigateTo({
  //       url: `/pages/fillOrder/fillOrder`,
  //     })
  //   }
  // }
})