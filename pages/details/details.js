// pages/details/details.js
const Common = require('../../utils/common');
var Api = require("../../utils/api");
var imageUtil = require('../../utils/util.js');
// var json = require('../../data/home_data.js')
var app = getApp();
let {
  regeneratorRuntime
} = global

Page({
  data: {
    buttonHidden: true,
    buttonText: '',
    proInfor: [], //商品信息
    isIpx: true,
    indicatorDots: false, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 2000, //滑动时间
    productId: '', //产品ＩＤ
    storeId: '', //商户ＩＤ
    buyList: [], //已买列表
    popupShow: false, //规格是否显示
    userId: 150, //用户ＩＤ
    skuList: [], //规格列表
    amount: 1, //产品数量
    skuSelected: -1, //已选规格
    productImgs: [], //详情
    masterPicture: [], //轮播图
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    imgheights: [],
    current: 0,
    isIpx: false,
    shareIn: {
      title: '',
      imageUrl: '',
    }
  },
  onShareAppMessage: function(res) {
    let {
      productId,
      storeId,
      proInfor
    } = this.data
    let userCode = Common.getUserCode()
    let user = Common.getUser()
    let userInfo = Common.getStorage('userInfo')
    Common.setStorage("isShare", 1)
    Common.getStorage('Isb', 1)
    let usersName = userInfo.nickName || ''
    let title = this.data.shareIn.title || `${usersName}向您推荐${proInfor.productTitle}`
    let imageUrl = this.data.shareIn.imageUrl || ''
    console.log("res:", res)
    console.log("title:", title)
    return {
      title,
      imageUrl,
      path: `pages/details/details?isShare=1&shareUserCode=${userCode}&shareProductId=${productId}&shareStoreId=${storeId}`
    }
  },
  async getShareInfo(userCode, productId, storeId) {
    let _this = this
    var parm = {
      sourceType: 13,
      shareProductId: productId,
      shareStoreId: storeId
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
    // if (!user) {
    //   Common.setStorage('targetUrl', `pages/details/details?isShare=1&shareProductId=${options.productId}&shareStoreId=${options.storeId}`)
    //   return Common.gotoHome(); //登录以后跳详情todo
    // }
    let isS = options.isShare
    Common.setStorage("isS", isS)
    console.log("options:", options, "isShare", isS)
    if ((options && options.isShare) || isS) {
      console.log('分享進入')
      Common.removeStorage("isShare")
      let shareUserCode = options.shareUserCode || Common.getStorage('shareUserCode')
      let shareStoreId = options.shareStoreId || Common.getStorage('shareStoreId')
      let shareProductId = options.shareProductId || Common.getStorage('shareProductId')
      Common.setStorage('shareUserCode', shareUserCode)
      Common.setStorage('shareStoreId', shareStoreId)
      Common.setStorage('shareProductId', shareProductId)
      Common.setStorage('targetUrl', `/pages/details/details?isShare=1&shareUserCode=${shareUserCode}&shareProductId=${shareProductId}&shareStoreId=${shareStoreId}`)
      let user = Common.getUser()
      let islogin = Common.getStorage('islogin')
      console.log('分享者storeid', shareStoreId, '接受者storeid', user.storeId, '分享的产品ID:', shareProductId)
      console.log('是否绑定:', user.isBinding)
      // if (!islogin) {
      //   console.log('详情跳转')
      //   console.log('not login')
      //   return Common.gotoHome() //登录以后跳详情todo
      // }
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
      if (user.storeId != shareStoreId) { //不同物业
        console.log('不同物业')
        let hasProduct = await this.hasProduct(shareProductId, user.storeId)
        console.log('hasProduct===', hasProduct)
        if (!hasProduct) {
          Common.setStorage('Isb', 1)
          //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
          console.log('没有商品')
          return Common.gotoIndex()
        } else {
          console.log('有商品')
          this.getInor(shareProductId, user.storeId)
          this.getList(user.storeId)
          this.setData({
            productId: shareProductId,
            storeId: user.storeId
          })
        }
      } else {
        console.log('相同物业')
        this.getInor(shareProductId, user.storeId)
        this.getList(user.storeId)
        this.setData({
          productId: shareProductId,
          storeId: user.storeId
        })
      }
    } else {
      console.log('正常進入')
      let that = this
      let {
        userCode,
        storeId,
        productId
      } = options
      let StStoreId = Common.getStorage('storeId')
      console.log('StStoreId', StStoreId)
      if (StStoreId) {
        if (options.productId != StStoreId) { //不同物业
          console.log('不同物业')
          let hasProduct = await this.hasProduct(options.productId, options.storeId)
          console.log('hasProduct===', hasProduct)
          if (!hasProduct) {
            Common.setStorage('Isb', 1)
            //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
            console.log('没有商品')
            return Common.gotoIndex()
          } else {
            console.log('有商品')
            this.getInor(options.productId, options.storeId)
            this.getList(options.storeId)
            this.setData({
              productId: options.productId,
              storeId: options.storeId
            })
          }
        } else {
          console.log('相同物业')
          this.getInor(options.productId, options.storeId)
          this.getList(options.storeId)
          this.setData({
            productId: options.productId,
            storeId: options.storeId
          })
        }
        that.getInor(productId, options.storeId)
        that.getList(options.storeId)
        that.setData({
          productId: productId,
          storeId: options.storeId
        })
        console.log(options)
      } else {
        that.getInor(productId, storeId)
        that.getList(storeId)
        that.setData({
          productId: productId,
          storeId: storeId
        })
        console.log(options)
      }
      console.log('storeId::::', storeId, 'productId:::', productId)
      console.log(options)
    }
  },
  imageLoad(e) {
    //宽高比 
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  async hasProduct(pid, sid) {
    let _this = this
    var parm = {
      productId: pid,
      storeId: `${sid}`
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    console.log('hasProduct')
    try {
      console.log('try')
      console.log('parm', parm)
      let data = await Common.ajax.post(Api.order.detai, parm)
      console.log('接口返回數據：', data)
      // return data
      return true
    } catch (err) {
      console.log('----false---')
      return false
    }
  },
  //产品信息
  getInor(pid, sid) {
    console.log('-------getInor---!!-----', pid, sid)
    let _this = this
    var parm = {
      productId: pid,
      storeId: `${sid}`
    }
    var MD5signStr = Common.md5sign(parm);
    parm.sign = MD5signStr
    console.log('-------parm---!!-----', parm)
    Common.request.post(Api.order.detai, parm, function(data) {
      console.log('getInor:', data)
      if (data.status == 'OK') {
        var list = data.message
        console.log('list', list)
        if (list.productAppDesc) {
          _this.getProductImgs(list.productAppDesc)
        }
        let skuSelected = -1
        if (data.message.skuList.length > 0) {
          for (let i = 0; i < data.message.skuList.length; i++) {
            if (data.message.skuList[i].product_id == _this.data.productId) {
              skuSelected = i
              break;
            }
          };
        }
        var x = []
        if (list.masterPicture) {
          let tem = list.masterPicture
          x = tem.substring(1, tem.length - 1).split(',')
        } else {
          x = ['https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png']
        }

        let buttonHidden;
        if (list.stockNum > 0) {
          buttonHidden = true
        } else {
          buttonHidden = false
        }
        _this.setData({
          buttonHidden,
          proInfor: list,
          skuList: list.skuList,
          skuSelected: skuSelected,
          masterPicture: x
        })
        // console.log(_this.data.masterPicture)
      } else {
        //没有商品
        // return Common.gotoIndex()
        console.log('b:', data)
      }
    })
  },
  //已买列表
  getList(sid) {
    let _this = this
    let parm = {
      storeId: sid
    }
    Common.request.post(Api.order.getOrderCustomer, parm, function(data) {
      if (data.status == 'OK') {
        var list = data.rows
        _this.setData({
          buyList: list
        })
      } else {
        // console.log(data)
      }
    })
  },
  go_index() {
    let user = Common.getUser()
    if (!user) {
      return Common.gotoHome()
      return
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  go_car() {
    let user = Common.getUser()
    if (!user) {
      return Common.gotoHome()
      return
    } else {
      wx.switchTab({
        url: '/pages/exchangeBox/exchangeBox',
      })
    }
  },
  //添加购物车
  addcart: async function() {
    await Common.goToLogin()
    let _this = this
    let islogin = Common.isLogin()
    let user = Common.getUser()
    let userCode = user.userCode
    let isBinding = user.isBinding
    if (!userCode) {
      return Common.gotoHome()
    } else {
      if (!isBinding) {
        wx.showModal({
          title: '温馨提示',
          content: '为了方便充缴物业费，下单前请先绑定小区哦~',
          cancelText: '再想想',
          confirmText: '绑定小区',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              Common.setStorage('targetUrl', '/pages/details/details?productId=' + _this.data.productId + '&storeId=' + user.storeId)
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/bindAddress/bindAddress',
                })
              }, 1000)
            } else if (res.cancel) {
              console.log('用户点击取消')
              return;
            }
          }
        })
      } else {
        let parm = {
          userCode: user.userCode,
          productId: _this.data.productId,
          amount: _this.data.amount,
          immediately: 0,
          limitAmount: 1
        }
        let storeId2 = _this.data.storeId;
        console.log('storeId01::::', user.storeId, 'storeId02:::', _this.data.storeId)
        console.log('productId02:::', _this.data.productId)
        if (user.storeId != storeId2) { //不同物业
          let hasProduct = await this.hasProduct(_this.data.productId, user.storeId)
          console.log('hasProduct===', hasProduct)
          if (!hasProduct) {
            Common.setStorage('Isb', 1)
            //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
            return Common.gotoIndex()
            console.log('没有商品')
          }
        }
        console.log(parm)
        var MD5signStr = Common.md5sign(parm);
        parm.sign = MD5signStr
        Common.request.post(Api.car.addCart, parm, function(data) {
          if (data.status == 'OK') {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            })

            let Num = wx.getStorageSync('cartItemsNum') + 1;
            wx.setStorageSync('cartItemsNum', Num);
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  },
  onShow: async function() {
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#ff0000',
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    // wx.setNavigationBarTitle({
    //   title: '商品详情'
    // })
    Common.setStorage('Isb', 0)
    let that = this
    let {
      productId,
      storeId
    } = this.data
    let userCode = Common.getUserCode()
    let user = Common.getUser()
    let cars = Common.getStorage('isAddCar')
    Common.removeStorage('isAddCar')
    console.log(cars + "isAddCars")
    await this.getShareInfo(userCode, productId, storeId)
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X') {
          that.setData({
            isIpx: true
          })
        }
      }
    })
  },
  //改变值
  changeNum(e) {
    const self = this
    let dataset = e.currentTarget.dataset
    let index = dataset.index;
    let amount = self.data.amount
    let requestBuyLimit = 1; //最低购买数量
    if (e.currentTarget.id == "sub" && amount > requestBuyLimit) {
      amount -= 1;
    } else if (e.currentTarget.id == "add") { //&& amount < self.data.proInfor.stockNum
      amount += 1;
    }
    if (e.currentTarget.id == "input") {
      let value = Math.floor(e.detail.value)
      if (value <= requestBuyLimit) {
        amount = requestBuyLimit
      } else if (value) {
        amount = Math.floor(value)
      }
      //  else if (value > self.data.proInfor.stockNum) {
      //   amount = self.data.proInfor.stockNum
      // }
    }
    self.setData({
      amount: amount
    })
  },
  //选择规格
  toggleSpecs() {
    this.setData({
      popupShow: true,
    })
  },
  //关闭规格弹层
  closePopup() {
    this.setData({
      popupShow: false,
    })
  },
  //立即购买
  goPay: async function() {
    // await Common.goToLogin()
    let _this = this
    let islogin = Common.isLogin()
    let user = Common.getUser()
    if (user == "用户不存在") {
      Common.goToLogin()
      return false;
    }
    let userCode = user.userCode
    console.log('user:', user)
    let isBinding = user.isBinding
    if (!userCode) {
      return Common.goToLogin()
    } else {
      if (!isBinding) {
        wx.showModal({
          title: '温馨提示',
          content: '为了方便充缴物业费，下单前请先绑定小区哦~',
          cancelText: '再想想',
          confirmText: '绑定小区',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              Common.setStorage('targetUrl', '/pages/details/details?productId=' + _this.data.productId + '&storeId=' + user.storeId)
              Common.setStorage('isAddPay', 1)
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/bindAddress/bindAddress',
                })
              }, 1000)

            } else if (res.cancel) {
              console.log('用户点击取消')
              return;
            }
          }
        })
      } else {
        let parm = {
          userCode: user.userCode,
          productId: _this.data.productId,
          amount: _this.data.amount,
          immediately: 1,
          limitAmount: 1
        }
        let storeId2 = _this.data.storeId;
        console.log('storeId', user.storeId)
        console.log('storeId2', storeId2)
        if (user.storeId != storeId2) { //不同物业
          let hasProduct = await this.hasProduct(_this.data.productId, user.storeId)
          console.log('hasProduct===', hasProduct)
          if (!hasProduct) {
            //如果此物业此商品为0 跳到首页 如果不为0则进入当前商品详情页面
            console.log('没有商品')
            return Common.gotoIndex()
          }
        }
        var MD5signStr = Common.md5sign(parm);
        parm.sign = MD5signStr
        Common.request.post(
          Api.car.addCart, parm,
          (data) => {
            _this.closePopup()
            if (data.status == 'OK') {
              wx.navigateTo({
                url: "/pages/fillOrder/fillOrder"
              })
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none',
                duration: 2000
              })
            }
          }
        );
      }
    }

  },
  //规格change
  productChange(e) {
    const _this = this
    let index = e.currentTarget.dataset.index
    if (!index && index != 0) return
    let productId = _this.data.skuList[index].product_id
    _this.setData({
      productId: productId.toString(),
      proInfor: [],
      popupShow: false
    })
    this.getInor(productId.toString(), this.data.storeId)
    this.getList(this.data.storeId)
  },
  //详情图片
  getProductImgs(desc) {
    const _this = this
    if (!desc) return {
      srcs: []
    };
    var regGetBQ = /<img\b.*?(?:\>|\/>)/gi;
    var regGetUrl = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arrBQ = desc.match(regGetBQ);
    var arr = [];
    arrBQ.forEach(item => {
      arr.push(item.match(regGetUrl)[1]);
    });
    _this.setData({
      productImgs: arr
    })
  },
  errImg: function(e) {
    let _this = this
    console.log(e)
    // Common.errImgFun(e, _this);
    var index = e.target.dataset.index
    var errObj = []
    errObj = "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
    this.data.masterPicture[index] = errObj
    this.setData({
      masterPicture: this.data.masterPicture
    })
  },
})