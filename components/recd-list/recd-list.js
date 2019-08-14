// components/recd-list/recd-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recdList: {
      type: Array,
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png"
  },
  ready() {
    const self = this
    let recdList = []
    self.data.recdList.forEach(item => {
      recdList.push({
        id: item.productId,
        url: item.imgUrl,
        title: item.productTitle,
        price: new Number(item.priceCurrentPrice).toFixed(2)
      });
    });
    self.setData({
      recdList: recdList
    })
  },
  methods: {
    numberFixed(num) {
      return new Number(num).toFixed(2)
    },
    goto(e) {
      var self = this
      let productId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/product/product-view/product-view?productId=${productId}`
      })
    }
  }
})
