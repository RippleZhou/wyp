// pages/order/exchangeBox.js
const computedBehavior = require("miniprogram-computed");
let app = getApp();
const Common = require('../../utils/common')
var Api = require("../../utils/api")
var Utils = require("../../utils/util.js")
Component({
  data: {
    // ins,
    lnums: 1,
    isNums: 0,
    lImgs: '../../img/noPros.png',
    lImgs2: '../../img/noCheck.png',
    carts: [],
    carts1: [], //货架
    carts2: [], //商城
    carts3: [], //限时抢购
    allMoney: 0,
    allNum: 0,
    propertycurrency: 0,
    ebtId: 0,
    code: null,
    proid: null,
    isShows: true,
    selectedAllStatus: false,
    checkAll: false,
    storeId: 0,
    isFree1: 0,
    isFree2: 0,
    isFree3: 0,
    proList3: [],
    orderAmount2: 0,
    noMores: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/nw_blank_01.png',
    userinfo: {},
    X_Start: 0,
    X_End: 0
  },
  behaviors: [computedBehavior],
  computed: {
    isFr01() {
      let pro = []
      let items = this.data.proList3
      let fres = this.data.orderAmount2
      let pNs = 0
      for (var i = 0; i < items.length; i++) {
        let totals = parseFloat((items[i].list.reduce(function(total, curs) {
          let c = 0;
          if (curs.isSelected == 1 && curs.sku.stock != 0) {
            if (curs.activityCode) {
              if (curs.limitedNumber > curs.amount || curs.limitedNumber == "null") {
                c = curs.sku.price * curs.amount
              } else {
                c = curs.sku.price * curs.limitedNumber
              }
            }
            c = curs.sku.price * curs.amount
          }
          return total + c
        }, 0)).toFixed(2))
        pNs = fres - totals
        if (pNs <= 0) {
          pNs = 0
        }
        pro.push(pNs)
        console.log("/------totals:", totals)
        console.log("////pNs:", pNs)
      }
      console.log('*******pro:', pro)
      return pro
    }
  },
  methods: {
    choosedetai3: function(e) { //限时抢购
      console.log(e);
      const e_data = e.currentTarget.dataset;
      console.log(e_data);
      let user = Common.getUser();
      var prolistId = e_data.listdata.sku.productId
      var activityCode = e_data.listdata.sku.activityCode
      wx.navigateTo({
        url: '/pages/flashSale-detail/flashSale-detail?productId=' + prolistId + '&storeId=' + user.storeId + '&activityCode=' + activityCode,
      })
    },
    choosedetail: function(e) { //货架
      const e_data = e.currentTarget.dataset;
      console.log(e_data);
      var prolistId = e_data.listdata.proId
      wx.navigateTo({
        url: '/pages/details/details?productId=' + prolistId + '&storeId=' + this.data.storeId,
      })
    },
    choosedetail2: function(e) { //线上
      const e_data = e.currentTarget.dataset;
      console.log(e_data);
      var prolistId = e_data.listdata.proId
      wx.navigateTo({
        url: `/pages/store-detail/store-detail?storeId=${this.data.storeId}&productId=${prolistId}`
      })
    },
    choosedetail3: function(e) { //限时抢购
      const e_data = e.currentTarget.dataset;
      console.log(e_data);
      var prolistId = e_data.listdata.proId
      wx.navigateTo({
        url: `/pages/flashSale-detail/flashSale-detail?storeId=${this.data.storeId}&productId=${prolistId}`
      })
    },
    // 获取服务器的购物车
    getAllpro() {
      var self = this;
      let user = Common.getUser();
      let userCode = user.userCode
      if (!userCode) {
        return false;
      }
      let storeId = new Number(user.storeId).toString() || Common.getStorage("shareStoreId2").toString();
      if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0) {
        storeId = Common.storeId2()
        console.log(storeId, 'storeId2===')
      }
      storeId = storeId
      Common.request.get(Api.car.queryCart, {
          userCode: user.userCode,
          storeId: storeId
        },
        function(data) {
          console.log(data)
          if (data.status == "OK") {
            let exboxList = [];
            let list01 = []; //货架
            let list02 = []; //商城
            let list03 = []; //限时抢购
            let orderAmount2 = data.message.orderAmount
            let proList = data.message.housingSellingItems || []; ///货架在售
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
            let invalidList = data.message.housingHaltSellItems || []; ///货架下架停售
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
              console.log(list01)
            }
            let proList2 = data.message.shoppingSellingItems || []; ///商城在售 
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
              pro.orderAmount = data.message.orderAmount || 0;
              exboxList.push(pro);
              list02.push(pro)
            }
            let invalidList2 = data.message.shoppingHaltSellItems || []; ///商城停售
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
              console.log(exboxList)
              list02.push(pro)
              console.log(list02)
            }
            let proList3 = data.message.activitySellingItems || []; ///限时抢购 
            // list03.push(proList3)
            for (let i = 0; i < proList3.length; i++) {
              let activityList = proList3[i].list
              for (let j = 0; j < activityList.length; j++) {
                var checkAllFlag = true
                let pro = {}; //定义产品对象，获取数据，追加到数组里
                if (activityList[j].isSelected == 1) {
                  //判断是否选中
                  console.log('被选中')
                  pro.checked = true;
                } else {
                  console.log('没有被选中')
                  checkAllFlag = false
                  pro.checked = false;
                }
                pro.imgUrl = activityList[j].sku.imageUrl; //图片路径
                pro.proTit = activityList[j].sku.productName; //"产品名称";
                pro.proId = activityList[j].sku.productId; //产品编号
                pro.sourceType = activityList[j].sku.sourceType;
                pro.housingCoin = activityList[j].sku.housingCoin;
                //pro.proSpec = "1.5kg";//"1.5kg"后台说不显示
                //pro.proTips = activityList[j].limitAmount + "限购"; //"限购2件";
                pro.limitAmount = activityList[j].limitAmount;
                pro.proPrice = activityList[j].sku.price;
                pro.limitedNumber = activityList[j].sku.limitedNumber //限购
                pro.isValid = true; //这里都为有效产品
                pro.proNums = activityList[j].amount;
                pro.stock = activityList[j].sku.stock;
                pro.activityCode = activityList[j].sku.activityCode
                pro.isPutaway = activityList[j].sku.isPutaway;
                pro.orderAmount = data.message.orderAmount || 0;
                exboxList.push(pro);
                console.log(exboxList)
                list03.push(pro)
                console.log(list03)
              }

            }
            if (exboxList.length > 0) {
              console.log(exboxList)
              exboxList.forEach(function(fruit) {
                if (fruit.checked) {
                  self.setData({
                    selectedAllStatus: true
                  })
                } else {
                  self.setData({
                    selectedAllStatus: false
                  })
                  return false;
                }
              })

            }
            console.log('activityCartItems', exboxList)
            let exboxList3 = exboxList
            self.setData({
              proList3,
              carts: exboxList,
              carts1: list01,
              carts2: list02,
              carts3: list03,
              orderAmount2: orderAmount2
            })
            self.totals1(list01)
            self.totals2(list02)
            self.totals3(list03)
            self.computeMoney(exboxList3)
          }
        })
    },
    goMall() {
      wx.switchTab({
        url: '/pages/store/store',
      })
    },
    goIndex() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    del: function() {
      let self = this;
      wx.showModal({
        title: "提示",
        content: "确认要删除所选产品吗？",
        showCancel: true, //是否显示取消按钮
        cancelText: "否", //默认是“取消”
        confirmText: "是", //默认是“确定”
        success: function(res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //  debugger;
            let carts = self.data.carts;
            let carts1 = self.data.carts1;
            let carts2 = self.data.carts2;
            let carts3 = self.data.carts3;
            console.log('==---carts===', carts)
            console.log('==---carts1===', carts1)
            console.log('==---carts2===', carts2)
            console.log('==---carts3===', carts3)
            let params = {};
            let user = Common.getUser();
            params.userCode = user.userCode;
            params.productIds = "";
            params.activityCodes = "";
            carts.forEach(function(fruit) {
              if (fruit.checked == true) {
                // debugger;
                if (!params.productIds) {
                  params.productIds += fruit.proId;
                } else {
                  params.productIds += ',' + fruit.proId;
                }
                if (!fruit.activityCode) {
                  fruit.activityCode = 'null'
                }
                if (!params.activityCodes) {
                  params.activityCodes = fruit.activityCode
                } else {
                  params.activityCodes += ',' + fruit.activityCode;
                }
                // params.activityCodes += ',' + fruit.activityCode;
              }
            }, this);
            for (let i = carts.length - 1; i >= 0; i--) {
              if (carts[i].checked == true) {
                carts.splice(i, 1);
              }
            }
            for (let i = carts1.length - 1; i >= 0; i--) {
              if (carts1[i].checked == true) {
                carts1.splice(i, 1);
              }
            }
            for (let i = carts2.length - 1; i >= 0; i--) {
              if (carts2[i].checked == true) {
                carts2.splice(i, 1);
              }
            }
            if (params.productIds.length > 0) {
              let MD5sign = Common.md5sign(params);
              params.sign = MD5sign;
              Common.request.post(Api.car.removeCartItems, params,
                function(data) {
                  if (data.status == "OK") {
                    console.log("更新产品是否选中OK");
                    console.log('切换时候：carts:', self.data.carts)
                    for (let i = carts3.length - 1; i >= 0; i--) {
                      if (carts3[i].checked == true) {
                        carts3.splice(i, 1);
                      }
                    }
                    var proList3new = [];
                    var proList3 = self.data.proList3
                    proList3.forEach(function(info) {
                      var list = [];
                      // debugger;
                      info.list.forEach(function(pro) {
                        if (pro.isSelected == 0) {
                          list.push(pro)
                        }
                      }, this);
                      info.list = list;
                      if (info.list.length > 0) {
                        proList3new.push(info)
                      }
                    }, this);
                    self.setData({
                      carts: carts,
                      carts1: carts1,
                      carts2: carts2,
                      carts3: carts3,
                      proList3: proList3new
                    });
                    self.totals1(carts1)
                    self.totals2(carts2)
                    self.totals3(carts3)
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
    GoPay: function() {
      let _this = this;
      let checarts = false;
      for (let i = 0; i < _this.data.carts.length; i++) {
        if (_this.data.carts[i].checked == true && _this.data.carts[i].stock > 0) {
          checarts = true;
        }
      }
      if (_this.data.carts.length > 0 && checarts) {
        wx.removeStorageSync('cartItemsNum');
        wx.navigateTo({
          url: '/pages/fillOrder/fillOrder',
        })
      } else {
        wx.showToast({
          title: '请选择要兑换的商品',
          icon: 'none'
        })
        return
      }
    },
    totals1(list, type) {
      //计算总数量价格
      if (list.length <= 0) {
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
      if (total <= 0) {
        self.setData({
          isFree1: 0
        })
      } else {
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
    totals3(list, type) {
      console.log(list)
      //计算总数量价格
      if (list.length <= 0) {
        return
      }
      var self = this;
      let price = 0;
      // this.data.proList3.forEach(function(code){
      //   if()
      // })
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          var prc1 = Utils.floatMul(list[i].proNums, list[i].proPrice)

          // if (list[i].limitedNumber > list[i].proNums) {
          //   prc1 = Utils.floatMul(list[i].proNums, list[i].proPrice)
          // } else {
          //   prc1 = Utils.floatMul(list[i].limitedNumber, list[i].proPrice)
          // }
          price = Utils.floatAdd(price, prc1);
        }
      }
      console.log('list:', list)
      let orAt = self.data.orderAmount2
      console.log('orAt', orAt)
      let aMoney = Math.floor(price * 100) / 100
      let total = Utils.floatSub(orAt, aMoney)
      console.log('orAt:', list, "total:", total)
      let isF = 0
      if (total <= 0) {
        self.setData({
          isFree3: 0
        })
      } else {
        self.setData({
          isFree3: total
        })
      }
      console.log('isFree3:', this.data.isFree3)
    },
    computeMoney(list) {
      //计算总数量价格
      if (!list) {
        return
      }
      var self = this;
      let price = 0;
      let numb = 0;
      let carnum = 0;
      let propertycurrency = 0;
      console.log('list::', list)
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked && list[i].stock > 0) {
          // if (list[i].activityCode) {
          //   if (list[i].proNums >= list[i].limitedNumber && list[i].limitedNumber == "null") {
          //     list[i].proNums = list[i].limitedNumber
          //   }
          // }
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
      wx.setStorageSync('cartItemsNum', carnum)
      let userCode = Common.getStorage('userCode') || Common.getUser().userCode
      Common.setTabBar(self);
      // if (userCode) {
      //   Common.setTabBar(self);
      // }
      // console.log(allMoney, allNum);
    },
    bindSelect: function(e) {
      let self = this;
      var eIndex = e.currentTarget.id.replace("info", "")
      var stars = e.currentTarget.dataset.stars
      var activityCodes = e.currentTarget.dataset.activitycode
      var proid = e.currentTarget.dataset.proid
      let carts1 = self.data.carts1
      let carts2 = self.data.carts2
      let carts3 = self.data.carts3
      console.log('stars:', stars)
      let carts = self.data.carts
      let checkAllFlag = true;
      let pro = []
      let params = {};
      let pid = '';
      // let proList3new=[];
      if (stars == 1) {
        carts1[eIndex].checked = !carts1[eIndex].checked;
        for (var i = 0; i < carts1.length; i++) {
          if (carts1[i].checked == false && carts1[i].stock > 0) {
            checkAllFlag = false;
          }
          if (carts1[i].proId == carts[i].proId) {
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
        if (carts2[eIndex].checked) {
          params.stype = 1;
        } else {
          params.stype = 0
        }
        pid = carts2[eIndex].proId
      }
      if (stars == 3) {
        var activitylist = [];
        //debugger;
        this.data.carts3.forEach(function(info) {
          if (info.activityCode == activityCodes && info.proId == proid) {
            activitylist.push(info);
          }
          //this.change();
        }, this);
        //debugger;
        activitylist[eIndex].checked = !activitylist[eIndex].checked;
        for (var i = 0; i < activitylist.length; i++) {
          if (activitylist.checked == false && activitylist.stock > 0) {
            checkAllFlag = false;
          }
          if (activitylist[i].proId == activitylist[i].proId) {
            activitylist[i].checked = activitylist[i].checked
          }
        }
        if (activitylist[eIndex].checked) {
          params.stype = 1;
        } else {
          params.stype = 0
        }
        pid = activitylist[eIndex].proId
      }
      console.log('eIndex--------:', eIndex)
      // carts = pro
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].checked == false && carts[i].stock > 0) {
          checkAllFlag = false;

        }
      }
      let user = Common.getUser();
      params.userCode = user.userCode;
      params.productIds = "" + pid;
      if (activityCodes) {
        params.activityCodes = activityCodes
      } else {
        params.activityCodes = 'null'
      }
      console.log("params:", params)
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.car.modifyCartItemSelected, params,
        function(data) {
          if (data.status == "OK") {
            if (stars == 1) {
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
            if (stars == 3) {
              console.log(self.data.proList3)

              var proList3new = self.data.proList3
              proList3new.forEach(function(info) {
                if (info.activityCode == activityCodes) {
                  info.list.forEach(function(pro) {
                    if (pro.sku.productId == proid) {
                      pro.isSelected = pro.isSelected == 1 ? 0 : 1;
                    }
                  }, this);
                }
                //this.change();
              }, this);
              self.setData({
                selectedAllStatus: checkAllFlag,
                carts: carts,
                carts3: carts3,
                proList3: proList3new
              })
              self.totals3(self.data.carts3)
            }
            console.log("更新产品是否选中OK", self.data.carts);
            self.computeMoney(self.data.carts);
          } else {
            console.log(data.message);
          }
        })
    },
    bindSelectAll: function() {
      let self = this;
      var selectedAllStatus = this.data.selectedAllStatus;
      console.log('selectedAllStatus', selectedAllStatus)
      selectedAllStatus = !selectedAllStatus;
      var carts = this.data.carts;
      var carts1 = this.data.carts1;
      var carts2 = this.data.carts2;
      var carts3 = this.data.carts3;
      console.log('carts3', carts3)
      let pros = []
      for (var i = 0; i < carts1.length; i++) {
        carts1[i].checked = selectedAllStatus;
        pros.push(carts1[i])
      }
      for (var i = 0; i < carts2.length; i++) {
        carts2[i].checked = selectedAllStatus;
        pros.push(carts2[i])
      }
      for (var i = 0; i < carts3.length; i++) {
        // debugger;
        this.data.proList3.forEach(function(info) {
          if (info.activityCode == carts3[i].activityCode) {
            info.list.forEach(function(pro) {
              if (pro.sku.productId == carts3[i].proId) {
                pro.isSelected = selectedAllStatus ? 1 : 0;
              }
            }, this);
          }
          //this.change();
        }, this);

        pros.push(carts3[i])
      }
      carts = pros
      console.log('carts', carts)
      console.log('pros', pros)
      for (var i = 0; i < carts.length; i++) {
        carts[i].checked = selectedAllStatus;
      }
      console.log("pros:", pros)
      // carts = pros
      // debugger;

      console.log('thisadaselectedAllStatus', this.data.selectedAllStatus)
      this.setData({
        selectedAllStatus: selectedAllStatus,
        proList3: this.data.proList3
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
      pros.forEach(function(fruit) {
        fruit.checked = isTur;
        if (fruit.isValid == true) {
          if (fruit.activityCode) {
            console.log('fruit.activityCode', fruit.activityCode)
          } else {
            fruit.activityCode = 'null'
          }
          params.activityCodes += ',' + fruit.activityCode
          params.productIds += "," + fruit.proId;
        }
        //this.change();
      }, this);

      let user = Common.getUser();
      params.userCode = user.userCode;
      if (params.productIds.length > 0) {
        params.productIds = params.productIds.substring(1, params.productIds.length);
        params.activityCodes = params.activityCodes.substring(10, params.activityCodes.length);
        let MD5sign = Common.md5sign(params);
        params.sign = MD5sign;
        Common.request.post(Api.car.modifyCartItemSelected, params,
          function(data) {
            if (data.status == "OK") {
              console.log("更新产品是否选中OK");
              // for (var i = 0; i < carts.length; i++) {
              //   if (carts[i].checked == false && carts[i].stock > 0) {
              //     checkAllFlag = false;
              //   }
              // }
              self.setData({
                selectedAllStatus: selectedAllStatus,
                carts: carts,
                carts1: carts1,
                carts2,
                carts3
              })

              console.log('切换时候：carts:', self.data.carts)
              self.totals1(self.data.carts1)
              self.totals2(self.data.carts2)
              self.totals3(self.data.carts3)
              self.computeMoney(self.data.carts);

            } else {
              console.log(data.message);
            }
          })
      }
    },
    add: function(e) { //兑换箱内商品数量加
      console.log(e);
      var stars = e.currentTarget.dataset.stars
      var eIndex = e.currentTarget.id.replace("info", "")
      var activityCode = e.currentTarget.dataset.activitycode
      var limitedNumber = e.currentTarget.dataset.limitednumber
      var proid = e.currentTarget.dataset.proid
      console.log('activityCode==--=', activityCode)
      var self = this
      var value = []
      var value2 = this.data.carts
      var value3 = this.data.carts3
      console.log(value3)
      if (stars == 1) {
        console.log('*****')
        value = this.data.carts1
      }
      if (stars == 2) {
        console.log('#####')
        value = this.data.carts2
      }
      //活动
      if (stars == 3) {
        //debugger;
        let that = this
        var activitylist = [];
        // value = this.data.carts3
        debugger
        value3.forEach(function(info) {
          // debugger;
          if (info.activityCode == activityCode && info.proId == proid) {
            // if (info.limitedNumber == 0) {
               //debugger;
              activitylist.push(info);
            // activitylist.push(info);
            //nfo.proNums > 0 ? info.proNums += 1 : 1;
          }
        }, this);
        value = activitylist
        console.log(value);
      }
      console.log('value', value)
      value[eIndex].proNums++;
      if (value2[eIndex].proNums > 1000) {
        value2[eIndex].proNums = 1000;
      }
      if (value[eIndex].proNums > 1000) {
        value[eIndex].proNums = 1000;
      }
      // if (value[eIndex].proNums >= value[eIndex].limitedNumber && value[eIndex].limitedNumber != 0) {
      //   value[eIndex].proNums = value[eIndex].limitedNumber
      // }
      // if (value[eIndex].proNums >= value[eIndex].limitedNumber && value[eIndex].limitedNumber == 0) {
      //   value[eIndex].proNums = value[eIndex].proNums
      // }
      let params = {};
      let user = Common.getUser();
      params.userCode = user.userCode;
      params.productId = "" + value[eIndex].proId;
      if (activityCode) {
        params.activityCode = activityCode
      }
      params.amount = value[eIndex].proNums;
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.car.modifyCartItemAmount, params,
        function(data) {
          //debugger;
          if (data.status == "OK") {
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
            
            if (stars == 3) {
              //debugger;
              var proList33 = self.data.proList3
              proList33.forEach(function(info) {
                if (info.activityCode == activityCode) {
                  info.list.forEach(function(pro) {
                    if (pro.sku.productId == proid ) {
                      pro.amount++;
                    }
                  }, this);
                }
                //this.change();
              }, this);
              self.setData({
                carts3: value3,
                carts: value2,
                proList3: proList33
              })
              self.totals3(self.data.carts3)
              self.computeMoney(self.data.carts);
            }
          } else {
            console.log(data.message);
          }
        })
    },
    sub: function(e) { //兑换箱内商品数量减
      // debugger;
      let self = this;
      var stars = e.currentTarget.dataset.stars
      var eIndex = e.currentTarget.id.replace("info", "")
      var activityCode = e.currentTarget.dataset.activitycode
      var limitedNumber = e.currentTarget.dataset.limitednumber
      var proid = e.currentTarget.dataset.proid
      var value = []
      var value2 = this.data.carts
      var value3 = this.data.carts3
      if (stars == 1) {
        console.log('*****')
        value = this.data.carts1
        this.data.carts1[eIndex].proNums > 0 ? this.data.carts1[eIndex].proNums -= 1 : 1;
      }
      if (stars == 2) {
        console.log('#####')
        value = this.data.carts2
        this.data.carts2[eIndex].proNums > 0 ? this.data.carts2[eIndex].proNums -= 1 : 1;
      }
      //活动
      if (stars == 3) {
        console.log('=====')
        var activitylist = [];
        value2.forEach(function(info) {
          if (info.activityCode == activityCode && info.proId == proid) {
            // if (info.limitedNumber == 0) {
              activitylist.push(info);
              self.setData({
                activitylist
              })
            // }
            activitylist.push(info);
            info.proNums > 0 ? info.proNums -= 1 : 1;
          }
          //this.change();
        }, this);
        value = self.data.activitylist
      }
      if (value[eIndex].proNums <= 0) {
        value[eIndex].proNums = 1;
        wx.showToast({
          title: '此商品一件起购',
          icon: 'none'
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
      if (activityCode) {
        params.activityCode = activityCode
      }
      params.amount = value[eIndex].proNums;
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.car.modifyCartItemAmount, params,
        function(data) {
          if (data.status == "OK") {
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
            if (stars == 3) {
              var proList3 = self.data.proList3
              for (var prop in proList3){
                if(proList3[prop].activityCode==activityCode){
                  proList3[prop].list.forEach(function(pro){
                    if(pro.sku.productId == proid){
                      pro.amount--;
                    }
                  })
                }
              }
              // self.data.proList3.forEach(function(infos) {
              //   if (infos.activityCode == activityCode) {
              //     infos.list.forEach(function(pro) {
              //       if (pro.sku.productId == proid) {
              //         pro.amount--;
              //       }
              //     }, this);
              //   }
              //   //this.change();
              // }, this);
              self.setData({
                carts: value2,
                carts3: value3,
                proList3: proList3
              })
              self.totals3(self.data.carts3)
              self.computeMoney(self.data.carts);
            }
          } else {
            console.log(data.message);
          }
        })
    },
    delcart: function(e) { //订单列表-删除块 
      var self = this;
      var stars = e.currentTarget.dataset.stars
      var activityCodes = e.currentTarget.dataset.activitycode
      let carts = self.data.carts
      let carts1 = self.data.carts1
      let carts2 = self.data.carts2
      let carts3 = self.data.carts3
      var eIndex = e.currentTarget.id.replace("info", "")
      let params = {};
      let user = Common.getUser();
      params.userCode = user.userCode;
      params.productIds = eIndex;
      if (activityCodes) {
        params.activityCodes = activityCodes
      } else {
        params.activityCodes = 'null'

      }
      //删除全部失效产品
      if (stars == 1) { //物业货架
        for (let i = 0; i < carts1.length; i++) {
          if (carts1[i].proId == eIndex) {
            carts1.splice(i, 1);
          }
        }
      }
      if (stars == 2) { //线上商城
        for (let i = 0; i < carts2.length; i++) {
          if (carts2[i].proId == eIndex) {
            carts2.splice(i, 1);
          }
        }
      }
      if (stars == 3) { //限时抢购
        for (let i = 0; i < carts3.length; i++) {
          if (carts3[i].proId == eIndex) {
            carts3.splice(i, 1);
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
        showCancel: true, //是否显示取消按钮
        cancelText: "否", //默认是“取消”
        confirmText: "是", //默认是“确定”
        success: function(res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {

            Common.request.post(Api.car.removeCartItems, Common.getparam(params),
              function(data) {
                if (data.status == "OK") {
                  var proList3new = [];
                  var proList3 = self.data.proList3
                  proList3.forEach(function(info) {
                    if (info.activityCode == activityCodes) {
                      var list = [];
                      // debugger;
                      info.list.forEach(function(pro) {
                        if (pro.sku.productId != eIndex) {
                          list.push(pro)
                        }
                      }, this);
                      info.list = list;
                    }
                    if (info.list.length > 0) {
                      proList3new.push(info)
                    }
                    // debugger;
                    //this.change();
                  }, this);
                  // debugger
                  for (let i = carts.length - 1; i >= 0; i--) {
                    console.log(carts[i].proId)
                    if (carts[i].proId == eIndex && carts[i].activityCode == activityCodes) {
                      carts.splice(i, 1);
                    }
                  }
                  // debugger
                  self.setData({
                    ebtId: 0,
                    carts: carts,
                    proList3: proList3new,
                    carts1,
                    carts2,
                    carts3

                  })
                  self.totals1(carts1)
                  self.totals2(carts2)
                  self.totals3(carts3)
                  self.computeMoney(carts);
                }
              })
          }
        }
      })
    },
    removestart: function(e) {
      console.log(e)
      this.setData({
        X_Start: e.changedTouches[0].clientX
      })
    },
    removeload: function(e) {
      console.log(e)
      this.setData({
        X_End: e.changedTouches[0].clientX
      })
    },
    removeend: function(e) {
      console.log(e)
      var stars = e.currentTarget.dataset.stars
      if (stars == 3) {
        this.setData({
          X_End: e.changedTouches[0].clientX
        }), this.direction("", e.currentTarget.dataset.proid, e.currentTarget.dataset.activitycode)
      } else {
        this.setData({
          X_End: e.changedTouches[0].clientX
        }), this.direction(e.currentTarget.dataset.id)
      }

    },
    direction: function(e, proid, code) {
      console.log(e)
      var t = {
        xstart: this.data.X_Start,
        xend: this.data.X_End
      };
      // debugger
      t.xstart > t.xend ? t.xstart - t.xend > 136 &&
        this.setData({
          ebtId: e,
          proid: proid,
          code: code
        }) : this.setData({
          ebtId: 0,
          proid: 0,
          code: ""
        })
    }, //End 订单列表-删除块
    confirmOrder: function() { //跳转立即兑换
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder'
      })
    },
    changeNums(e) {
      console.log(e);
      let self = this
      let data = e.currentTarget.dataset
      var activityCode = e.currentTarget.dataset.activitycode
      var stars = e.currentTarget.dataset.stars
      var productId = e.currentTarget.dataset.proid
      var limitedNumber = e.currentTarget.dataset.limitednumber
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
        if (stars == 3) {
          console.log('======')
          self.data.carts3.forEach(function(info) {
            if (info.stock == 1) {
              pros.push(info)
            }
          })
          // pros = self.data.carts3
          //debugger;
          // if (pros[index].limitedNumber == "null") {
          //   console.log('======', index)
          //   // debugger;
          //   pros[index].proNums = pros[index].limitedNumber
          //   return;
          // } else {
            pros[index].proNums = Math.floor(value)
          // }
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
      if (activityCode) {
        params.activityCode = activityCode
      }
      params.amount = pros[index].proNums;
      let MD5sign = Common.md5sign(params);
      params.sign = MD5sign;
      Common.request.post(Api.car.modifyCartItemAmount, params,
        function(data) {
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
            if (stars == 3) {
              self.setData({
                carts3: pros,
                carts: exboxList
              })
              self.totals3(self.data.carts3)
              self.computeMoney(self.data.carts);
            }
          } else {
            console.log(data.message);
          }
        })
    },
    onShareAppMessage: function(res) {
      return {
        title: '购物车',
        path: 'pages/exchangeBox/exchangeBox'
      }
    }
  },
  ready: function() {
    Common.setStorage('Isb', 1)
    let user = Common.getStorage('user') || Common.getUser()
    let userCode = user.userCode
    console.log('+++user=+++=', user);
    let isBinding = user.isBinding
    if (!isBinding) {
      console.log('未绑定小区')
    } else {
      this.setData({
        userinfo: user
      });
      if (user.storeId > 0) {
        this.setData({
          storeId: user.storeId
        });
      } else {
        this.setData({
          storeId: 36614
        })
      }
      let self = this
      self.getAllpro();
      // if(userCode){
      //   self.getAllpro();
      // }else{
      //   console.log('无userCode')
      // }
    }
  },
  pageLifetimes: {
    show: function() {
      Common.setStorage('Isb', 1)
      let user = Common.getStorage('user') || Common.getUser()
      let userCode = user.userCode
      console.log('+++user=+++=', user);
      let isBinding = user.isBinding
      if (!isBinding) {
        console.log('未绑定小区')
      } else {
        this.setData({
          userinfo: user
        });
        if (user.storeId > 0) {
          this.setData({
            storeId: user.storeId
          });
        } else {
          this.setData({
            storeId: 36614
          })
        }
        let self = this
        self.getAllpro();

        console.log('加载购物车')
      }
    }
  }
})