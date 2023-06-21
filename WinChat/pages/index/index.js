// index.js
// 获取应用实例
const app = getApp()
const {req}=require("../../utils/repuest")

Page({
  data: {
    covers:[],
    photoList:[],
    delSelect:false,
    selectList:[],
    pageNum:1,
    loadding:true,
    currentIndex:0
  },
  selectPhotoList(){
    this.setData({loadding:true});
    req({
      url:"/photo/list",
      data:{
        accId:app.globalData.userInfo.accId,
        pageNum:this.data.pageNum
      }
    }).then(res=>{
      let photoList = res.data;
      if(photoList.length > 0){
        for(let photo of photoList){
          photo.photoAccessUrl = app.globalData.rootPath+photo.photoAccessUrl;
        }
        this.setData({
          photoList:this.data.photoList.concat(photoList),
          pageNum:this.data.pageNum+1
        })
      }else{
        // wx.showToast({
        //   title: '图片以全部加载',
        // })
      }
      this.setData({
        loadding:false
      })
    })
  },

  onLoad() {
    let time = setInterval(()=>{
      let userInfo = app.globalData.userInfo;
      if(userInfo){
        clearInterval(time);
        this.selectCover();
        this.selectPhotoList();
      }
    },1000);
  },
  onPullDownRefresh(){
    this.setData({
      covers:[],
      photoList:[],
      pageNum:1,
      currentIndex:0
    });
    this.selectCover();
    this.selectPhotoList();
  },
  enabelDelSelect(){
    this.setData({
      delSelect:true
    });
  },
  cancelSelect(){
    this.setData({
      selectList:[],
      delSelect:false
    });
  },
  onReachBottom(){
    console.log(this.data.pageNum);
    this.setData({loadding:true});
    this.selectPhotoList();
  },
  checkedPhoto(e){
    let index = e.mark.index;
    let photoId = e.mark.photoId;
    let selectList = this.data.selectList;
    if(selectList[index]){
      selectList[index]=undefined;
    }else{
      selectList[index]=photoId;
    }
    this.setData({
      selectList:selectList
    })
  },
  selectAll(){
    let selectList = [];
    let photoList = this.data.photoList;
    for(let photo of photoList){
      selectList.push(photo.photoId);
    }
    this.setData({
      selectList:selectList
    });
  },
  deletePhoto(){
    let selectList = this.data.selectList;
    let deleteList = '';
    for(let id of selectList){
      if(id){
        deleteList+='&photoIds='+id;
      }
    }
    if(deleteList == ''){
      wx.showToast({
        title: '请勾选要删除的照片',
      })
    }else{
      wx.showModal({
        title: '确定要删除选中的照片吗？',
        content: '',
        complete: (res) => {
          if (res.cancel) {
              
          }
          if (res.confirm) {
            req({
              url:"/photo/delete?photoIds=''"+deleteList,
              method:"GET"
            }).then(res=>{
              this.setData({
                photoList:[],
                pageNum:1
              });
              this.cancelSelect();
              this.selectPhotoList();
            })
          }
        }
      })
    }
  },
  showImage(e){
    let index = e.mark.index;
    let photoList = this.data.photoList;
    wx.navigateTo({
      url: '/pages/detail/datail?photoList='+JSON.stringify(photoList)+"&index="+index+"&coverLength="+this.data.covers.length,
    })
  },
  selectCover(){
    req({
      url:'/cover/list?accId='+app.globalData.userInfo.accId,
      method:'GET',
    }).then(res=>{
      let cover = res.data;
      console.log(cover);
      this.setData({
        covers:cover,
        currentIndex:0
      })
    })
  },
  onShow(){
        // this.selectCover();
        // this.selectPhotoList();
  }
})
