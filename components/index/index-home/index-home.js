// components/index/index-home/index-home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proid: Number,
    type: Number,
    title: String,
    setTabShow: Boolean,
    lastFlag: Boolean,
    proList: {
      type: Array,
      value: [],
    },
    headList: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorImg: "https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png",
  },
  ready() {
    let self = this
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRecommendList(e) {
      const self = this
      // console.log(self.data)
      let dataset = e.currentTarget.dataset
      let url = '/pages/tab1/index-allclas/index-allclas'
      url += "?id=" + self.data.proid +
        "&parentId=" + dataset.id +
        "&title=" + self.data.title
      wx.navigateTo({
        url: url
      })
    }
  }
})
