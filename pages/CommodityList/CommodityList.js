// pages/CommodityList/CommodityList.js
const computedBehavior = require("miniprogram-computed");
Component({
  behaviors: [computedBehavior],
  properties: {
    list: {
      type: String,
      value: "[]"
    }
  },
  computed: {
    list1() {
      console.log("lisntsss:",this.data.list)
      return JSON.parse(this.data.list)
    },
    products_number() {
      return JSON.parse(this.data.list).reduce((accumulator, currentValue) => accumulator + currentValue.productNum, 0)
    },
  }
})