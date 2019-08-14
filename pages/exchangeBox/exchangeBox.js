// pages/order/exchangeBox.js
let app = getApp();
const Common = require('../../utils/common')
var Api = require("../../utils/api")
var Utils = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
 data:{
    lnums:1,
    isNums:0,
    lImgs:'../../img/noPros.png',
    lImgs2:'../../img/noCheck.png',
   carts:[],
   carts1: [],//货架
   carts2: [],//商城
   allMoney:0,
   allNum:0,
   propertycurrency:0,
   ebtId:0,
   isShows: true,
   selectedAllStatus: false,
   checkAll:false,
   storeId:0,
   isFree1: 0,
   isFree2:0,
   orderAmount2:0,
   noMores: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_01.png',
   userinfo:{},
    X_Start: 0,
		X_End: 0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  choosedetail: function (e) {//货架
    const e_data = e.currentTarget.dataset;
    console.log(e_data);
    var prolistId = e_data.listdata.proId
    wx.navigateTo({
      url: '/pages/details/details?productId=' + prolistId + '&storeId=' + this.data.storeId,
    })
  },
  choosedetail2: function (e) {//线上
    const e_data = e.currentTarget.dataset;
    console.log(e_data);
    var prolistId = e_data.listdata.proId
    wx.navigateTo({
      url: `/pages/store-detail/store-detail?storeId=${this.data.storeId}&productId=${prolistId}`
    })
  },
  // 获取服务器的购物车
  getAllpro() {
    var self = this;
    let user = Common.getUser();
    let storeId = new Number(user.storeId).toString() || Common.getStorage("shareStoreId2").toString();
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0) {
      storeId = Common.storeId2()
      console.log(storeId, 'storeId2===')
    }
    storeId = storeId
    Common.request.get(Api.car.queryCart, { userCode: user.userCode, storeId: storeId},
      function (data) {
        console.log(data)
        if (data.status == "OK") {
          let exboxList = [];
          let list01 = [];//货架
          let list02 = [];//商城
          let orderAmount2 = data.message.orderAmount
          let proList = data.message.housingSellingItems || [];///货架在售
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
            pro.sourceType = proList[i].sku.sourceType;
            pro.housingCoin = proList[i].sku.housingCoin;
            //pro.proSpec = "1.5kg";//"1.5kg"后台说不显示
            pro.proTips = proList[i].limitAmount + "件起购"; //"2件起购";
            pro.limitAmount = proList[i].limitAmount;
            pro.proPrice = proList[i].sku.price;
            pro.isValid = true; //这里都为有效产品
            pro.proNums = proList[i].amount;
            pro.stock = proList[i].sku.stock;
            pro.isPutaway = proList[i].sku.isPutaway;
            exboxList.push(pro);
            list01.push(pro)
          }
          //无效产品列表
          let invalidList = data.message.housingHaltSellItems || [];///货架下架停售
          // let invalidList = data.message.sellingItems || [];
          for (let i = 0; i < invalidList.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            if (invalidList[i].isSelected == 1) {
              //判断是否选中
              pro.checked = true;
            } else {
              checkAllFlag = false
              pro.checked = false;
            }
            pro.imgUrl = invalidList[i].sku.imageUrl; //图片路径
            pro.proTit = invalidList[i].sku.productName; //"产品名称";
            pro.proId = invalidList[i].sku.productId; //产品编号
            pro.sourceType = invalidList[i].sku.sourceType;
            pro.housingCoin = invalidList[i].sku.housingCoin;
            pro.proTips = invalidList[i].limitAmount + "件起购888"; //"2件起购";
            pro.limitAmount = invalidList[i].limitAmount;
            pro.proPrice = invalidList[i].sku.price;
            pro.isValid = true; //这里都为无效产品
            pro.proNums = invalidList[i].amount;
            pro.stock = invalidList[i].sku.stock;
            pro.isPutaway = invalidList[i].sku.isPutaway;
            exboxList.push(pro);
            list01.push(pro)
          }
          let proList2 = data.message.shoppingSellingItems || [];///商城在售 
          var checkAllFlag = true
          for (let i = 0; i < proList2.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            if (proList2[i].isSelected == 1) {
              //判断是否选中
              pro.checked = true;
            } else {
              checkAllFlag = false
              pro.checked = false;
            }
            pro.imgUrl = proList2[i].sku.imageUrl; //图片路径
            pro.proTit = proList2[i].sku.productName; //"产品名称";
            pro.proId = proList2[i].sku.productId; //产品编号
            pro.sourceType = proList2[i].sku.sourceType;
            pro.housingCoin = proList2[i].sku.housingCoin;
            //pro.proSpec = "1.5kg";//"1.5kg"后台说不显示
            pro.proTips = proList2[i].limitAmount + "件起购"; //"2件起购";
            pro.limitAmount = proList2[i].limitAmount;
            pro.proPrice = proList2[i].sku.price;
            pro.isValid = true; //这里都为有效产品
            pro.proNums = proList2[i].amount;
            pro.stock = proList2[i].sku.stock;
            pro.isPutaway = proList2[i].sku.isPutaway;
            pro.orderAmount = data.message.orderAmount||0;
            exboxList.push(pro);
            list02.push(pro)
          }
          
          let invalidList2 = data.message.shoppingHaltSellItems || [];///商城停售
          // let invalidList = data.message.sellingItems || [];
          for (let i = 0; i < invalidList2.length; i++) {
            let pro = {}; //定义产品对象，获取数据，追加到数组里
            if (invalidList2[i].isSelected == 1) {
              //判断是否选中
              pro.checked = true;
            } else {
              checkAllFlag = false
              pro.checked = false;
            }
            pro.imgUrl = invalidList2[i].sku.imageUrl; //图片路径
            pro.proTit = invalidList2[i].sku.productName; //"产品名称";
            pro.proId = invalidList2[i].sku.productId; //产品编号
            pro.sourceType = invalidList2[i].sku.sourceType;
            pro.housingCoin = invalidList2[i].sku.housingCoin;
            pro.proTips = invalidList2[i].limitAmount + "件起购888"; //"2件起购";
            pro.limitAmount = invalidList2[i].limitAmount;
            pro.proPrice = invalidList2[i].sku.price;
            pro.isValid = true; //这里都为无效产品
            pro.proNums = invalidList2[i].amount;
            pro.stock = invalidList2[i].sku.stock;
            pro.isPutaway = invalidList2[i].sku.isPutaway;;
            exboxList.push(pro);
            list02.push(pro)
          }
          if (exboxList.length > 0) {
            self.setData({
              selectedAllStatus: checkAllFlag
            })
          }
          console.log('activityCartItems', exboxList)
          let exboxList3 = exboxList

          self.setData({
            carts: exboxList,
            carts1: list01,
            carts2: list02,
            orderAmount2: orderAmount2
          })
          self.totals1(list01)
          self.totals2(list02)
          self.computeMoney(exboxList3)
        }
      })
  },
  goMall(){
    wx.switchTab({
      url: '/pages/store/store',
    })
  },
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  del: function () {
    let self = this;
    wx.showModal({
      title: "提示",
      content: "确认要删除所选产品吗？",
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      confirmText: "是",//默认是“确定”
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          let carts = self.data.carts;
          let carts1 = self.data.carts1;
          let carts2 = self.data.carts2;
          let params = {};
          let user = Common.getUser();
          params.userCode = user.userCode;
          params.productIds = "";
          carts.forEach(function (fruit) {
            if (fruit.checked == true) {
              params.productIds += ',' + fruit.proId;
            }
          }, this);
          for (let i = carts.length - 1; i >= 0; i--) {
            if (carts[i].checked == true) {
              carts.splice(i, 1);
            }
          }
          carts1.forEach(function (fruit) {
            if (fruit.checked == true) {
              params.productIds += ',' + fruit.proId;
            }
          }, this);
          for (let i = carts1.length - 1; i >= 0; i--) {
            if (carts1[i].checked == true) {
              carts1.splice(i, 1);
            }
          }

          carts2.forEach(function (fruit) {
            if (fruit.checked == true) {
              params.productIds += ',' + fruit.proId;
            }
          }, this);
          for (let i = carts2.length - 1; i >= 0; i--) {
            if (carts2[i].checked == true) {
              carts2.splice(i, 1);
            }
          }
          
          if (params.productIds.length > 0) {
            params.productIds = params.productIds.substring(1, params.productIds.length);
            let MD5sign = Common.md5sign(params);
            params.sign = MD5sign;
            Common.request.post(Api.car.removeCartItems, params,
              function (data) {
                if (data.status == "OK") {
                  console.log("更新产品是否选中OK");
                  console.log('切换时候：carts:', self.data.carts)
                  self.setData({
                    carts: carts,
                    carts1: carts1,
                    carts2: carts2
                  });
                  self.totals1(carts1)
                  self.totals2(carts2)
                  self.computeMoney(self.data.carts);
                } else {
                  console.log(data.message);
                }
              })
          }
        }
      }
    })
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
  GoPay:function(){
    let _this = this;
    let checarts = false;
    for (let i = 0; i < _this.data.carts.length; i++) {
      if (_this.data.carts[i].checked == true && _this.data.carts[i].stock > 0) {
        checarts = true;
      }
    }
    if (_this.data.carts.length > 0 && checarts)
    {
      wx.removeStorageSync('cartItemsNum');
      wx.navigateTo({
        url: '/pages/fillOrder/fillOrder',
      })
    }else
    {
      wx.showToast({
        title: '请选择要兑换的商品',
        icon: 'none'
      })
      return
    }
  }
  ,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Common.setStorage('Isb', 1)
    let user = Common.getStorage('user') || Common.getUser()
    console.log('+++user=+++=',user);
    let isBinding=user.isBinding
    if (!isBinding) {
      console.log('未绑定小区')
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '为了方便充缴物业费，下单前请先绑定小区哦~',
      //   cancelText: '再想想',
      //   confirmText: '绑定小区',
      //   success(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //       setTimeout(function () {
      //         wx.navigateTo({
      //           url: '/pages/bindAddress/bindAddress',
      //         })
      //       }, 1000)
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //       return false;
      //     }
      //   }
      // })
    }else{
      this.setData({
        userinfo: user
      });
      if (user.storeId > 0) {
        this.setData({
          storeId: user.storeId
        });
      }else{
        this.setData({
          storeId: 36614
        })
      }

      let self = this
      self.getAllpro();
    }
  },
  totals1(list,type) {
    //计算总数量价格
    if (list.length<=0) {
      return
    }
    var self = this;
    let price = 0;
    for (let i = 0; i < list.length; i++) {
      // if (list[i].checked ) {
        if (list[i].checked && list[i].stock > 0) {
        var prc1 = Utils.floatMul(list[i].proNums, list[i].proPrice)
        price = Utils.floatAdd(price, prc1);
      }
    }
    console.log('list:', list)
    let orAt = self.data.orderAmount2
    let aMoney = Math.floor(price * 100) / 100
    let total = Utils.floatSub(orAt, aMoney)
    console.log('orAt:', list, "total:", total)
    let isF = 0
    if (total<=0){
      self.setData({
        isFree1: 0
      })
    }else{
      self.setData({
        isFree1: total
      })
    }
    console.log('isFree1:', this.data.isFree1)
  
  },
  totals2(list, type) {
    //计算总数量价格
    if (list.length <= 0) {
      return
    }
    var self = this;
    let price = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked && list[i].stock > 0) {
        var prc1 = Utils.floatMul(list[i].proNums, list[i].proPrice)
        price = Utils.floatAdd(price, prc1);
      }
    }
    console.log('list:', list)
    let orAt = self.data.orderAmount2
    let aMoney = Math.floor(price * 100) / 100
    let total = Utils.floatSub(orAt, aMoney)
    console.log('orAt:', list, "total:", total)
    let isF = 0
    if (total <= 0) {
      self.setData({
        isFree2: 0
      })
    } else {
      self.setData({
        isFree2: total
      })
    }
    console.log('isFree2:', this.data.isFree2)
  },
  computeMoney(list) {
    //计算总数量价格
    if (!list)
    {
         return
    }
    var self = this;
    let price = 0;
    let numb = 0;
    let carnum= 0;
    let propertycurrency = 0;
    console.log('list::', list) 
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked && list[i].stock>0) {
        var prc1 = Utils.floatMul(list[i].proNums, list[i].proPrice)
        price = Utils.floatAdd(price, prc1);
        numb += list[i].proNums;
        var prc2 = Utils.floatMul(list[i].proNums, list[i].housingCoin)
        propertycurrency = Utils.floatAdd(propertycurrency, prc2);

      }
        carnum += list[i].proNums;
    }
    console.log("price:", price, "numb:", numb);
    self.setData({
      allMoney: price.toFixed(2),
      allNum: numb,
      propertycurrency: propertycurrency.toFixed(2),
    })
    wx.setStorageSync('cartItemsNum',carnum)
    Common.setTabBar(self);
    // console.log(allMoney, allNum);
  },
  bindSelect: function(e) {
    let self = this;
    var eIndex = e.currentTarget.id.replace("info", "")
    var stars = e.currentTarget.dataset.stars 
    let carts1 = self.data.carts1
    let carts2 = self.data.carts2
    console.log('stars:', stars)
    let carts = self.data.carts
    let checkAllFlag = true;
    let pro=[]
    let params = {};
    let pid = ''
    if (stars==1){
      carts1[eIndex].checked = !carts1[eIndex].checked;
      for (var i = 0; i < carts1.length;i++){
        if (carts1[i].checked == false && carts1[i].stock>0){
          checkAllFlag = false;
        }
        if (carts1[i].proId == carts[i].proId){
          carts[i].checked = carts1[i].checked
        }
      }
      if (carts1[eIndex].checked) {
        params.stype = 1;
      } else {
        params.stype = 0
      }
      pid = carts1[eIndex].proId
    }
    if (stars == 2) {
      carts2[eIndex].checked = !carts2[eIndex].checked;
      for (var i = 0; i < carts2.length; i++) {
        if (carts2[i].checked == false && carts2[i].stock > 0) {
          checkAllFlag = false;
        }
        if (carts2[i].proId == carts[i].proId) {
          carts[i].checked = carts2[i].checked
        }
      }
      if(carts2[eIndex].checked) {
        params.stype = 1;
      } else {
      params.stype = 0
    }
      pid = carts2[eIndex].proId
    }
    console.log('eIndex--------:', eIndex)
    // carts = pro
    
    
    for (var i = 0; i < carts.length;i++){
      if (carts[i].checked == false && carts[i].stock>0){
        checkAllFlag = false;
      }
      
    }
    
    let user = Common.getUser();
    params.userCode = user.userCode;
    params.productIds = "" + pid;
    // if (carts[eIndex].checked) {
    //   params.stype = 1;
    // } else {
    //   params.stype = 0;
    // }
    console.log("params:", params)
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.car.modifyCartItemSelected, params,
      function (data) {
        if (data.status == "OK") {
          if (stars==1){
            self.setData({
              selectedAllStatus: checkAllFlag,
              carts: carts,
              carts1: carts1
            })
            self.totals1(self.data.carts1)
          }
          if (stars == 2) {
            self.setData({
              selectedAllStatus: checkAllFlag,
              carts: carts,
              carts2: carts2
            })
            self.totals2(self.data.carts2)
          }
          console.log("更新产品是否选中OK", self.data.carts);
          self.computeMoney(self.data.carts);
        } else {
          console.log(data.message);
        }
      })
  },
  bindSelectAll: function () {
    let self = this;
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var carts = this.data.carts;
    var carts1 = this.data.carts1;
    var carts2 = this.data.carts2;
    let pros=[]
    for (var i = 0; i < carts1.length; i++) {
        carts1[i].checked = selectedAllStatus;
        pros.push(carts1[i])
    }
    for (var i = 0; i < carts2.length; i++) {
      carts2[i].checked = selectedAllStatus;
      pros.push(carts2[i])
    }
    carts = pros
    for (var i = 0; i < carts.length; i++) {
      carts[i].checked = selectedAllStatus;
    }
    console.log("pros:",pros)
    // carts = pros
    self.setData({
      selectedAllStatus: selectedAllStatus
    })
    let params = {};
    params.productIds = "";
    let isTur = false;
    // debugger
    if (self.data.selectedAllStatus == true) {
      isTur = true;
      params.stype = 1;
    } else {
      isTur = false;
      params.stype = 0;
    }
    pros.forEach(function (fruit) {
      fruit.checked = isTur;
      if (fruit.isValid == true) {
        params.productIds += "," + fruit.proId;
      }
      //this.change();
    }, this);

    let user = Common.getUser();
    params.userCode = user.userCode;
    if (params.productIds.length > 0) {
      params.productIds = params.productIds.substring(1, params.productIds.length);
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.car.modifyCartItemSelected, params,
      function (data) {
        if (data.status == "OK") {
          console.log("更新产品是否选中OK");
          self.setData({
            carts: pros,
            carts1: carts1,
            carts2, carts2
          })
          console.log('切换时候：carts:', self.data.carts)
          self.totals1(self.data.carts1)
          self.totals2(self.data.carts2)
          self.computeMoney(self.data.carts);
          
        } else {
          console.log(data.message);
        }
      })
    }
  },
  add: function (e) {//兑换箱内商品数量加
    var stars = e.currentTarget.dataset.stars
    var eIndex = e.currentTarget.id.replace("info", "")
    var self=this
    var value = []
    var value2 = this.data.carts
    if (stars == 1) {
      console.log('*****')
      value = this.data.carts1
    }
    if (stars == 2) {
      console.log('#####')
      value = this.data.carts2
    }
    value[eIndex].proNums++;
    // value2[eIndex].proNums++;
    if (value2[eIndex].proNums > 1000) {
      value2[eIndex].proNums = 1000;
    }
    if (value[eIndex].proNums > 1000) {
      value[eIndex].proNums = 1000;
    }
    let params = {};
    let user = Common.getUser();
    params.userCode = user.userCode;
    params.productId = "" + value[eIndex].proId;
    params.amount = value[eIndex].proNums;
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.car.modifyCartItemAmount, params,
      function (data) {
        if (data.status == "OK") 
        {
          if (stars == 1) {
            self.setData({
              carts1: value,
              carts: value2
            })
            self.totals1(self.data.carts1)
            self.computeMoney(self.data.carts);
          }
          if (stars == 2) {
            self.setData({
              carts2: value,
              carts: value2
            })
            self.totals2(self.data.carts2)
            self.computeMoney(self.data.carts);
          }

        } else {
          console.log(data.message);
        }
      })    
  },
  sub:function (e) {//兑换箱内商品数量加
    let self = this;
    var stars = e.currentTarget.dataset.stars
    var eIndex = e.currentTarget.id.replace("info", "")
   
    var value = []
    var value2 = this.data.carts
    if (stars==1){
      console.log('*****')
      value = this.data.carts1
      this.data.carts1[eIndex].proNums > 0 ? this.data.carts1[eIndex].proNums -= 1 : 1;
    } 
    if (stars == 2){
      console.log('#####')
      value = this.data.carts2
      this.data.carts2[eIndex].proNums > 0 ? this.data.carts2[eIndex].proNums -= 1 : 1;
    }
    
    if (value[eIndex].proNums <=0 )
    {
       value[eIndex].proNums = 1;
       wx.showToast({
         title: '此商品一件起购',
         icon:'none'
       })
       return;
    }
    if (value[eIndex].proNums > 1000) {
      value[eIndex].proNums = 1000
    }
    if (value2[eIndex].proNums <= 0) {
      value2[eIndex].proNums = 1;
      return;
    }
    if (value2[eIndex].proNums > 1000) {
      value2[eIndex].proNums = 1000
    }
    let params = {};
    let user = Common.getUser();
    params.userCode = user.userCode;
    params.productId = "" + value[eIndex].proId;
    params.amount = value[eIndex].proNums;
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.car.modifyCartItemAmount, params,
      function (data) {
        if (data.status == "OK") 
        {
          if (stars==1){
            self.setData({
              carts1: value,
              carts: value2
            })
            self.totals1(self.data.carts1)
            self.computeMoney(self.data.carts);
          }
          if (stars == 2) {
            self.setData({
              carts2: value,
              carts: value2
            })
            self.totals2(self.data.carts2)
            self.computeMoney(self.data.carts);
          }
          
        } else {
          console.log(data.message);
        }
      })  
  },
  delcart: function (e) {//订单列表-删除块 
    var self = this;
    var stars = e.currentTarget.dataset.stars
    let carts = self.data.carts
    let carts1 = self.data.carts1
    let carts2 = self.data.carts2
    var eIndex = e.currentTarget.id.replace("info", "")
    let params = {};
    let user = Common.getUser();
    params.userCode = user.userCode;
    params.productIds = eIndex;
    //删除全部失效产品
    if (stars == 1) {//物业货架
      for (let i = 0; i < carts1.length; i++) {
        if (carts1[i].proId == eIndex) {
          carts1.splice(i, 1);
        }
      }
    } 
    if (stars == 2) {//线上商城
      for (let i = 0; i < carts2.length; i++) {
        if (carts2[i].proId == eIndex) {
          carts2.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].proId == eIndex) {
        carts.splice(i, 1);
      }
    }
    wx.showModal({
      title: "提示",
      content: "确认要删除这个产品吗？",
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      confirmText: "是",//默认是“确定”
      success: function (res) {
         if (res.cancel) {
               //点击取消,默认隐藏弹框
            } else {
      
        Common.request.post(Api.car.removeCartItems, Common.getparam(params),
          function (data) {
            if (data.status == "OK")
             {
              self.setData({
                ebtId: 0,
                carts: carts,
                carts1, carts2
              })
              self.totals1(carts1)
              self.totals2(carts2)
              self.computeMoney(carts);
             }
          })
            }
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
  changeNums(e) {
    console.log(e);
    let self = this
    let data = e.currentTarget.dataset
    var stars = e.currentTarget.dataset.stars
    let index = data.index;
    let exboxList = self.data.carts;
    let pros = []
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value)
      if (stars == 1) {
        console.log('*****')
        pros = self.data.carts1
      }
      if (stars == 2) {
        console.log('#####')
        pros = self.data.carts2
      }
      if (value < pros[index].limitAmount) {
        pros[index].proNums = 0;
        return;
      } else if (value > 1000) {
        pros[index].proNums = 1000;
      } else if (value) {
        pros[index].proNums = Math.floor(value)
      }
    }

    let params = {};
    let user = Common.getUser();
    params.userCode = user.userCode;
    params.productId = "" + pros[index].proId;
    params.amount = pros[index].proNums;
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.car.modifyCartItemAmount, params,
      function (data) {
        if (data.status == "OK") {
          if (stars == 1) {
            self.setData({
              carts1: pros,
              carts: exboxList
            })
            self.totals1(self.data.carts1)
            self.computeMoney(self.data.carts);
          }
          if (stars == 2) {
            self.setData({
              carts2: pros,
              carts: exboxList
            })
            self.totals2(self.data.carts2)
            self.computeMoney(self.data.carts);
          }
        } else {
          console.log(data.message);
        }
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '购物车',
      path: 'pages/exchangeBox/exchangeBox'
    }
  }
})