var md5 = require("md5/js-md5")
var md5Sign = require("md5/sign")
var Api = require("api")
const app = getApp()
let {
  regeneratorRuntime
} = global

var common = {
  appkey: "3721zhkj",
  error: {
    api: {}
  },
  ajax: {},
  request: {},
  response: {
    check: {}
  },

  biz: {
    loggedIn: {} //检查是否登录
  },
  miscellaneous: {
    getSign: {},
    signedParams: {}
  }
}
common.getRoute = function () {
  let pages = getCurrentPages();
  let currPage = {};
  if (pages.length) {
    currPage = pages[pages.length - 1];
  }
  console.log('currPage.route:', currPage.route)
  return currPage.route || null
}
common.nearHousing=function() {
  let that = this
  // console.log(that.data)
  let latitude = common.getStorage('latitude').toString()
  let longitude = common.getStorage('longitude').toString()
  let url = Api.housing.nearestStore
  let params = {
    longitude,
    latitude
  }
  let MD5sign = common.md5sign(params);
  params.sign = MD5sign;
  common.request.post(url, params, function (data) {
    if (data.status == "OK") {
      let user=common.getStorage('user')
      console.log('****user==--==', user)
      console.log(data);
      let dwaddress = data.message.address
      let storeId = data.message.storeId
      let wyname = data.message.storeName
      common.setStorage('user', Object.assign(user, { wyname: wyname }))
      common.setStorage('user', Object.assign(user, { storeId: storeId }))
      common.setStorage('user', Object.assign(user, { dwaddress: dwaddress }))
      common.saveUser(user)
      common.gotoIndex()
      console.log('--==--==user==--==', user)
    }
  })
}
common.gotoStore=function(){
  wx.switchTab({
    url: '/pages/store/store',
  })
}
common.getMyHousing=function(){
  let that = this
  var url = Api.housing.myHousing
  let user = common.getUser() || common.getStorage('user');
  console.log('user==', user)
  let userCode = user.userCode
  var parm = {
    userCode
  }
  let MD5signStr = common.md5sign(parm);
  parm.sign = MD5signStr
  common.request.post(Api.housing.myHousing, parm, function (data) {
    if (data.status == 'OK') {
      // console.log(data)
      let MyHousing = data.message
      let isBingHouse = MyHousing.isBinDing
      let address = MyHousing.address // 用户详细地址
      let cellPhone = MyHousing.cellPhone //物业电话
      let housingCode = MyHousing.housingCode //缴费户号
      let storeAddress = MyHousing.storeAddress //小区地址
      let storeName = MyHousing.storeName    //物业名称
      let customerName = MyHousing.customerName //用户名称
      let housingAddress = storeName + ' (' + storeAddress + ')' //拼接的 物业+小区地址
      let myAddress = storeAddress + '(' + address + ')'// 用户详细地址
      // let residualFee = MyHousing.residualFee //欠费金额
      let isBinDing = MyHousing.isBinDing //1已绑定 0是未绑定
      let storeId = MyHousing.storeId
      that.setData({
        address,
        storeName,
        storeAddress,
        storeId,
        cellPhone,
        housingCode,
        housingAddress,
        customerName,
        myAddress,
        isBinDing
      })
    }
  })
}
common.GoWechat=function(nickName, imageUrl) {
  let that = this
  console.log(nickName, imageUrl)
  let targetUrl = common.getStorage('targetUrl')
  let targetUrl1 = common.getStorage('targetUrl1')
  let targetUrl2 = common.getStorage('targetUrl2')
  wx.login({
    success(res) {
      if (res.code) {
        let params = {
          jsCode: res.code,
        }
        let MD5signStr = common.md5sign(params);
        let reqParams = {
          sign: MD5signStr,
          ...params
        }
        //发起网络请求
        wx.request({
          url: Api.user.wXLogin,
          method: 'post',
          data: reqParams,
          success(res) {
            console.log(res)
            let user= res.data.message
            if (user.wxBindStatus){
                if(user.isBinding){
                  common.setStorage('user', user);
                }else{
                  common.nearHousing();
                }
              common.gotoIndex()
            }else{
              common.gotoLogin()
            }
            common.setWxOpenId(res.data.message.wxOpenId)
          },
          fail(err) {
            wx.showToast({
              title: err,
              icon: 'none'
            })
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    },
    fail(err) {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    }
  })
},
common.biz.loggedIn = function (redirectUrl) {
  console.log('redirectUrl:', redirectUrl)
  // let user = app.globalData.userInfo
 let user =  common.getUser()
  console.log('index:user', user)
  if (
    user == '' ||
    user == null ||
    user == undefined ||
    user.cellPhone == null ||
    user.cellPhone == ''
  ) {
    if (redirectUrl) {
      if (redirectUrl == "currentPage") {
        wx.navigateTo({
          url: '/pages/home/home?jumpUrl=' + encodeURIComponent(common.getFullPath()),
        })
      } else {
        console.log('不是当前页面')
        wx.navigateTo({
          url: '/pages/home/home?jumpUrl=' + encodeURIComponent(redirectUrl),
        })
      }

    }
    return false
  } else {
    return true
  }
}
common.getFullPath = function () {
  let pages = getCurrentPages();
  let currPage = {};
  if (pages.length) {
    currPage = pages[pages.length - 1];
  }
  let queryString = ''
  for (var index in currPage.options) {
    queryString += index + '=' + currPage.options[index] + '&'
  }
  queryString = queryString.substr(0, queryString.length - 1)
  if (queryString) {
    return "/" + currPage.route + '?' + queryString
  } else {
    return "/" + currPage.route
  }
}

common.error.api = function (message) {
  this.name = 'api'
  this.message = message || 'Default Message'
  this.stack = new Error().stack
}
common.error.api.prototype = Object.create(Error.prototype)
common.error.api.prototype.constructor = common.error.api
/**
 * @synopsis zhkj-api-签名算法
 *
 * @param params 需要被签名的接口参数对象
 *
 * @returns 访问api需要的签名
 */
common.miscellaneous.getSign = params => {
  console.log("params:",params)
  var data = md5Sign.raw(params) + '&key=' + common.appkey
  console.log('ddata',data)
  return md5(data).toUpperCase()
}
/** 
 * @synopsis zhkj-api-签名算法
 *
 * @param params 需要对象被签名的对象
 *
 * @returns
 */
common.miscellaneous.signedParams = params => {
  console.log('signedParams')
  console.log('params')
  var sign = common.miscellaneous.getSign(params)
  console.log(params)
  console.log(sign)
  return Object.assign(params, { sign: sign.toString() })
}
common.getparam = function (data) {
  let param = {};
  for (let item in data) {
    param[item] = data[item];
  }
  param['sign'] = common.md5sign(data);
  return param;
},
  common.md5sign = function (data) {
    let ret = [];
    let str = '';
    let obj = {};
    for (let item in data) {
      ret.push(item.toLowerCase());
      obj[item.toLowerCase()] = item;
    }
    ret.sort();
    for (let key in ret) {
      let _key = obj[ret[key]];
      let res = data[_key];
      if (str === '') {
        str = _key + '=' + res;
      } else {
        str += '&' + _key + '=' + res;
      }
    }
    str += '&key=' + common.appkey;
    let sign = md5(str).toUpperCase();
    return sign;
  },

  common.request.localLogin = function (data, callback, errorcallback) {
    let url = Api.customer.login
    let newdata = { cellPhone: data.cellPhone, passWord: data.passWord }
    newdata = common.miscellaneous.signedParams(newdata)
    wx.request({
      url: url,
      method: "GET",
      data: newdata,
      success: function (res) {
        if (res.data.status === "OK") {
          let url = Api.customer.getUserCenter
          function md5sign(data) {
            let ret = [];
            let str = '';
            let obj = {};
            for (let item in data) {
              ret.push(item.toLowerCase());
              obj[item.toLowerCase()] = item;
            }
            ret.sort();
            for (let key in ret) {
              let _key = obj[ret[key]];
              let res = data[_key];
              if (str === '') {
                str = _key + '=' + res;
              } else {
                str += '&' + _key + '=' + res;
              }
            }
            str += '&key=' + common.appkey;
            let sign = md5(str).toUpperCase();
            return sign;
          }

          let MD5signStr = md5sign({
            customerCode: res.data.message.customerCode,
          });
          let customerCode = res.data.message.customerCode
          wx.request({
            url: Api.customer.getUserCenter + '?customerCode=' + res.data.message.customerCode + '&sign=' + MD5signStr,
            method: 'POST',
            success(res) {
              if (res.data.status === "OK") {
                var user = res.data.message
                var name = user.userName
                user['customerCode'] = customerCode
                var tokenStr = encodeURIComponent(JSON.stringify(user))
                var token = "token=" + tokenStr + "; name=" + name
                wx.setStorage({//保存cookie 到storage
                  key: "token",
                  data: token
                })

                wx.setStorage({//保存cookie 到storage
                  key: "user",
                  data: user
                })
                app.globalData.token = token
                app.globalData.userInfo = user
                if (callback) {
                  callback(res.data.message)
                } else {
                  wx.switchTab({
                    url: "../index/index"
                  })
                }
              }
            }
          })
          // self.setData({
          //   beanAmount: data.message.beanAmount
          // })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        return;
      }
    })
  }

common.request.get = function (url, params, callback, errorcallback) {
  wx.showLoading()
  wx.request({
    url: url,
    header: {
      'Cookie': app.globalData.token//用户信息
    },
    method: "GET",
    data: params,
    success: function (res) {
      wx.hideLoading()
      if (res.data.status && res.data.status == "OK") {
        if (callback) {
          callback(res.data)
        }
        return;
      } else {
        wx.showToast({
          title: JSON.stringify(res.data.message),
          icon: 'none',
          duration: 1500
        })
      }
    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1500
      })
    },
  })
}

common.request.post = function (url, params, callback, errorcallback, contype) {
  let headtype = ''
  if (contype == 1) {
    headtype = 'application/x-www-form-urlencoded'
  } else {
    headtype = 'application/json;charset=UTF-8'
  }
  wx.showLoading()
  wx.request({
    url: url,
    method: "POST",
    header: {
      'Cookie': app.globalData.token,//用户信息
      'Content-Type': headtype
    },
    data: params,
    success: function (res) {
      wx.hideLoading()
      if (res.data.status && res.data.status == "OK") {
        if (callback) {
          callback(res.data)
        }
        return;
      } else {
        wx.showToast({
          title: JSON.stringify(res.data.message),
          icon: 'none',
          duration: 1500
        })
      }

    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误！',
        icon: 'none',
        duration: 1500
      })
    },
  })
}

common.ajax.get = function (url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: {
        'Cookie': app.globalData.token//用户信息
      },
      method: "GET",
      data: params,
      success: function (res) {
        if (res.data.status && res.data.status == "OK") {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误！',
          icon: 'none',
          duration: 1500
        })
      },
    })
  })

}
common.ajax.post = function (url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: "POST",
      header: {
        'Cookie': app.globalData.token,//用户信息
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: params,
      success: function (res) {
        if (res.data.status && res.data.status == "OK") {
          resolve(res.data)
        } else {
          reject(res.data)
        }

      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误！',
          icon: 'none',
          duration: 1500
        })
      },
    })
  })

}

