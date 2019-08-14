const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const isNumberOr = obj => {
  var $this = obj;
  if (new RegExp("(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}|(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,20}[A-Za-z0-9~!@#$^&*()=|{}]{6,}").test($this)) {
    return true;
  } else {
    return false;
  }
}
const validatePhoneNum = obj => { //手机号码验证
  console.log('obj:',obj)
  var $this = obj;
  if (/^1\d{10}$/.test($this)) {
    return true;
  } else {
    return false;
  }
}


/*加法*/
const floatAdd = (arg1, arg2) => {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

/*减法*/
const floatSub = (arg1, arg2) => {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/*乘法*/
const floatMul = (arg1, arg2) => {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


/*除法*/
const floatDiv = (arg1, arg2) => {
  var t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }

  r1 = Number(arg1.toString().replace(".", ""));

  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

// const promisify = api => {
//   return (options, ...params) => new Promise((resolve, reject) => {
//     api({ ...options, success: resolve, fail: reject }, ...params)
//   })
// }

// export default promisify

module.exports = {
  formatTime: formatTime,
  validatePhoneNum,
  isNumberOr,
  floatAdd,
  floatMul,
  floatSub,
  // promisify
}

