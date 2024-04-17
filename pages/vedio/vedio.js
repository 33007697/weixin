// pages/vedio/vedio.js
// 引入request
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vedioList:[],
    vedioListData:[],
    navId:'',
    vid:'',
    videoUrl:{},
    historyTimes:[],
    isScroll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVedioList()
  },
  // 发送请求获取视频列表
  async getVedioList(){
    let result = await request('/video/group/list')
    
    if(result.statusCode === 200){
      // 更新数据，只统计14个数据
      this.setData({
        vedioList:result.data.data.slice(0,14),
        navId:result.data.data[0].id
      })
    }
    // 调用获取视频数据函数
    this.getVedioGroup(this.data.navId)
  }, 
  // 获取视频数据
  async getVedioGroup(navId){
    // 发送请求获取数据
    let vedios = await request('/video/group',{id:navId})
    // console.log(navId)
    // console.log(vedios)
    // 获取到数据后，关闭加载
    wx.hideLoading()
    // 获取到数据后关闭下拉刷新
    this.setData({
      isScroll:false
    })
    if(vedios.data.code === 200){ 
      // 处理一下数据，给数据中添加一个id属性
      let index = 0
      let vedioListData = vedios.data.datas.map(item=>{
          item.id = index++
          return item
      })  
      // 将数据保存到本地中
      this.setData({
        vedioListData,
      })
      
    }
  },
   // 点击获取数据
   showVedios(event){
    // 获取当前点击的标签的id
    let navId = event.currentTarget.id
    // 直接清空vedioListData中的视频数据
    this.setData({
      vedioListData:[]
    })
    // 显示加载中
    wx.showLoading({
      title: '正在加载中',
    })
    // 修改data中的navId
    this.setData({
      // 使用位移运输符，强制将字符串转化为数字，因为event.currentTarget.id获取到的值会自动转化为字符串
      navId:navId>>>0
    })
    this.getVedioGroup(this.data.navId)
  },
 
  // 获取视频的url
  async getVideoUrl(vid){
    let result = await request('/video/url',{id:vid})
    // 将视频的url更新到data中
    if(result.data.code === 200){
      this.setData({
        videoUrl:result.data.urls[0]
      })
    }
  },
  // 获取播放时长
  getVedioTime(event){
    // 获取时长
    let {historyTimes} = this.data
    // 数据
    let videoObj = {
      id:event.currentTarget.id,
      time:event.detail.currentTime
    }
    // 首先判断一下该数组中是否有相同id的数据
    let videoItem = historyTimes.find(item => item.id === videoObj.id)
    if(videoItem){
      videoItem.time = event.detail.currentTime
    }else{
      // 将时间放到historyTimes中
      historyTimes.push(videoObj)
    }
    
    // 将数据保存到data中
    this.setData({
      historyTimes
    })
  },
   //  点击图片时，自动播放
   contarlPlay(event){
    // 获取该视频的vid
    let vid = event.currentTarget.id
    // 将视频vid保存到data中
    this.setData({
      vid
    })
    // 获取视频的url
    this.getVideoUrl(vid)
    // 生成视频播放控制器
    this.videoContext = wx.createVideoContext(vid)
    // 判断一下当前id是否有历史记录
    let {historyTimes} = this.data
    let videoItem = historyTimes.find(item => item.id === vid)
    // console.log(videoItem)
    // 如果有记录，则直接跳转到该记录上
    if(videoItem){
      console.log(videoItem.time)
      this.videoContext.seek(videoItem.time)
    }
    // 视频开始播放
    this.videoContext.play()
  },
  // 视频播放完毕后执行
  getVedioEnd(event){
    let id = event.currentTarget.id
    let {historyTimes} = this.data
    // 清除当前id的对象
    let index = historyTimes.findIndex(item => item.id === id)
    historyTimes.splice(index,1)
    // 更新historyTimes
    this.setData({
      historyTimes
    })
  },
  // 下拉刷新时被触发
  handleSherre(){
    // 重新获取列表
    let {navId} = this.data
    console.log('网易云音乐下拉加载')
    // 更改下拉刷新设置
    this.setData({
      isScroll:true
    })
    this.getVedioGroup(navId)
  },
  // 上拉加载时被触发
  handleLower(){
    console.log('网易云音乐没有分页功能')
  },
  // 点击搜索按钮，跳转到搜索页面
  goSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
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
    console.log('页面下拉刷新时触发事件')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('用户上拉触底时触发事件')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    // 用户点击分享，可以获取到用户使用的是哪个功能按钮点击的分享，有buttom和menu
    console.log(res)
    if(res.from === 'button'){
      // 自定义返回内容，必须返回一个对象
      return {
        title:'来自button按钮的分享',     //返回的信息
        path:'/pages/vedio/vedio',       //返回的页面地址
        imageUrl:'/static/images/nvsheng.jpg'   //返回的图片
      }
    }else{
      return {
        title:'来自menu按钮的分享',
        path:'/pages/vedio/vedio',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
  }
})