//密码登录
common.pwdLogin = function ({ cellphone, password }) {
  let url = Api.user.login
  let params = { cellPhone: cellphone, passWord: password }
  let MD5signStr = this.md5sign(params);
  let reqParams = { sign: MD5signStr, ...params }
  try {
    return this.ajax.post(url, reqParams)
  } catch (err) {
    this.showToast(err.message)
  }
}
common.showToast = function (message) {
  wx.showToast({
    title: message,
    icon: 'none'
  })
}
common.goback = () => {
  wx.navigateBack({
    delta: 1
  })
}
common.gotoCustom = function (jumpurl) {
  let isTabBar = this.isTabBar(jumpurl)
  if (isTabBar) {
    wx.switchTab({
      url: jumpurl
    })
  } else {
    wx.navigateTo({
      url: jumpurl
    })
  }

}
common.isTabBar=function(jumpurl) {
  // /pages/owner / owner
  let urlarr = jumpurl.split('/')
  let pageName = urlarr[urlarr.length - 1]
  if (pageName == 'index' || pageName == 'owner' || pageName == 'order' || pageName == 'exchangeBox' || pageName == 'store') {
    return true
  } else {
    return false;
  }
}

common.showStorageError = () => {
  wx.showToast({
    title: '设置错误',
    icon: 'none'
  })
}
common.setStorage = function (key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    this.showStorageError()
  }
}
common.getStorage = function (key) {
  try {
    var value = wx.getStorageSync(key)
    if (value) {
     return value
    } else{
      return ''
    }
  } catch (e) {
    this.showStorageError()
  }
}

