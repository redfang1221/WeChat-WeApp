import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {Trans} from '../../transmit-module.js';
var app = getApp();
var trans=new Trans();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    mainActiveIndex: 0,
    imageURL: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
    avatar:'',
    nickName:'',
    tel:'',
    entryList:[],
    verifyEntryList:[],
    isAdmin:'0',
    rootUrl: '',
    height: '500px',
    treeNav:[
      {
        text: '进场单', 
        disabled: false
      }, 
      {
        text: '委托单', 
        disabled: false 
      }, 
      { 
        text: '进场审核', 
        disabled: true
      }, { 
        text: '委托审核',
        disabled: true
      }
    ],
    actions: [
      { text: '全部', value: '0' },
      { text: '待审核', value: '1' },
      { text: '已通过', value: '2' },
      { text: '未通过', value: '3' }
    ],
    types: ['0','0','0','0'],
    show1: '0',
    choice1: '全部',
    choice3: '全部'
  },

  selectType1(event){
    console.log(event.detail);
    this.setData({
      show1: event.detail
    });
    console.log(this.data.show1);
    if(this.data.mainActiveIndex==0) {
      wx.redirectTo({
        url: '/pages/me/me?id1='+event.detail+'&id2='+this.data.types[1]+'&id3='+this.data.types[2]+'&id4='+this.data.types[3]+'&index=0',
      })
    } else if(this.data.mainActiveIndex==2) {
      wx.redirectTo({
        url: '/pages/me/me?id1='+this.data.types[0]+'&id2='+this.data.types[1]+'&id3='+event.detail+'&id4='+this.data.types[3]+'&index=2',
      })
    }
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  onClickItem({ detail = {} }) {
    const { activeId } = this.data;
    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }
    this.setData({ activeId });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rootUrl: app.globalData.rootUrl
    });
    console.log(options);
    // this.getPhoneHeight();
    this.pageInfo(options);
    this.queryMyInfo();
    this.isAdminOrNot();
    this.queryList();
  },
  pageInfo(options) {
    
    if(options == null || options == undefined || Object.keys(options).length == 0) {
      return;
    }
    console.log(options);
    if(options.id1 != undefined && options.id1 != null) {
      this.setData({
        "types[0]":options.id1,
        show1:this.data.actions[parseInt(options.id1)].value
      });
    }
    if(options.id2 != undefined && options.id2 != null) {
      this.setData({
        "types[1]":options.id2
      });
    }
    if(options.id3 != undefined && options.id3 != null) {
      this.setData({
        "types[2]":options.id3,
        show1:this.data.actions[parseInt(options.id3)].value
      });
    }
    if(options.id4 != undefined && options.id4 != null) {
      this.setData({
        "types[3]":options.id4
      });
    }
    if(options.index != undefined && options.index != null) {
      this.setData({
        mainActiveIndex:parseInt(options.index) || 0
      });
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.redirectTo({
	  //加载页面地址
      url: '/pages/me/me?id1='+this.data.types[0]+'&id2='+this.data.types[1]+'&id3='+this.data.types[2]+'&id4='+this.data.types[3]+'&index='+this.data.mainActiveIndex,
      success:function(res){
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  backTpMenu: function(){
    wx.redirectTo({
      url: '/pages/menu/menu',
    })
  },
  directToDetail: function(arg){
    console.log(arg.currentTarget.dataset.message);
    var id = arg.currentTarget.dataset.message;
    wx.navigateTo({
      url: '/pages/entryDetail/entryDetail'+'?entryNo='+id,
    })
  },
  directToVerify: function(arg){
    console.log(arg.currentTarget.dataset.message);
    var id = arg.currentTarget.dataset.message;
    wx.navigateTo({
      url: '/pages/verify/verify'+'?entryNo='+id,
    })
  },
  queryMyInfo(){
    var api = this.data.rootUrl+'/weapp/queryMyInfo/'
    trans.transmitData(api,{},'',(data) => {
      console.log(data);
      if(data == undefined || data==null) {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        this.setData({
          avatar:this.data.imageURL,
          tel:'',
          nickName:'昵称'
        });
        return;
      }
      this.setData({
        avatar:data.avatarUrl,
        tel:data.phoneNumber,
        nickName:data.nickName
      });
    });
  },
  swipeEntry(event) {
    var id = event.currentTarget.dataset.message;
    const { position, name } = event.detail;
    switch (position) {
      case 'right':
        //从后台读取数据
        Dialog.confirm({
          title: '确认删除'
        })
        .then(() => {
          Dialog.close();
          var api = this.data.rootUrl+'/weapp/removeEntry/';
          trans.transmitData(api,{entryNo:id},'',(data) => {
            if(data == undefined || data==null) {
              // Dialog.alert({
              //   title: '数据同步失败，请稍后重试'
              // });
              return;
            } 
            this.queryEntryList();
          });
        })
        .catch(() => {
          Dialog.close();
        });
        this.onLoad();
        break;
    }
  },
  swipeEntryVerify(event) {
    var id = event.currentTarget.dataset.message;
    const { position, name } = event.detail;
    switch (position) {
      case 'right':
        //从后台读取数据
        Dialog.confirm({
          title: '确认删除'
        })
        .then(() => {
          Dialog.close();
          var api = this.data.rootUrl+'/weapp/removeVerifyEntry/';
          trans.transmitData(api,{entryNo:id},'',(data) => {
            if(data == undefined || data==null) {
              // Dialog.alert({
              //   title: '数据同步失败，请稍后重试'
              // });
              return;
            }
            this.queryVerifiedEntryList();
          });
        })
        .catch(() => {
          Dialog.close();
        });
        this.onLoad();
        break;
    }
  },
  queryEntryList(){
    var api = this.data.rootUrl+'/weapp/queryEntryList/';
    trans.transmitData(api,{'type':this.data.types[0]},'',(data) => {
      if(data == undefined || data==null) {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      this.setData({
        entryList:data
      });
    });
  },
  queryVerifiedEntryList(){
    var api = this.data.rootUrl+'/weapp/queryVerifiedEntryList/';
    trans.transmitData(api,{'type':this.data.types[2]},'',(data) => {
      console.log(data);
      if(data == undefined || data==null) {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      this.setData({
        verifyEntryList:data
      });
    });
  },
  isAdminOrNot(){
    var api = this.data.rootUrl+'/weapp/isEntryAdmin/';
    trans.transmitData(api,{},'',(data) => {
      if(data == undefined || data==null) {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      this.setData({
        isAdmin:data.id,
        'treeNav[2].disabled':!(data.id=='3' || data.id=='1'),
        'treeNav[3].disabled':!(data.id=='3' || data.id=='2'),
      });
      this.setData({
        'treeNav[1].disabled':true,
        'treeNav[3].disabled':true,
      });
    });
  },
  queryList() {
    this.queryEntryList();
    this.queryVerifiedEntryList();
  },
  // getPhoneHeight(){
  //   var that = this;
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       that.setData({
  //         height: res.windowHeight - (res.windowWidth / 750) * 94 + "px"
  //       })
  //     }
  //   })
  //   console.log(this.data.height);
  // }
})
