// let cUrl = 'https://vue.3721zh.com/api/'  //测服

// let cUrl = 'https://v.3721zh.com/api/'
// var cUrl='https://jpaytest.3721zh.com/'
var cUrl = 'https://testapi.3721zh.com/'  //本地
// var cUrl='https://small.3721zh.com'


const api = {
  index: {
    query: cUrl + 'index/query', //首页
    advertise: cUrl + 'index/advertise'
  },
  list: {
    SearchList: cUrl + 'proProduct/searchProductList',
    proList: cUrl + 'proProduct/productDetailsView',
    orderList: cUrl + 'sopOrder/myOrder',
    getMyOrders: cUrl + 'order/getMyOrders'
  },
  product: {
    purchaseHistoryNew: cUrl + 'product/purchaseHistoryNew',
    category: cUrl + 'category/queryFirstTypeTree',
    detail: cUrl + 'product/detail',
    lunbo: cUrl + 'product/productMasterPicture',
    queryCart: cUrl + 'shoppingCart/queryCart',
    modifyCartItemAmount: cUrl + 'shoppingCart/modifyCartItemAmount', //修改购物车当前款商品的数量并选中
    modifyCartItemSelected: cUrl + 'shoppingCart/modifyCartItemSelected', //修改购物车商品明细的选中状态
    removeCartItems: cUrl + 'shoppingCart/removeCartItems', //删除购物车中的商品
    purchaseHistory: cUrl + 'product/purchaseHistory', //产品购买历史
    queryLike: cUrl + 'product/queryLike', //猜你喜欢
    queryProSeckill: cUrl + 'product/queryProSeckill', //秒杀
    getShareByKey: cUrl + 'product/getShareByKey',
    getShareUrl: cUrl + 'product/getShareUrl'
  },
  shoppingCart: {
    addCart: cUrl + '/shoppingCart/addCart', //加入购物车
    queryCart: cUrl + '/shoppingCart/queryCart'
  },
  customer: {
    login: cUrl + 'customer/login',
    CustomerloginCode: cUrl + 'customer/loginCode',
    CustomercheckToken: cUrl + 'customer/checkToken',
    CustomerLogin: cUrl + 'customer/login',
    GetmsAuthCode: cUrl + 'customer/getmsAuthCode',
    customerlogOut: cUrl + 'customer/logOut',
    checkIsLogin: cUrl + 'customer/checkIsLogin',
    AuthCode: cUrl + 'customer/checkAuthCode',
    wXRegister: cUrl + 'customer/wXRegister',
    addressData: cUrl + 'customerAddress/getArea',
    checkToken: cUrl + 'customer/checkToken',
    getOpenId: cUrl + 'customer/getOpenId',
    checkWxIsLogin: cUrl + 'customer/checkWxIsLogin',
    setPassWord: cUrl + 'customer/setPassWord',
    getUserCenter: cUrl + 'customer/getUserCenter',
    EditPayPassWord: cUrl + 'customer/editPayPassWord',
    checkPayPassWord: cUrl + 'customer/checkPayPassWord',
    checkPassWord: cUrl + 'customer/checkPassWord',
    setUserInfo: cUrl + 'customer/setUserInfo',
    changeCellPhone: cUrl + 'customer/changeCellPhone',
    getWxSign: cUrl + 'customer/getWxSign',
    addAddress: cUrl + 'customerAddress/addAddress',
    getAddressList: cUrl + 'customerAddress/getAddressList',
    editAddress: cUrl + 'customerAddress/editAddress',
    bindWxOpenid: cUrl + 'customer/bindWxOpenid',
    cusConverBeanItem: cUrl + 'cusConverBeanItem/getConverBeanItemList',
    getEnvelopList: cUrl + 'cusConverBeanItem/getEnvelopList',
    transferBean: cUrl + 'cusConverBeanItem/transferBean',
    createEnvelop: cUrl + 'cusEnvelope/createEnvelop',
    wxRechargeConverBean: cUrl + 'cusConverBeanItem/wxRechargeConverBean',
    getCityByLngAndLat: cUrl + 'customerAddress/getCityByLngAndLat', //根据经纬度获取热门城市
    checkCellPhoneExist: cUrl + 'customer/checkCellPhoneExist',//检测手机是否注册过
    getRechargeRate: cUrl + 'customer/getRechargeRate',
    getRechargeList: cUrl + 'cusConverBeanItem/getRechargeList',
    deleteAddress: cUrl + 'customerAddress/deleteAddress',
    selectWithBeansList: cUrl + 'cusConverBeanItem/selectWithBeansList',
    getTransferBean: cUrl + 'cusConverBeanItem/getTransferBean',
    getUserInfoByCellPhone: cUrl + 'customer/getUserInfoByCellPhone ',
    addIdCardNoCustomerId: cUrl + 'customer/addIdCardNoCustomerId',//根据收货人id添加收货人身份证号
    updateIdCardNoByCustomerId: cUrl + 'customer/updateIdCardNoByCustomerId',//根据收货人id修改收货人身份证号
    checkAuthCodeInfo: cUrl + 'customer/checkAuthCodeInfo',
  },
  types: {
    citys: cUrl + 'customerAddress/queryAllCity',
    clickType: cUrl + 'types/clickType',
    search: cUrl + 'types/search',
    clickSType: cUrl + 'types/clickSType',
    clickFType: cUrl + 'types/clickFType',
    categorySear: cUrl + 'category/search'
  },

  find: {
    currencySubmitOrder: cUrl + '/virOrderCurrency/submitOrder',//查询通用券提交订单页详情,
    virProductCurrencyDetailForOrder: cUrl + '/vir/productCurrency/virProductCurrencyDetailForOrder',//查询通用券提交订单页详情
    virProductCurrencyDetail: cUrl + '/vir/productCurrency/virProductCurrencyDetail',
    virProductsCurrency: cUrl + 'vir/productCurrency/virProductsCurrency',
    queryBannerList: cUrl + 'banner/queryBannerList', //发现--获取霸王餐、折扣店轮播图
    queryPromotion: cUrl + 'promotion/queryPromotion', //发现--获取霸王餐、折扣店信息
    queryStore: cUrl + 'store/queryStore', //发现-获取商户详情
    addComment: cUrl + 'comment/addComment', //添加商户评论(base64传文件)
    addCommentEx: cUrl + 'comment/addCommentEx', //添加商户评论(file传文件)
    queryComment: cUrl + 'comment/queryComment', //查看商户评论
    virProducts: cUrl + 'vir/product/virProducts',//砍价列表
    virProductsOfVendor: cUrl + 'vir/product/virProductsOfVendor', //查询商户的砍价列表
    virProductDetail: cUrl + 'vir/product/virProductDetail', //查询砍价详情
    bargain: cUrl + 'vir/bargain/bargain',//帮好友坎价
    virBrowse: cUrl + 'vir/product/browse', //记录浏览次数
    todayBargainList: cUrl + 'vir/bargain/todayBargainList',//砍价－今日砍价人数
    shareCovers: cUrl + 'vir/product/shareCovers', //分享封面
    submitOrder: cUrl + 'virOrder/submitOrder',//优惠券－提交订单
    virProductDetailForOrder: cUrl + 'vir/product/virProductDetailForOrder',//提交订单-商户信息
    delOrder: cUrl + 'virOrder/delOrder',//优惠券－删除订单
    cancelOrder: cUrl + 'virOrder/cancelOrder',//优惠券－取消订单
    continuePay: cUrl + 'virOrder/continuePay',////优惠券－继续支付
    getVirOrders: cUrl + 'virOrder/getVirOrders',//虚拟订单
    getVirOrderDetail: cUrl + 'virOrder/getVirOrderDetail',////订单详情
    getBeans: cUrl + 'vir/product/getBeans',//获取赠豆数
    getLimitNum: cUrl + 'virOrder/getLimitNum',//获取产品限购数量
    getRefudInfo: cUrl + 'virOrder/getRefudInfo',//申请退款页面
    refundOrder: cUrl + 'virOrder/refundOrder',//申请退款
    recommendList: cUrl + 'vir/product/recommendList',//分享页面－推荐列表
    getVirOrderRefundProcess: cUrl + 'virOrder/getVirOrderRefundProcess',//退款进度
    getVirOrderRefundDetail: cUrl + 'virOrder/getVirOrderRefundDetail',//退款详情
    getVirOrderCode: cUrl + 'virOrder/getVirOrderCode',//查看消费码
    getReundNum: cUrl + 'virOrder/getReundNum',//查询用户退款次数，及退款比率
    dictsbargain: cUrl + 'common/dicts/tip_bargain',//列表说明
    dictsbargaindetail: cUrl + 'common/dicts/tip_bargain_detail',//详情说明
  },
  order: {
    confirmOrder: cUrl + 'order/getSettlementOrder', //获取订单信息
    computeCost: cUrl + 'order/getPaymentCost', //获取修改抵用转换豆数额后的支付信息
    submitOrder: cUrl + 'order/submitOrder', //提交订单
    orderDetail: cUrl + 'order/getOrderDetail', //订单详情
    cancelOrder: cUrl + 'order/cancelOrder',
    orderpay: cUrl + 'order/pay',
    hideOrder: cUrl + 'order/hideOrder',
    receiveGoods: cUrl + 'order/receiveGoods',
    getExpressInfo: cUrl + 'order/getExpressInfo',
    getReasons: cUrl + 'order/getReasonsForCancel',
    getReasonsForReturn: cUrl + 'order/getReasonsForReturn',
    returnedGoodsApply: cUrl + 'order/returnedGoodsApply',
    getReturnType: cUrl + 'order/getReturnType',
    returnedGoods: cUrl + 'order/returnedGoods',
    uploadImg: cUrl + 'order/uploadImg',
    getReturnedGoods: cUrl + 'order/getReturnedGoods',
    getReturnedDetail: cUrl + 'order/getReturnedDetail',
    cancelReturnedGoods: cUrl + 'order/cancelReturnedGoods',
    fillInExpress: cUrl + 'order/fillInExpress',
    getExpressCompanys: cUrl + 'order/getExpressCompanys',
    getOrderItems: cUrl + 'order/getOrderItems',
    fillInExpressSubmit: cUrl + 'order/fillInExpressSubmit',
    editReturnedGoods: cUrl + 'order/editReturnedGoods',
    getStoreOrderList: cUrl + 'order/getStoreOrderList',
    getOrderGroupList: cUrl + 'order/getOrderGroupList',
    uploadFile: cUrl + 'comment/uploadFile',
    getDeductionCost: cUrl + 'order/getDeductionCost',
    queryAllinpayOrder: cUrl + 'order/queryAllinpayOrder',
    querySuspendSendgoods: cUrl + 'order/querySuspendSendgoods'
  },
  signin: {
    getSignInfo: cUrl + 'signin/getSignInfo',
    userSignIn: cUrl + 'signin/userSignIn',
    signIn: cUrl + 'signin/signIn'
  },
  borrow: {
    getBorrowBeanList: cUrl + 'cusConverBeanItem/getBorrowBeanList',//借豆列表
    queryBwProductInfo: cUrl + 'product/queryBwProductInfo',//借豆产品详情
    purchaseHistory: cUrl + 'product/purchaseHistory',//历史借豆
    bwConverBean: cUrl + 'borrow/bwConverBean',//用户借豆
    bwConvertBean: cUrl + 'borrow/bwConvertBean',//用户借豆+签名
    queryBWConfig: cUrl + 'borrow/queryBWConfig',//配置信息
    queryBWRecordList: cUrl + 'borrow/queryBWRecordList',//查看借豆列表
  },
  message: {
    getPromotionList: cUrl + 'messageNotify/getPromotionList', //获取优惠大促消息
    getAccountNotifyList: cUrl + 'messageNotify/getAccountNotifyList', //获取账户消息
    getDealList: cUrl + 'messageNotify/getDealList', //获取交易消息列表
    getExpresInfoList: cUrl + 'messageNotify/getExpresInfoList', //获取物流消息列表
    getAccountMessage: cUrl + 'messageNotify/getAccountMessage', //获取用户消息
    getMessageReadState: cUrl + 'messageNotify/updateMessageReadState', //获取用户消息状态
    getInviteInfo: cUrl + 'customer/getInviteInfo' //邀请好友信息
  },
  userEnvelope: {
    checkCollarBag: cUrl + 'userEnvelope/checkCollarBag',
    tenClockCollarBag: cUrl + 'userEnvelope/tenClockCollarBag',
    receiveTimingConvertEnvelope: cUrl + 'userEnvelope/receiveTimingConvertEnvelope',
    queryCollarBagDetail: cUrl + 'userEnvelope/queryCollarBagDetail',
    queryTimingConvertEnvelopeDetail: cUrl + 'userEnvelope/queryTimingConvertEnvelopeDetail',
    checkUserDayEnv: cUrl + 'cusEnvelope/checkUserDayEnv',
    takeIndexEnv: cUrl + 'cusEnvelope/takeIndexEnv'
  },
  shops: {
    getShopInfo: cUrl + 'shop/shopInfo',//查询店铺信息
    getShopProducts: cUrl + 'shop/shopProducts', //查询店铺商品
    getShopHistoryProducts: cUrl + 'shop/shopHistoryProducts', //查询店铺历史商品
    getUserShop: cUrl + 'shop/getUserShop' //查询用户是否开店
  },
  cusEnvelope:
  {
    snatchEnvelope: cUrl + 'cusEnvelope/snatchEnvelope',
    getBeanEnvList: cUrl + 'cusEnvelope/getBeanEnvList',
    getEnvData: cUrl + 'cusEnvelope/getEnvData'
  },
  newCustomer:
  {
    newgetmsAuthCode: cUrl + 'newCustomer/getmsAuthCode',
    loginCode: cUrl + 'newCustomer/loginCode',
    wXRegiste: cUrl + 'newCustomer/wXRegister',
    checkAuthCodeInfo: cUrl + 'newCustomer/checkAuthCodeInfo',
    changeCellPhone: cUrl + 'newCustomer/changeCellPhone',
    getUserCenter: cUrl + 'newCustomer/getUserCenter'

  },
  newBorrow: {
    queryCustomerCode: cUrl + 'newCustomer/queryCustomerCode',
    queryBWRecordListNew: cUrl + 'borrow/queryBWRecordListNew',
    getUserCenterNew: cUrl + 'newCustomer/getUserCenterNew',
    bwConvertBeanNew: cUrl + 'borrow/bwConverBeanNew',
    purchaseHistoryNew: cUrl + 'product/purchaseHistoryNew',
    queryBwProductInfoNew: cUrl + 'product/queryBwProductInfoNew',
    getShareByKeyNew: cUrl + 'product/getShareByKeyNew'
  },
  sendBean: `${cUrl}cusEnvelope/createEnvelop`,
  indexQuery: `${cUrl}index/query`,
  clickFType: `${cUrl}types/clickFType`,
  queryActivity: `${cUrl}activity/queryActivity`,
  queryItem: `${cUrl}activity/queryItem`,
  queryActivityNew: `${cUrl}activity/queryActivityNew`,
  citys: cUrl + 'customerAddress/queryAllCity',
  getCityByLngAndLat: cUrl + 'customerAddress/getCityByLngAndLat',
  getAddressByLngAndLat: cUrl + 'customerAddress/getAddressByLngAndLat',
  // getBorrowBeanList: cUrl + 'cusConverBeanItem/getBorrowBeanList',
}
module.exports = api 
