import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {Trans} from '../../transmit-module.js';
var trans=new Trans();

var util = require('../../utils/util.js');
var that;
var openid = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:'',
    entryManager:'',
    entryNo:'',
    show: false,
    deptName:'',
    projName:'',
    contact:'',
    tel:'',
    email:'',
    staff:'',
    description:'',
    requirement:'',
    date:'',
    modify:'0',
    officerId:'',
    applicantId:''
  },
  queryFixedInfo(){
    //后端获取人员信息
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/getEntryFixedInfo/'
    trans.transmitData(api,{},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        this.setData({
          entryNo:"错误未知",
          entryManager:"错误未知",
          currentDate:util.getCurrentDate(),
        });
        return;
      }
      this.setData({
        entryNo:data.entryNo,
        entryManager:data.entryManager,
        currentDate:util.getCurrentDate(),
        officerId:data.officerId,
        applicantId:data.applicantId
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      modify: options.modify,
      entryNo: options.entryNo
    });
    //后端传递负责人和编号
    if(this.data.modify=='0') {
      this.queryFixedInfo();
      this.queryMyInfo();
    } else {
      this.queryEntryDetail();
    }
  },
  queryMyInfo(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryMyInfo/'
    trans.transmitData(api,{},'',(data) => {
      console.log(data);
      if(data == undefined || data==null) {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        this.setData({
          avatar:this.data.imageURL,
          tel:'',
          nickName:'昵称'
        });
        return;
      }
      this.setData({
        tel:data.phoneNumber
      });
    });
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear() + 1}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  onClickConfirm(e) {
    Dialog.confirm({
      title: '确认提交'
    })
    .then(() => {
      // on confirm
      //空值校验
      // console.log(that.data.deptName);
      var judge = util.isBlank(that.data.deptName) || util.isBlank(that.data.projName) || util.isBlank(that.data.contact) || util.isBlank(that.data.tel) || util.isBlank(that.data.email) || util.isBlank(that.data.staff) || util.isBlank(that.data.description) || util.isBlank(that.data.requirement) || util.isBlank(that.data.date);
      Dialog.close();
      if (judge) {
         Dialog.alert({
          title: '有信息未填写'
        })
        return;
      } else if(util.isNotEmail(that.data.email)){
        Dialog.alert({
          title: '邮箱格式错误'
        })
        return;
      } else if(util.isNotTel(that.data.tel)){
        Dialog.alert({
          title: '电话格式错误'
        })
        return;
      } else {
        // 后端交互，上传数据
        // 新增数据
        var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/addNewEntryInfo/';
        // 修改数据
        if(this.data.modify=='1') {
          api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/modifyEntryInfo/';
          var api2 = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/checkEntryLock/';
          var id = this.data.entryNo;
          trans.transmitData(api2,{entryNo:id},'',(data) => {
            console.log(data);
            if(data == undefined || data==null || data == '') {
              Dialog.alert({
                title: '数据同步失败，请稍后重试'
              });
              return;
            }
            console.log(data.lock);
            if(data.lock=='1'){
              Dialog.alert({
                title: '正在审核中，请稍后修改',
              }).then(() => {
                // on close
                Dialog.close();
              });
              return;
            }
          });
        }
        var info = {
          entryNo:that.data.entryNo,
          deptName:that.data.deptName,
          projName:that.data.projName,
          contact:that.data.contact,
          tel:that.data.tel,
          email:that.data.email,
          staff:that.data.staff,
          description:that.data.description,
          requirement:that.data.requirement,
          date:that.data.date,
          applicantId:that.data.applicantId,
          officerId:that.data.officerId,
          entryManager:that.data.entryManager,
          currentDate:that.data.currentDate
        }
        console.log(info);
        var success = util.transmitData(api,info,'');
        // 送审订阅
        // var openid = '';
        var url = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryOpenidByEntryNo/';
        var id = this.data.entryNo;
        trans.transmitData(url,{entryNo:id},'',(data) => {
          if(data == undefined || data==null || data == '') {
            Dialog.alert({
              title: '数据同步失败，请稍后重试'
            });
            return;
          }
          console.log(data.openid);
          openid = data.openid; 
        });

        console.log("asfasgasgagag");
        wx.requestSubscribeMessage({
          tmplIds: ['v7NrfZBPvRHUUzuP48MX7EMkHwA5lI_0QHMgp7HmLIo']
        }).then(res => {
          trans.transmitData('http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/getAccessToken/',{},'',(data) => {
            if(data == undefined || data==null || data == '') {
              Dialog.alert({
                title: '数据同步失败，请稍后重试'
              });
              return;
            }
            console.log(data.token);
            mapData = {
              time3:this.data.currentDate,
              phrase2:'进场单',
              name1:this.data.contact,
              thing4:(this.data.deptName + ', ' + this.data.projName)
            }
            trans.transmitData('http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/pushToUser/',mapData,'',(data) => {
              if(data == undefined || data==null || data == '') {
                Dialog.alert({
                  title: '数据同步失败，请稍后重试'
                });
                return;
              }
            });
            console.log("成功授权");
            wx.showToast({
              title: '已成功下发',
            })
        }).catch( res => {
          console.log("拒绝授权");
          wx.showToast({
            title: '未下发审核，请授权',
          });
          return;
        })
      });
        
      if(success == 'error') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        return;
      }
      wx.redirectTo({
        url: '/pages/me/me',
      });
      }
    })
    // console.log();
  },


  //zjc用户授权
  getPer() {
    wx.requestSubscribeMessage({
      tmplIds: ['v7NrfZBPvRHUUzuP48MX7EMkHwA5lI_0QHMgp7HmLIo'],
    }).then(res => {
      console.log("授权成功", res)
    }).catch(res => {
      console.log("授权失败", res)
    })
  },


  onClose() {
    this.setData({
      show: false
    });
  },
  deptNameInput(e){
    // console.log(e.detail);
    this.setData({
      deptName: e.detail
    });
    // console.log(that.data.deptName);
  },
  projNameInput(e){
    this.setData({
      projName: e.detail
    });
  },
  contactInput(e){
    this.setData({
      contact: e.detail
    });
  },
  telInput(e){
    this.setData({
      tel: e.detail
    });
  },
  emailInput(e){
    this.setData({
      email: e.detail
    });
  },
  staffInput(e){
    this.setData({
      staff: e.detail
    });
  },
  descriptionInput(e){
    this.setData({
      description: e.detail
    });
  },
  requirementInput(e){
    this.setData({
      requirement: e.detail
    });
  },
  queryEntryDetail(){
    console.log(this.data.entryNo);
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryEntryDetail/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        return;
      }
      this.setData({
          currentDate:data.currentDate,
          entryManager:data.entryManager,
          entryNo:data.entryNo,
          deptName:data.deptName,
          projName:data.projName,
          contact:data.contact,
          tel:data.tel,
          email:data.email,
          staff:data.staff,
          description:data.description,
          requirement:data.requirement,
          date:data.date
      });
    });
  }
})