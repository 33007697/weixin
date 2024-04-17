// pages/index/index.js
// 引入request请求功能函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    banners:[],
    // 推荐歌曲数据
    personalized:[],
    // 排行榜数据
    topList:[],
    topListData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 使用async异步方法
  async onLoad(options) {
    // 发送网络请求，获取轮播图数据，使用wx.request()
    // 但是我们已经封装一个request功能函数，使用这个即可
    let banners = await request('/banner',{type:1})
    // 将请求来的数据保存起来
    this.setData({banners:banners.data.banners})

    // 发送网络请求，获取每日推荐歌曲的列表,并传入参数
    let result = await request('/personalized',{limit:10})
    // 将数据保存起来
    this.setData({
      personalized:result.data.result
    })
    
    // 发送网络请求，获取排行榜数据，并传入idx参数
    let toplist = await request('/toplist')
    // console.log(toplist)
    // 然后将数据输入data中的topList中
    this.setData({
      topList:toplist.data.list.slice(0,5)
    })
    let listData = []
    //循环开始，获取5类数据，0-4
    for(let i=0;i<this.data.topList.length;i++){
      let topListData = await request('/playlist/detail',{id:this.data.topList[i].id})
      // console.log(topListData)
      // 将数据更新到data中
      let Data = {
        id:topListData.data.playlist.id,
        name:topListData.data.playlist.name,
        lists:topListData.data.playlist.tracks.slice(0,3)
      }
      // 将数据加入listData中
      listData.push(Data)
    }
    // 将数据更新到data中
    this.setData({
      topListData:listData
    })
  },
  navRecommend(){
    wx.navigateTo({
      url: '/packagesA/recommendSong/recommendSong',
    })
  },
  navOther(){
    wx.navigateTo({
      url: '/packagesB/template/template',
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