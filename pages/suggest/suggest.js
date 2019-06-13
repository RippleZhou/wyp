// pages/suggest/suggest.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    textarea_hidden: 0,
    mask_show: 0,
    text_data: "",
    words_count: 0
  },
  doNotMove: function () {
    console.log('stop user scroll it!');
    return;
  },
  textarea_hidden: function (e) {
    let text_data = e.detail.value;
    let words_count = text_data.length;
    let that = this;
    that.setData({
      text_data: text_data,
      words_count: words_count
    })
  },
  submit: function (e) {
    let that = this;
    // 获取描述内容
    let content = that.data.text_data;
    if (content == '') {
      toast.showToast('请填写反馈内容！');
      return;
    }

    util.getData('feedback', {
      content: content,
      images: JSON.stringify(that.data.pics),
      openid: app.globalData.openid,
      method: 'POST'
    }, function (data) {
      if (data.errno !== 0) {
        toast.showToast(data.errdesc);
        return;
      }

      that.setData({
        textarea_hidden: 1,
        mask_show: 1
      })
    })

  },
  closePage: function (e) {
    wx.navigateBack();
  },
  uploadImg: function (e) {
    let {
      pics
    } = this.data;
    if (pics.length == 3) {
      return;
    }
    let that = this;
    wx.chooseImage({
      count: 3 - pics.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        let arr = that.uploadMutileimg({
          pictures: tempFilePaths
        })
      }
    })

  },
  uploadMutileimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: 'https://xxx/Upload/uploadMoreImg',
      filePath: data.pictures[i],
      name: 'file',
      success: (res) => {
        success++;
      },
      fail: (res) => {
        fail++;
      },
      complete: (res) => {
        i++;
        var imgdata = JSON.parse(res.data);
        var img = imgdata.data[0];
        that.data.pics.push(img);
        if (i == data.pictures.length) { //当图片传完时，停止调用   
          that.setData({
            pics: that.data.pics
          })
        } else { //若图片还没有传完，则继续调用函数                    
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadMutileimg(data);
        }

      }
    })
  },
  delete_this: function (e) {
    var pics = this.data.pics;
    var src = e.currentTarget.dataset.src;
    for (var i = 0; i < pics.length; i++) {
      if (pics[i] == src) {
        pics.splice(i, 1);
      }
    }
    this.setData({
      pics: pics
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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