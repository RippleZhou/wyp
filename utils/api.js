// let cUrl = 'https://vue.3721zh.com/api/'  //测服
// let cUrl = 'https://v.3721zh.com/api/'
// var cUrl='https://jpaytest.3721zh.com/'
 //var cUrl = 'https://xqapitest.3721zh.com/'  //本地 + 测服 +有商品
// var cUrl='https://small.3721zh.com'
//var cUrl = 'https://wypapi.3721zh.com/'  //线上
var cUrl ='https://xqhjuatapi.3721zh.com/' //测服
const api = {
  common: {
    getmsAuthCode: `${cUrl}common/getmsAuthCode`
  },
  user: {
    decryptPhone: `${cUrl}customerWeChat/decryptPhone`,
    getOpenId: `${cUrl}customerWeChat/getOpenId`,
    wXLogin: `${cUrl}customerHousing/wXLogin`,
    login: `${cUrl}customerHousing/login`,
    loginCode: `${cUrl}customerHousing/loginCode`,
    register: `${cUrl}customerHousing/register`,
    resetPassword: `${cUrl}customerHousing/resetPassword`,
    wxBindCellPhone: `${cUrl}customerWeChat/wxBindCellPhone`,
    // wxBindCellPhone: `${cUrl}customerHousing/wxBindCellPhone`,
    // getOpenId: `${cUrl}customerHousing/getOpenId`,
    checkCellPhoneExist: `${cUrl}customerHousing/checkCellPhoneExist` 
  },
  index: {
    takeTurnsNotice: cUrl + 'takeTurns/takeTurnsNotice' //首页轮播提示
  },
  //线上商城
  mall:{
    organBannerList: cUrl + 'organhousingbanner/organBannerList',//商城首页轮播
    search:cUrl + 'ProductHousingMall/search' ,//商品搜索
    detail: cUrl + 'ProductHousingMall/detail',//产品详情
    queryFirstTypeTree: cUrl + 'ProductHousingMall/queryFirstTypeTree', //查询一级分类
    categoryProduct: cUrl + 'ProductHousingMall/categoryProduct',//查询分类下面的商品
    activityTypeTree: cUrl +'ProductHousingMall/activityTypeTree',//查分类列表（新）
    activityTypeProduct: cUrl +'ProductHousingMall/activityTypeProduct',//查分类下产品（新）
  },
  order: {
    getMyOrders: cUrl + 'sopHousingOrder/getMyOrders',//获取我的订单列表(用户)
    getReasonsForReturn: cUrl + 'sopHousingOrder/getReasonsForReturn',//获取退换原因
    cancelOrder: cUrl + 'sopHousingOrder/cancelOrder',//取消订单
    pay: cUrl + 'sopHousingOrder/pay',//立即支付
    orderDetail: cUrl + '/sopHousingOrder/queryOrderDetailByOrderId',//订单详情
    detai: cUrl + 'productHousing/detail',//产品详情
    detaiOL: cUrl + 'ProductHousingMall/detail',//线上产品详情
    getOrderCustomer: cUrl + 'takeTurns/getOrderCustomer',
    getSettlementOrder: cUrl + 'sopHousingOrder/getSettlementOrder',
    uploadImg: cUrl + 'sopHousingOrder/uploadImg',//图片上传
    returndOrderSubmit: cUrl + 'sopHousingOrder/returndOrderSubmit',//退换货提交
    submitOrder: cUrl + '/sopHousingOrder/submitOrder',//提交订单
    getReturnOrderList: cUrl + 'sopHousingOrder/getReturnOrderList',//提交订单-退款
    returndCancel:cUrl+"sopHousingOrder/returndCancel",//撤销退换货
    getReturnOrderDetail: cUrl +'sopHousingOrder/getReturnOrderDetail',//退换货详情
  },
  address: {
    getAddressByLngAndLat: cUrl + 'CusHousingAddress/getAddressByLngAndLat',//根据经纬度获取所在城市
    getHousingListByCityId: cUrl + 'CusHousingAddress/getHousingListByCityId',//根据城市id获取物业列表
    getOpendCityList: cUrl + 'CusHousingAddress/getOpendCityList',//查询已开通城市
    getAddressList: cUrl + 'CusHousingAddress/getAddressList', 
    editAddress: cUrl + 'CusHousingAddress/editAddress',
    addAddress: cUrl + 'CusHousingAddress/addAddress',
    customerHousing: cUrl + 'customerHousing/matchCusAddress' //模糊匹配城市
  },
  car: { 
    addCart: cUrl + 'shoppingCart/addCart',//添加购物车
    addCartByBatch: cUrl + 'shoppingCart/addCartByBatch',//批量添加购物车
    queryCart: cUrl + 'shoppingCart/queryCart', //查看购物车
    removeCartItems: cUrl + 'shoppingCart/removeCartItems',
    modifyCartItemSelected: cUrl + 'shoppingCart/modifyCartItemSelected',
    modifyCartItemAmount: cUrl + 'shoppingCart/modifyCartItemAmount',
  },
  housing: {
    nearestStore: cUrl + 'customerWeChat/nearestStore',//获取最近小区
    bindingProperty: cUrl + 'customerHousing/bindingProperty',//绑定小区物业
    myHousing: cUrl + '/customerHousing/myHousing',//我绑定的物业
    mySuggest: cUrl + '/customerHousing/opinion',//意见反馈
    myCusHousingCoin: cUrl + 'cusHousingCoin/details',//用户物业币缴费账单详情
    myCusHousing: cUrl + '/customerHousing/unbinding',//用户解绑清空物业币
    charge:cUrl+'/cusHousingCoin/charge',
    list: `${cUrl}cusHousingCoin/list`,
    verify: `${cUrl}cusHousingCoin/verify`,
    getUser: `${cUrl}customerHousing/getUserInfoByCellPhone`,
    customerHousing: cUrl + 'customerHousing/matchCusAddress', //模糊匹配城市
    getCusPayPw:`${cUrl}customerHousing/getCusPayPw`,
    saveCusPayPw:`${cUrl}customerHousing/saveCusPayPw`,
    modifyWithdrawPassword:`${cUrl}customerHousing/modifyPayPassword`,
    getAddressList: `${cUrl}CusHousingAddress/getAddressList`,//地址列表
    deleteAddress: `${cUrl}CusHousingAddress/deleteAddress`,//删除地址
    getShareInfo: `${cUrl}productShare/getShareInfo`,//产品分享
  },
  productHousing:
  {
    index: cUrl + 'productHousing/index',
    housingInfo: cUrl + 'productHousing/housingInfo'
  },
  customerAddress:
  {
    getAddressByLngAndLat: cUrl + 'CusHousingAddress/getAddressByLngAndLat'
  },
  housingbanner:
  {
    queryBannerList: cUrl + 'housingbanner/queryBannerList'
  },
  takeTurns:
  {
    takeTurnsNotice: cUrl + 'takeTurns/takeTurnsNotice'
  }
}
module.exports = api 
