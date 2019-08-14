// components/ pro-imgtxt/ pro-imgtxt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lastFlag: Boolean,//显示到底了
    list: {
      type: Array,
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },
  resize() {
    console.log(this.proList)
  },
  /**
   * 组件的初始数据
   */
  data: {
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goto(e) {
      var self = this
      let productId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/product/product-view/product-view?productId=${productId}`
      })
    }
  }
})
