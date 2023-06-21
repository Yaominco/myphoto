const app=getApp();
  const req=function(opts){
    opts.url = app.globalData.rootPath+opts.url;
  return new Promise((resolve,reject)=>{
    opts.success=(res)=>{
      resolve(res);
    }
    wx.request(opts);
  })

  }

  module.exports={
    req
  }