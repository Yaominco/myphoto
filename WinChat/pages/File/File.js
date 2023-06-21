//获取应用实例  
var app = getApp();
Page({
  data: {
    filePath:"/pages/images/2-2.png",
    mode:"center",
    isSelectImg:false
  },
  selectPhoto(){
    wx.chooseMedia({
      count:1,
      mediaType:'image',
      sourceType:'album'
    }).then(res=>{
      let filePath = res.tempFiles[0].tempFilePath;
      this.setData({
        filePath:filePath,
        isSelectImg:true
      })
    }).catch(res=>{})
},
uploadPhoto(){
  let _this = this;
  wx.uploadFile({
    filePath: this.data.filePath,
    name: 'file',
    url: getApp().globalData.rootPath+'/photo/upload',
    formData:{accId: getApp().globalData.userInfo.accId},
    success:res=>{
      console.log(res);
      if(res.data.replaceAll("\"","") =="1"){
        wx.showToast({
          title: '上传成功',
        })
      }else{
        wx.showToast({
          title: '上传失败',
          icon:"error"
        })
      }
      this.setData({
        filePath:"/pages/images/2-2.png",
        mode:"center",
        isSelectImg:false
      })
    }
  })
},
});