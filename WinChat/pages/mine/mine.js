const app=getApp();
const {req} =require("../../utils/repuest")
Page({
  data:{
    hasUserInfo:false,
    isModify:false,
    btnTitle:'修改昵称',
     userInfo:{
      avatarUrl:'http://localhost:8089/myhome/photo/1.png',
      nickName:'当前用户昵称'
     }
  },
  onLoad(){
    let userInfo=app.globalData.userInfo;
    if(userInfo){
      if(!userInfo.avatarUrl.startsWith("http")){
        userInfo.avatarUrl=app.globalData.rootPath+userInfo.avatarUrl;
      }
      this.setData({
        userInfo:userInfo,
        hasUserInfo:true
      })
    }
  },
getUserInfo(){
   wx.getUserProfile({
     desc: 'desc',
     success:(res)=>{
       let userinfo=res.userInfo;
      //  userinfo.accId='';
       this.setData({
         userinfo:userinfo,
         hasUserInfo:true,
         nickName:this.data.nickName
       })
       this.saveUserInfo();
     }
   })
  },
  async saveUserInfo(){
    let userInfo=this.data.userinfo;
    let code=(await(await wx.login())).code;
    req({
      url:"/account/save",
      method:"POST",
      header:{'content-type':'application/x-www-form-urlencoded'},
      data:{...userInfo,code},
    }).then((res)=>{
      let accId=res.data;
      if(accId){
        userInfo.accId=accId;
        app.globalData.getUserInfo=userInfo;
        this.setData({userinfo:userInfo})
      }
    });
  },
  modifynickname(e){
    let isModify=this.data.isModify;
    if(!isModify){
      this.setData({
        isModify: true,
      inputPlaceholder: "请输入新昵称",
      btnTitle: "确定修改"
      })
    }else{
      this.setData({
        isModify: false,
      inputPlaceholder: "当前昵称",
      btnTitle: "修改昵称"
      })
      this.updateNickName;
    }
  },
  updateNickName(e){
    let userInfo=this.data.userInfo;
    let nickName = e.detail.value.nickName; // 假设昵称输入框的值为nickName
  let accId = userInfo.accId; // 假设用户的accid存在于userInfo中

  // 调用req方法访问服务器实现昵称修改
  req({
    url: 'http://localhost:8089/myhome/account/modifyNickName',
    method: 'POST',
    data: {
      nickName: nickName,
      accId:accId
    },
    success: function(response) {
      // 根据服务器返回的结果进行相应的处理
      console.log('昵称修改成功', response);
      // 可以根据需要更新页面的数据或进行其他操作
    },
    fail: function(error) {
      console.log('昵称修改失败', error);
      // 可以根据需要进行错误处理或提示用户
    }
  });
  },
  uploadAvatar(filePath){
    wx.uploadFile({
      
      filePath: filePath,
      name: 'avatar',
      url:"http://localhost:8089/myhome/account/uploadAvatar",
      formData:{accId:this.data.userinfo.accId},
      success(res){
        let avatarUrl=res.data;
        if(avatarUrl){
          this.setData({
            "userinfo.avatarUrl":app.globalData.rootPath+avatarUrl
          })
        }
      }
    })
  },
  modifyAvatar(){
    wx.chooseMedia({
      count:1,
      mediaType:'image',
      sourceType:'album'
    }).then(res=>{
      let avatarUrl=res.tempFiles[0].tempFilePath;
      this.setData({
        'userinfo.avatarUrl':avatarUrl
      })
      this.uploadAvatar(avatarUrl);
    }).catch(res=>{})
  }
})