common.removeStorage=function(key){
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    wx.showModal({
      title: '删除userCode失败',
      showCancel: false
    })
  }
}
common.clearStorage=function(){
  try {
    wx.clearStorageSync()
  } catch (e) {
    wx.showModal({
      title: '清理缓存失败',
      showCancel: false
    })
  }
}

common.isLogin = function () {
  return this.getStorage('islogin')
}
common.saveLogin = function () {
  this.setStorage('islogin', 1)
}
common.removeLogin=function(){
  this.setStorage('islogin', 0)
}
common.saveUser = function (user) {
  this.setStorage('user', user)
}
common.gotoLogin = function () {
  wx.navigateTo({
    url: '/pages/user/codelogin/codelogin'
  })
}
common.gotoHome = function () {
  wx.navigateTo({
    url: '/pages/home/home'
  })
}
common.goToLogin = function () {
  let userCode = common.getUserCode()
  if (userCode) {
    return true;
  } else {
    wx.redirectTo({
      url: '/pages/home/home',
    })
    return false
  }
}
common.gotoBind=function() {
  wx.navigateTo({
    url: '/pages/bindAddress/bindAddress'
  })
}
common.gotoIsLogin = function(){
  wx.redirectTo({
    url: '/pages/isLogin/isLogin',
  })
}
common.gotoIndex = function () {
  wx.switchTab({
    url: '/pages/index/index'
  })
}
common.gotoOwner = function () {
  wx.switchTab({
    url: '/pages/owner/owner'
  })
}
common.getUserFromApi=async function(userCode){
  console.log("userCode:", userCode)
  let url = Api.housing.getUser
  let params = {
    userCode
  }
  let MD5signStr = this.md5sign(params);
  let reqParams = { sign: MD5signStr, ...params }
  console.log("reqParams:", reqParams)
  return this.ajax.post(url, reqParams)
},

