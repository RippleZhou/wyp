// pages/order/exchangeBox.js
const app = getApp();
const Common = require('../../utils/common')
var Api = require("../../utils/api")
Page({
  /**
   * 页面的初始数据
   */
 data:{
    lnums:1,
    isNums:0,
    lImgs:'../../img/noPros.png',
    lImgs2:'../../img/noCheck.png',
   carts:[
        { id: 7, name: 'eba1', checked: false, eImg: '../../img/wxBg_img.jpg', eTit: 'Apple/苹果 Apple Watch Series 1 银色铝金属表壳搭配白色运动型表带智能手表', eColor: '银色铝金属表壳', eSize: '38mm', price: 20, eIndex: 7, num: 0, delIndex: 8, isPutaway: 0, propertycurrency: 120}
    ],
    count:0,
    cnumber:0,
   propertycurrency:0,
    ebtId:0,
   selectedAllStatus: false,
    X_Start: 0,
		X_End: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllpro();
  },
  // 获取服务器的购物车
  getAllpro() {
    var self = this;
    Common.request.get(Api.shoppingCart.queryCart, { userId: 39 },
      function (data) {
        if (data.status == "OK") {
          let exboxList = [];
          let proList = data.message.sellingItems || [];
          var checkAllFlag = true
          for (let i = 0; i < proList.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            if (proList[i].isSelected == 1) {
              //判断是否选中
              pro.checked = true;
            } else {
              checkAllFlag = false
              pro.checked = false;
            }
            pro.imgUrl = proList[i].sku.imageUrl; //图片路径
            pro.proTit = proList[i].sku.productName; //"产品名称";
            pro.proId = proList[i].sku.productId; //产品编号
            pro.sourceType = proList[i].sku.sourceType
            console.log(
              "第" +
              (i + 1) +
              "有效个产品：" +
              pro.proId +
              "选中状态：" +
              pro.checkpro
            );
            //pro.proSpec = "1.5kg";//"1.5kg"后台说不显示
            pro.proTips = proList[i].limitAmount + "件起购"; //"2件起购";
            pro.limitAmount = proList[i].limitAmount;
            pro.proPrice = proList[i].sku.price;
            pro.isValid = true; //这里都为有效产品
            pro.proNums = proList[i].amount;
            exboxList.push(pro);
          }
          if (exboxList.length > 0) {
            self.setData({
              checkAll: checkAllFlag
            })
          }
          //无效产品列表
          let invalidList = data.message.haltSellItems || [];
          // let invalidList = data.message.sellingItems || [];
          for (let i = 0; i < invalidList.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            pro.imgUrl = invalidList[i].sku.imageUrl; //图片路径
            pro.proTit = invalidList[i].sku.productName; //"产品名称";
            pro.proId = invalidList[i].sku.productId; //产品编号
            pro.sourceType = invalidList[i].sku.sourceType
            pro.proTips = invalidList[i].limitAmount + "件起购888"; //"2件起购";
            pro.limitAmount = invalidList[i].limitAmount;
            pro.proPrice = invalidList[i].sku.price;
            pro.isValid = false; //这里都为无效产品
            pro.proNums = invalidList[i].amount;
            pro.isPutaway = 0;
            self.ValidproductIds += invalidList[i].sku.productId + ','; //失效产品id
            exboxList.push(pro);
          }
          console.log('activityCartItems', exboxList)

          try {
            const activityCartItems = JSON.parse(wx.getStorageSync('activityCartItems'))
            if (activityCartItems) {
              let _activityCartItems_ = activityCartItems.map(item => {
                item.imgUrl = item.imageUrl
                item.proId = item.productId
                item.proPrice = item.cashPrice
                item.proNums = 1
                item.proTit = item.productName
                item.isValid = true
                return item
              })

              let exboxList2 = [...exboxList, ..._activityCartItems_]

              self.setData({
                carts: exboxList2,
                isNums: invalidList.length
              })
              self.computeMoney(exboxList2)
            }
          } catch (e) {
            console.log(e)
          }
        }
      })
  },
  del: function () {
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        carts.splice(i,1);
      } 
    }
    this.setData({
      carts: carts,
      propertycurrency:0,
      count:0
    });
  },
  scan: function() {
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果");
        console.log(res);
        this.setData({
          img: res.result
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /** 
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  bindSelect: function (e) {
    var eIndex = e.currentTarget.id.replace("info", "")
    this.data.carts[eIndex].checked = !this.data.carts[eIndex].checked;
    var value = this.data.carts
    if (this.data.carts[eIndex].checked)
    { 
      var count = this.data.count + (this.data.carts[eIndex].price * this.data.carts[eIndex].num);
      var propertycurrency = this.data.count + (this.data.carts[eIndex].propertycurrency * this.data.carts[eIndex].num);
      this.setData({
        count: count,
        propertycurrency: propertycurrency
      }) 
    }else
    {
      var count = this.data.count - (this.data.carts[eIndex].price * this.data.carts[eIndex].num)
      var propertycurrency = this.data.count - (this.data.carts[eIndex].propertycurrency * this.data.carts[eIndex].num); 
      this.setData({
        count: (count >= 0 ? count:0),
        propertycurrency: (propertycurrency >= 0 ? propertycurrency:0)
      }) 
    }
    this.setData({
      carts: value
    })

  },
  bindSelectAll: function () {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var carts = this.data.carts;
    var count = 0;
    var propertycurrency = 0;
      for (var i = 0; i < carts.length; i++) {
        carts[i].checked = selectedAllStatus;
        var num = parseInt(this.data.carts[i].num);
        var price = parseInt(this.data.carts[i].price);
        var currency = parseInt(this.data.carts[i].propertycurrency);
        if (carts[i].checked)
        {
          count += num * price;
          propertycurrency += num * currency;
        }else
        {
          count = 0;
          propertycurrency = 0;
        }
      }
      this.setData({
        selectedAllStatus: selectedAllStatus,
        carts: carts,
        count: count,
        propertycurrency: propertycurrency
      });
    
  },
  add: function (e) {//兑换箱内商品数量加
    var eIndex = e.currentTarget.id.replace("info", "")
    this.data.carts[eIndex].num += 1
    var value = this.data.carts
    this.setData({
      carts: value
    })
    if (this.data.carts[eIndex].checked)
    {
      var count = this.data.count;
      count += this.data.carts[eIndex].price;
      var currency = this.data.propertycurrency;
      currency += this.data.carts[eIndex].propertycurrency;
      this.setData({
        count: count,
        propertycurrency: currency
      })
    }
  },
  sub:function (e) {//兑换箱内商品数量加
    var eIndex = e.currentTarget.id.replace("info", "")
    var eNums = this.data.carts[eIndex].num;
    var value = this.data.carts
    if (eNums <= 0) {
      this.setData({
        carts: value
      })
    }
    else {
      this.data.carts[eIndex].num -= 1
      this.setData({
        carts: value
      })
      if (this.data.carts[eIndex].checked) {
        var count = this.data.count;
        count = count -  this.data.carts[eIndex].price;
        var currency = this.data.propertycurrency;
        currency -= this.data.carts[eIndex].propertycurrency;
        this.setData({
          count: count,
          propertycurrency: currency
        })
      }
    }
  

  },
  delcart: function (e) {//订单列表-删除块 
    var t = this;
    wx.showModal({
      title: "提示",
      content: "确认要删除这个订单吗？",
      success: function (n) {

      }
    })
  },
  removestart: function (e) {
    this.setData({
      X_Start: e.changedTouches[0].clientX
    })
  },
  removeload: function (e) {
    this.setData({
      X_End: e.changedTouches[0].clientX
    })
  },
  removeend: function (e) {
    this.setData({
      X_End: e.changedTouches[0].clientX
    }), this.direction(e.currentTarget.dataset.id)
  },
  direction: function (e) {
    var t = {
      xstart: this.data.X_Start,
      xend: this.data.X_End
    };
    t.xstart > t.xend ? t.xstart - t.xend > 136 && this.setData({
      ebtId: e
    }) : this.setData({
      ebtId: 0
    })
  },//End 订单列表-删除块
  confirmOrder: function () {//跳转立即兑换
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})