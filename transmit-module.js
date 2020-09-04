// 模型文件

class Trans{
  //定义构造函数
  constructor(){
      
  }
  transmitData(api,data,id,callback) {
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
          callback(res.data);
      },
      fail:function(err){
          console.error('failed', err);
      }
    })
  }
}
export {Trans};