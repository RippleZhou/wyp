//app.js
global.regeneratorRuntime = require('./libs/regenerator-runtime/runtime-module.js')
App({
  globalData: {
    selecteds: 0,
    pwType:0,
  },
  
  onLaunch: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log('res=', res)
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)
      }
    })
    let that = this;
    wx.getSystemInfo({// 获取页面的有关信息
      success: function (res) {
        console.log('res',res)
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }   
    });
    //检查版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // wx.setStorageSync('islogin', 1)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res,'+++++++++res')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)
              wx.setStorageSync('userInfo', this.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                wx.showModal({
                  title: '授权失败',
                  showCancel: false
                })
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    
  },
  onShow: function () {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('跟新提示' + res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "新版本" + "发布",
              content: "自动更新问题处理，是否重启应用？",
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        } else if (!res.hasUpdate) {

        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示

      wx.showModal({

        title: "提示",

        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"

      });

    }


    console.log("==App onShow==");
    // 判断手机是否为iphoneX
    let that = this;
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIpx = true
        }
      }
    })
  },
  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan); 
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret; 
    }
    return {
      'bezier_points': ret
    };
  },
  globalData: {
    userInfo: null
  }
  
})
