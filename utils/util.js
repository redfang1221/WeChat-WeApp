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

module.exports = {
  formatTime: formatTime,
  getCurrentDate: getCurrentDate,
  isNotTel: isNotTel,
  isNotEmail: isNotEmail,
  isBlank: isBlank,
  transmitData: transmitData,
  adjustJsonError: adjustJsonError
}

function getCurrentDate(){
  var _time = '';
  var now = new Date();
  var year = now.getFullYear()+1;
  var month = now.getMonth()+1;
  var date = now.getDate();
  _time = year+'年'+month+'月'+date+'日';
  return _time;
}

function isNotTel(tel){
  var phone = /^1[34578]\d{9}$/; 
  if(tel.length == 11){//手机号码
    if(phone.test(tel)) {
      return false;
    }
  }
  return true;
}

function isNotEmail(email){
  var regex = /^\w+@[0-9a-z]+\.[a-z]+$/;
  if(regex.test(email)){
    return false;
  }else{
    return true;
  }
}

function isBlank(str){
  if(str == undefined || str == null || str == '') {
    return true;
  }
  return false;
}

function transmitData(api,data,id){
  wx.request({
    url: api+id,
    method: 'POST',
    data: data,
    header: {
      'content-type':'application/json',
      'Cookie': wx.getStorageSync('sessionid')//读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
    },
    success:function(res){
        // console.log(res.data);
        return res;
    },
    fail:function(err){
        console.error('failed', err);
    }
  })
}

function adjustJsonError(ori) {
  var jsonStr = ori.replace(" ", "");
  if (typeof jsonStr != 'object') {
    jsonStr = jsonStr.replace(/\ufeff/g, "");
  }
  return jsonStr;
}