common.getUser = function () {
  return this.getStorage('user')
}
common.getStoreId = function () {
  return this.getStorage('storeId')
}
common.getWxOpenId = function () {
  return this.getStorage('openid')
}
common.getUserCode = function () {
  return this.getStorage('userCode')
}

common.setWxOpenId = function (openid) {
  this.setStorage('openid', openid)
}
common.setUserCode=function(value){
  this.setStorage('userCode',value)
}
common.validPassword=function(password) {
  // let reg = /^[A-Za-z0-9]{6,}|[A-Za-z0-9~!@#$^&*()=|{}]{6,}$/
  let reg = /(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}|(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}[A-Za-z0-9~!@#$^&*()=|{}]{6,}/
  return reg.test(password)
},


//-----------------------------//


common.response.check = function (res) {
  if (res.status === 200) {
    //请求正确返回
    if (res.data.status === 'OK') {
      //接口正确返回
      return true
    } else {
      throw new common.error.api(res)
    }
  } else {
    throw 'network error'
  }
}
common.bd_decrypt = function (bd_lng, bd_lat) {
  //百度地图坐标转腾讯(高德)
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat };
}
common.encodeUTF8 = function (s) {
  let i,
    r = [],
    c,
    x
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c)
    else if (c < 0x800) r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f))
    else {
      if ((x = c ^ 0xd800) >> 10 == 0)
        //对四字节UTF-16转换为Unicode
        (c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000),
          r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f))
      else r.push(0xe0 + ((c >> 12) & 0xf))
      r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f))
    }
  return r
}

// 字符串加密成 hex 字符串
common.sha1 = function (s) {
  var data = new Uint8Array(common.encodeUTF8(s))
  var i, j, t
  var l = (((data.length + 8) >>> 6) << 4) + 16,
    s = new Uint8Array(l << 2)
  s.set(new Uint8Array(data.buffer)), (s = new Uint32Array(s.buffer))
  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3
  var w = [],
    f = [
      function () {
        return (m[1] & m[2]) | (~m[1] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      },
      function () {
        return (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      }
    ],
    rol = function (n, c) {
      return (n << c) | (n >>> (32 - c))
    },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776]
    ; (m[2] = ~m[0]), (m[3] = ~m[1])
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0)
    for (j = 0; j < 80; j++)
      (w[j] =
        j < 16
          ? s[i + j]
          : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)),
        (t =
          (rol(m[0], 5) + f[(j / 20) | 0]() + m[4] + w[j] + k[(j / 20) | 0]) |
          0),
        (m[1] = rol(m[1], 30)),
        m.pop(),
        m.unshift(t)
    for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0
  }
  t = new DataView(new Uint32Array(m).buffer)
  for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2)

  var hex = Array.prototype.map
    .call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? '0' : '') + e.toString(16)
    })
    .join('')
  return hex
}
//获取当前定位城市及编号
common.getLocation = function (callback) {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      const speed = res.speed
      const accuracy = res.accuracy
      let url = Api.customer.getCityByLngAndLat + '?longitude=' + longitude + '&latitude=' + latitude
      common.request.get(Api.customer.getCityByLngAndLat, {
        longitude: longitude,
        latitude: latitude
      }, data => {
        app.globalData.location = data.message
        if (callback) {
          callback(data.message)
        }
      })
    }
  })
}

