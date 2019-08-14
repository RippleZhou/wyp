// pages/store-deatail/store-detail.js
const Common = require("../../utils/common");
var Api = require("../../utils/api");
var imageUtil = require("../../utils/util.js");

var app = getApp();
let { regeneratorRuntime } = global;

Page({
  data: {
    buttonHidden: true,
    buttonText: "",
    proInfor: [], //商品信息
    isIpx: true,
    indicatorDots: false, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
    productId: "", //产品ＩＤ
    storeId: "", //商户ＩＤ
    buyList: [], //已买列表
    popupShow: false, //规格是否显示
    userId: 150, //用户ＩＤ
    skuList: [], //规格列表
    amount: 1, //产品数量
    skuSelected: -1, //已选规格
    productImgs: [], //详情
    masterPicture: [], //轮播图
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
    imgheights: [],
    current: 0,
    isIpx: false
  },
  onShareAppMessage: function (res) {
    let { productId, storeId, proInfor } = this.data
    let userCode = Common.getUserCode()
    let user = Common.getUser()
    let userInfo = Common.getStorage('userInfo')
    let usersName = userInfo.nickName || ''
    let title = `${usersName}向您推荐${proInfor.productTitle}`
    return {
      title,
      path: `pages/store-detail/store-detail?isShare=1&shareUserCode=${userCode}&shareProductId=${productId}&shareStoreId=${storeId}`
    }
  },
  async getShareInfo(userCode, productId, storeId) {
    let _this = this
    var parm = {
      sourceType: 14, shareProductId: productId, shareStoreId: storeId
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    console.log('getShareInfo')
    try {
      console.log('parm', parm)
      let data = await Common.ajax.post(Api.housing.getShareInfo, parm)
      console.log('接口返回：', data)
      if (data.message) {
        _this.setData({
          shareIn: {
            title: data.message.oneLevelTitle,
            imageUrl: data.message.shareProductImage
          }
        })
        console.log('message01', data.message)
        return true
      } else {
        console.log('message02', data.message)
        return false
      }
    } catch (err) {
      console.log('----false---')
      return false
    }

  },
  onLoad: async function(options) {
    let isS = Common.getStorage("isShare")
    console.log("options", options)
    if ((options && options.isShare) || isS) {
      console.log('分享進入')
      Common.removeStorage("isShare")
      let shareUserCode =options.shareUserCode || Common.getStorage("shareUserCode");
      let shareStoreId =options.shareStoreId || Common.getStorage("shareStoreId");
      let shareProductId =options.shareProductId || Common.getStorage("shareProductId");
      let user = Common.getUser();
      let islogin = Common.getStorage('islogin')
      console.log('islogin==',islogin)
      // if (!islogin) {
        console.log('not login')
        Common.setStorage("targetUrl1", `/pages/store-detail/store-detail?isShare=1&shareUserCode=${shareUserCode}&shareProductId=${shareProductId}&shareStoreId=${shareStoreId}`);
        console.log('详情跳转')
        // return Common.gotoHome(); //登录以后跳详情todo
        Common.setStorage("shareUserCode", shareUserCode);
        Common.setStorage("shareStoreId", shareStoreId);
        Common.setStorage("shareProductId", shareProductId);
      // }
      console.log('是否绑定:', user.isBinding)
      if (!user.isBinding) {
        console.log('没有绑定')
        this.getInor(shareProductId, shareStoreId)
        this.getList(shareStoreId)
        this.setData({
          productId: shareProductId
        })
        return
      }
      console.log('绑定了')
      console.log('分享者storeid', shareStoreId, '接受者storeid', user.storeId, '分享的产品ID:', shareProductId)
     
      if (user.storeId != shareStoreId) {
        console.log('不同物业')
        //不同物业
        let hasProduct = await this.hasProduct(shareProductId, user.storeId);
        if (!hasProduct) {
          console.log('没有商品')
          Common.setStorage("Isb", 1);
          //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
          return Common.gotoStore();
        } else {
          console.log('有商品')

          this.getInor(shareProductId, user.storeId);
          this.getList(user.storeId);
          this.setData({
            productId: shareProductId,
            storeId: user.storeId
          });
        }
      } else {
        this.getInor(shareProductId, user.storeId);
        this.getList(user.storeId);
        this.setData({
          productId: shareProductId,
          storeId: user.storeId
        });
      }
    } else {
      let { storeId, productId } = options;
      this.getInor(productId, storeId);
      this.getList(storeId);
      this.setData({
        productId: productId,
        storeId: storeId
      });
    }
    let cars = Common.getStorage("isAddCar");
    Common.removeStorage("isAddCar");
    if (cars == 1) {
      this.addcart();
    }
    if (cars == 2) {
      this.goPay();
    }
  },
  imageLoad(e) {
    //宽高比
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    });
  },
  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    });
  },
  async hasProduct(pid, sid) {
    let _this = this;
    var parm = {
      productId: pid,
      storeId: `${sid}`
    };
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr;
    try {
      let data = await Common.ajax.post(Api.mall.detail, parm);
      // return data
      return true;
    } catch (err) {
      return false;
    }
  },
  //产品信息
  getInor(pid, sid) {
    let _this = this;
    var parm = {
      productId: pid,
      storeId: `${sid}`
    };
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr;
    Common.request.post(Api.order.detaiOL, parm, function(data) {
      if (data.status == "OK") {
        var list = data.message;
        if (list.productAppDesc) {
          _this.getProductImgs(list.productAppDesc);
        }
        let skuSelected = -1;
        if (data.message.skuList.length > 0) {
          for (let i = 0; i < data.message.skuList.length; i++) {
            if (data.message.skuList[i].product_id == _this.data.productId) {
              skuSelected = i;
              break;
            }
          }
        }
        var x = [];
        if (list.masterPicture) {
          let tem = list.masterPicture;
          x = tem.substring(1, tem.length - 1).split(",");
        } else {
          x = ["https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"];
        }

        let buttonHidden;
        if (list.stockNum > 0) {
          buttonHidden = true;
        } else {
          buttonHidden = false;
        }
        _this.setData({
          buttonHidden,
          proInfor: list,
          skuList: list.skuList,
          skuSelected: skuSelected,
          masterPicture: x
        });
      }
    });
  },
  //已买列表
  getList(sid) {
    let _this = this;
    let parm = {
      storeId: sid
    };
    Common.request.post(Api.order.getOrderCustomer, parm, function(data) {
      if (data.status == "OK") {
        var list = data.rows;
        _this.setData({
          buyList: list
        });
      }
    });
  },
  go_index() {
    let user = Common.getUser()
    if (!user) {
      return Common.gotoHome()
    } else {
      wx.switchTab({
        url: "/pages/store/store"
      });
    }
    
  },
  go_car() {
    let user = Common.getUser()
    if (!user) {
      return Common.gotoHome()
    } else {
      wx.switchTab({
        url: '/pages/exchangeBox/exchangeBox',
      })
    }
  },
  //添加购物车
  addcart: async function() {
    let _this = this;
    let user = Common.getUser();
    let isBinding = user.isBinding;
    if (!user) {
      wx.navigateTo({
        url: "/pages/home/home"
      });
      return;
    } else {
      if (!isBinding) {
        wx.showModal({
          title: "温馨提示",
          content: "为了方便充缴物业费，下单前请先绑定小区哦~",
          cancelText: "再想想",
          confirmText: "绑定小区",
          success(res) {
            if (res.confirm) {
              Common.setStorage(
                "targetUrl1",
                "/pages/store-detail/store-detail?productId=" +
                  _this.data.productId +
                  "&storeId=" +
                  user.storeId
              );
              setTimeout(function() {
                wx.navigateTo({
                  url: "/pages/bindAddress/bindAddress"
                });
              }, 1000);
            }
          }
        });
      } else {
        let parm = {
          userCode: user.userCode,
          productId: _this.data.productId,
          amount: _this.data.amount,
          immediately: 0,
          limitAmount: 1
        };
        let storeId2 = _this.data.storeId;
        if (user.storeId != storeId2) {
          //不同物业
          let hasProduct = await this.hasProduct(
            _this.data.productId,
            user.storeId
          );
          if (!hasProduct) {
            Common.setStorage("Isb", 1);
            //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
            return Common.gotoStore();
          }
        }
        var MD5signStr = Common.md5sign(parm);
        parm.sign = MD5signStr;
        Common.request.post(Api.car.addCart, parm, function(data) {
          if (data.status == "OK") {
            wx.showToast({
              title: "添加成功",
              icon: "none",
              duration: 2000
            });

            let Num = wx.getStorageSync("cartItemsNum") + 1;
            wx.setStorageSync("cartItemsNum", Num);
          } else {
            wx.showToast({
              title: data.message,
              icon: "none",
              duration: 2000
            });
          }
        });
      }
    }
  },
  onShow: async function() {
    let that = this;
    let { productId, storeId } = this.data
    let userCode = Common.getUserCode()
    await this.getShareInfo(userCode, productId, storeId)
    wx.getSystemInfo({
      success: function(res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == "iPhone X") {
          that.setData({
            isIpx: true
          });
        }
      }
    });
  },
  //改变值
  changeNum(e) {
    const self = this;
    let dataset = e.currentTarget.dataset;
    let amount = self.data.amount;
    let requestBuyLimit = 1; //最低购买数量
    if (e.currentTarget.id == "sub" && amount > requestBuyLimit) {
      amount -= 1;
    } else if (e.currentTarget.id == "add") {
      amount += 1;
    }
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value);
      if (value <= requestBuyLimit) {
        amount = requestBuyLimit;
      } else if (value) {
        amount = Math.floor(value);
      }
    }
    self.setData({
      amount: amount
    });
  },
  //选择规格
  toggleSpecs() {
    this.setData({
      popupShow: true
    });
  },
  //关闭规格弹层
  closePopup() {
    this.setData({
      popupShow: false
    });
  },
  //立即购买
  goPay: async function() {
    let _this = this;
    let islogin = Common.isLogin();
    let user = Common.getUser();
    let usecode = user.usecode;
    let isBinding = user.isBinding;
    if (!user) {
      wx.navigateTo({
        url: "/pages/home/home"
      });
      return;
    } else {
      if (!isBinding) {
        wx.showModal({
          title: "温馨提示",
          content: "为了方便充缴物业费，下单前请先绑定小区哦~",
          cancelText: "再想想",
          confirmText: "绑定小区",
          success(res) {
            if (res.confirm) {
              Common.setStorage(
                "targetUrl",
                "/pages/store-detail/store-detail?productId=" +
                  _this.data.productId +
                  "&storeId=" +
                  user.storeId
              );
              Common.setStorage("isAddPay", 1);
              setTimeout(function() {
                wx.navigateTo({
                  url: "/pages/bindAddress/bindAddress"
                });
              }, 1000);
            }
          }
        });
      } else {
        let parm = {
          userCode: user.userCode,
          productId: _this.data.productId,
          amount: _this.data.amount,
          immediately: 1,
          limitAmount: 1
        };
        let storeId2 = _this.data.storeId;
        if (user.storeId != storeId2) {
          //不同物业
          let hasProduct = await this.hasProduct(
            _this.data.productId,
            user.storeId
          );
          if (!hasProduct) {
            //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
            Common.setStorage("Isb", 1);
            return Common.gotoStore();
          }
        }
        var MD5signStr = Common.md5sign(parm);
        parm.sign = MD5signStr;

        Common.request.post(Api.car.addCart, parm, data => {
          _this.closePopup();
          if (data.status == "OK") {
            wx.navigateTo({
              url: "/pages/fillOrder/fillOrder"
            });
          } else {
            wx.showToast({
              title: data.message,
              icon: "none",
              duration: 2000
            });
          }
        });
      }
    }
  },
  //规格change
  productChange(e) {
    const _this = this;
    let index = e.currentTarget.dataset.index;
    if (!index && index != 0) return;
    let productId = _this.data.skuList[index].product_id;
    _this.setData({
      productId: productId.toString(),
      proInfor: [],
      popupShow: false
    });
    this.getInor(productId.toString(), this.data.storeId);
    this.getList(this.data.storeId);
  },
  //详情图片
  getProductImgs(desc) {
    const _this = this;
    if (!desc) return;
    var regGetBQ = /<img\b.*?(?:\>|\/>)/gi;
    var regGetUrl = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arrBQ = desc.match(regGetBQ);
    var arr = [];
    arrBQ.forEach(item => {
      arr.push(item.match(regGetUrl)[1]);
    });
    _this.setData({
      productImgs: arr
    });
  },
  errImg: function(e) {
    let _this = this;
    var index = e.target.dataset.index;
    var errObj = [];
    errObj = "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png";
    this.data.masterPicture[index] = errObj;
    this.setData({
      masterPicture: this.data.masterPicture
    });
  }
});
