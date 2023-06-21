const app = getApp()
const {req}=require("../../utils/repuest")
Page({
  /**
   * 页面的初始数据
   */
  data: {
      photoList:[],
      index:0,
      photo:{},
      isFm:false,
      uploadTime:'',
      startPoint:0,
      startFlag:false,
      cover:{},
      coverLength:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(res) {
      let photoList = JSON.parse(res.photoList);
      let index = res.index;
      let coverLength = res.coverLength;
      let photo = photoList[index];
      let uploadTime = new Date(Number.parseInt(photo.uploadTimestamp));
      let s = uploadTime.toLocaleString();
      this.setData({
        photoList:photoList,
        photo:photo,
        uploadTime:s,
        index:index,
        coverLength:coverLength
      });
      this.selectCover();
  },
  selectCover(){
    req({
      url:'/cover/getOne?accId='+app.globalData.userInfo.accId+"&photoId="+this.data.photo.photoId,
      method:'GET'
    }).then(res=>{
      if(res.data){
        this.setData({
          cover:res.data,
          isFm:true
        });
      }else{
        this.setData({
          isFm:false
        });
      }
    })
  },
  fm(){
    console.log(this.data.isFm);
    if(!this.data.isFm){
      console.log(this.data.coverLength);
      if(this.data.coverLength<4){
        req({
          url:'/cover/save',
          method:'POST',
          header:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
          data:{accId:app.globalData.userInfo.accId,
                photoId:this.data.photo.photoId,
                accessUrl:this.data.photo.photoAccessUrl
          }
        }).then(res=>{
          this.setData({
            coverLength:Number.parseInt(this.data.coverLength)+1
          });
          this.selectCover();
        })
      }else{
        wx.showM({
          title: '封面只能设置四个',
        })
      }
    }else{
      req({
        url:'/cover/delete?coverId='+this.data.cover.coverId,
        method:'GET'
      }).then(res=>{
        this.setData({
          coverLength:Number.parseInt(this.data.coverLength)-1
        });
        this.selectCover();
      })
    }
  },
  start(e){
    this.setData({
      startPoint:e.touches[0].clientX,
      startFlag:true
    })
  },
  end(e){
    let point = this.data.startPoint;
    if(((point-e.touches[e.touches.length-1].clientX)>50) && this.data.startFlag){
      let index = this.data.index;
      console.log(index);
      if(index-1<0){
        index = this.data.photoList.length-1;
      }else{
        index = index-1;
      }
      let photo = this.data.photoList[index];
      let uploadTime = new Date(Number.parseInt(photo.uploadTimestamp));
      let s = uploadTime.toLocaleString();
      this.setData({
        photo:photo,
        index:index,
        uploadTime:s,
        startFlag:false,
        startPoint:0
      });
    }else if(((point-e.touches[e.touches.length-1].clientX)<-50) && this.data.startFlag) {
      let index = this.data.index;
      console.log(index);
      if(index+1>this.data.photoList.length-1){
        index = 0;
      }else{
        index = index+1;
      }
      let photo = this.data.photoList[index];
      let uploadTime = new Date(Number.parseInt(photo.uploadTimestamp));
      let s = uploadTime.toLocaleString();
      this.setData({
        photo:photo,
        index:index,
        uploadTime:s,
        startFlag:false,
        startPoint:0
      });
    }
    this.selectCover();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})