//获取验证码
common.NewAuthCode = function (datas) {
  let url = Api.newCustomer.newgetmsAuthCode
  let sign = common.md5sign({
    cellPhone: datas.cellPhone,
    type: datas.type,
    token: datas.token
  })

  common.request.get(url, {
    cellPhone: datas.cellPhone,
    type: datas.type,
    sign: sign,
    token: datas.token
  }, function (data) {
    console.log(data)
    if (data.status == 'OK') {
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        content: data.message,
        showCancel: false,
        confirmColor: '#e61817',
      })
    }
  })
}
//倒计时
common.codeTime = function (_this) {
  let TIME_COUNT = 61
  if (!_this.timer) {
    console.log('TIME_COUNT', TIME_COUNT)
    _this.count = TIME_COUNT;
    _this.timer = setInterval(() => {
      if (_this.count > 1 && _this.count <= TIME_COUNT) {
        _this.count--
        _this.setData({
          codeTxt: _this.count + 's重新获取',
          btnDisabled: true
        })
      } else {
        clearInterval(_this.timer);
        _this.setData({
          codeTxt: '重新获取',
          btnDisabled: false,
          captchaReload: true
        })
        _this.timer = null;
      }
    }, 1000)
  }
}
common.VerifyPhone = function (val) {
  return /^[0-9]{11}$/.test(val)
}
common.cityData = function (callback) {
  common.request.get(Api.customer.addressData, { params: { type: 1 } }, function (data) {
    if (data.status == 'OK') {
      callback(data.message)
    }
  })
}
common.errImgFun = function (e, that) {
  var _errImg = e.target.dataset.img;
  var _errObj = {};
  _errObj[_errImg] = "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png";
  that.setData(_errObj);
}
common.callPay = function (params, type, orderId) { //支付
    wx.requestPayment({
      timeStamp: params.timeStamp, // 时间戳，自1970年以来的秒数
      nonceStr: params.nonceStr, // 随机串
      package: params.package,
      signType: params.signType, // 微信签名方式：
      paySign: params.paySign, // 微信签名
      success(res) {
        wx.redirectTo({
          url: `/pages/ReturnRequest/rerurnSuccess/rerurnSuccess?orderId=${orderId}`
        })
      },
      fail(res) {
        wx.redirectTo({
          url: `/pages/ReturnRequest/returnfail/returnfail?orderId=${orderId}`
        })
      }
    })
}

common.setTabBar = function (that)
{
  let Num = 0;
  if (!wx.getStorageSync('cartItemsNum'))
  {
    let userCode = common.getUser().userCode || common.getStorage('userCode');
    let storeId = common.getUser().storeId || common.getStorage('storeId') ||common.storeId2();
    if (storeId == '' || storeId == null || storeId == undefined || storeId == 'NaN' || storeId == 0 || storeId == -1) {
      storeId = common.storeId2()
    }
    common.request.get(Api.car.queryCart, { userCode: userCode, storeId: storeId},
      function (data) {
        if (data.status == "OK") {
          let exboxList = [];
          let proList = data.message.sellingItems || [];
          var checkAllFlag = true;
          for (let i = 0; i < proList.length; i++) {
            Num += proList[i].amount;
            exboxList.push({
              productId: proList[i].productid,
              title: proList[i].sku.productName,
              image: proList[i].sku.imageUrl,
              price: proList[i].sku.price,
              value: proList[i].amount
            })
          }
          let invalidList = data.message.haltSellItems || [];
          for (let i = 0; i < invalidList.length; i++) {
            console.log('---invalidList[i].amount', invalidList[i].amount)
            Num += invalidList[i].amount;
            console.log('===Num', Num)
            exboxList.push({
              productId: invalidList[i].productid,
              title: invalidList[i].sku.productName,
              image: invalidList[i].sku.imageUrl,
              price: invalidList[i].sku.price,
              value: invalidList[i].amount
            })
          }
            //更新缓存数据
          wx.setStorageSync("cartItemsNum", Num)
          wx.setStorageSync("cartItems", exboxList)
          if (Num <= 0) {
            wx.removeTabBarBadge({
              index: 3,
            });
          } else {
            wx.setTabBarBadge({
              index: 3,
              text: new Number(Num).toString(),
            })
          }
        }
      })
  }else
  {
    Num = wx.getStorageSync('cartItemsNum')
    console.log("Num----", Num)
    if (Num <= 0) {
      wx.removeTabBarBadge({
        index: 3,
      });
    } else {
      wx.setTabBarBadge({
        index: 3,
        text: new Number(Num).toString(),
      })
    }
  }
}

common.getTels = function () {//客服
  wx.makePhoneCall({
    phoneNumber: '400-720-0000'
  })
},
common.storeId2=function(){
  // this.setStorage('storeId', 36614)
  return '36614'
}
  module.exports = common

