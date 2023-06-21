// app.js
App({
  async onLaunch(){
    let res=await wx.login();
    let code=res.code;

    wx.request({
      url: this.globalData.rootPath+'/account/getUserInfo',
      data:{code},
      success:(result)=>{
        let userInfo=result.data;
        if (userInfo) {
          this.globalData.userInfo = userInfo;
          wx.redirectTo({
            url: '/pages/index/index',
          })
        } else {
          wx.redirectTo({
            url: '/pages/mine/mine'
          });
        }
      }
    })
  },
  globalData: {
    rootPath:"http://localhost:8089/myhome_war_exploded",
    userInfo: null,
  },
})
