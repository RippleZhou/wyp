// const QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
// var demo = new QQMapWX({
//   key: 'HVUBZ-JFRH4-XZNUL-DA6AP-TXK45-4IBUM' // 必填
// });
const Utils = require('../../../utils/util')
const Common = require('../../../utils/common')
var Api = require("../../../utils/api")
const app = getApp()
let {
  regeneratorRuntime
} = global
Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canLogin: false,
    cellphone: '',
  },

  pwdInput(e) {
    let value = e.detail.value
    let {
      cellphone
    } = this.data
    let canLogin = false
    if (value && cellphone) {
      canLogin = true
    }
    this.setData({
      canLogin,
      password: e.detail.value
    })
  },


  // async pwdLogin(e) {
  //   let {
  //     cellphone,
  //     password,
  //     canLogin
  //   } = this.data
  //   let targetUrl = Common.getStorage('targetUrl')
  //   if (!canLogin) return;
  //   try {
  //     let res = await Common.pwdLogin({
  //       cellphone,
  //       password
  //     })
  //     let isBinDing = res.message.isBinDing
  //     let user = res.message

  //     if (isBinDing) {
  //       Common.saveUser(user)
  //       Common.saveLogin()
  //       let targetUrl = Common.getStorage('targetUrl')
  //       if (targetUrl) {
  //         Common.removeStorage('targetUrl')
  //         return wx.redirectTo({
  //           url: targetUrl
  //         })
  //       }
  //       Common.gotoIndex()
  //     } else {
  //       this.getcityName()
  //       this.gotoBind(user)
  //     }
  //   } catch (err) {
  //     wx.showToast({
  //       title: err.message,
  //       icon: 'none'
  //     })
  //   }
  // },
  wxGetOpenId() {
    var that = this;
    wx.login({
      //获取code 使用wx.login得到的登陆凭证，用于换取openid
      success: (res) => {
        console.log('res===', res)
        if (res.code) {
          let params = {
            jsCode: res.code,
          }
          let MD5signStr = Common.md5sign(params);
          let reqParams = {
            sign: MD5signStr,
            ...params
          }
          //发起网络请求
          wx.request({
            url: Api.user.getOpenId,
            method: 'post',
            data: reqParams,
            success(res) {
              console.log(res)
              if (!res.data.message.wxBindStatus) {
                that.setData({
                  wxOpenId: res.data.message.wxOpenId
                })
              }
            },
            fail(err) {
              wx.showToast({
                title: err,
                icon: 'none'
              })
            }
          })
        }
      }
    });
  },
  getPhoneNumber(e) {
    console.log(e);
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.checkSession({
            success: function() {
              console.log(e.detail.errMsg)
              console.log(e.detail.iv)
              console.log(e.detail.encryptedData)
              var ency = e.detail.encryptedData;
              var iv = e.detail.iv;
              if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
                that.setData({
                  modalstatus: true
                });
              } else {
                //同意授权
                wx.request({
                  method: "POST",
                  url: Api.user.decryptPhone,
                  data: {
                    'encrypdata': ency,
                    'ivdata': iv,
                    'jsCode': res.code
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: (res) => {
                    console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
                    console.log(res);
                    var cellPhone = JSON.parse(res.data.message.phone).phoneNumber;
                    that.setData({
                      cellPhone
                    })
                    Common.setStorage('cellPhone', cellPhone)
                    console.log(cellPhone);
                    let param = {
                      nickName: that.data.nickName,
                      imageUrl: that.data.imageUrl,
                      cellPhone: cellPhone,
                      wxOpenId: that.data.wxOpenId
                    }
                    var MD5signStr = Common.md5sign(param);
                    param.sign = MD5signStr
                    let url = Api.user.wxBindCellPhone
                    Common.request.post(url, param, function(data) {
                      if (data.status == 'OK') {
                        Common.isLogin();
                        console.log(Common.isLogin(),"+++++")
                        Common.setStorage('islogin',1)
                        Common.isLogin()
                        console.log(Common.isLogin(),'______-----')
                        console.log(data,'codelogin 168行');
                        let user=data.message
                        Common.saveUser(user)
                        Common.saveLogin()
                        let targetUrl = Common.getStorage('targetUrl')
                        console.log('codelogin 173行','targetUrl', targetUrl)
                        let targetUrl1 = Common.getStorage('targetUrl1')
                        console.log('codelogin 175行','targetUrl1', targetUrl1)
                        Common.setStorage('user',user);
                        Common.removeStorage('targetUrl')
                        Common.removeStorage('targetUrl1')
                        if (targetUrl) {
                          console.log('codelogin 180行', 'targetUrl', targetUrl)
                          return wx.redirectTo({
                            url: targetUrl
                          })
                        }
                        if (targetUrl1) {
                          console.log('codelogin 186行', 'targetUrl1', targetUrl1)
                          return wx.redirectTo({
                            url: targetUrl1
                          })
                        }
                        Common.gotoIndex()
                      }
                    })

                  },
                  fail: function(res) {
                    console.log("解密失败~~~~~~~~~~~~~");
                    console.log(res);
                  }
                });
              }
            }
          })
        }
      }
    })
    // let targetUrl = Common.getStorage('targetUrl')
    // let targetUrl1 = Common.getStorage('targetUrl1')

  },
  GoMessage: function() {
    wx.navigateTo({
      url: '/pages/user/message/message',
    })
  },
  getcityName(lat, lng) {
    let params = {};
    params.longitude = Common.getStorage('latitude')
    params.latitude = Common.getStorage('longitude');
    let MD5sign = Common.md5sign(params);
    params.sign = MD5sign;
    Common.request.post(Api.customerAddress.getAddressByLngAndLat, params,
      function(data) {
        if (data.status == "OK") {
          console.log(data.message);
          let cityId = data.message.cityId;
          Common.setStorage('cityId', cityId)
        } else {
          console.log(data.message);
        }
      })
  },
  onLoad: function(options) {
    console.log(options)
    let userInfo = Common.getStorage('userInfo')
    let nickName = userInfo.nickName
    let imageUrl = userInfo.avatarUrl
    this.setData({
      nickName,
      imageUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  gotologin() {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let targetUrl = Common.getStorage('targetUrl')
    let targetUrl1 = Common.getStorage('targetUrl1')
    console.log(Common.isLogin())
    // Common.isLogin() ? Common.gotoIndex() : this.gotologin()
    this.wxGetOpenId();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: '登录',
      path: 'pages/home/home'
    }
  }
})