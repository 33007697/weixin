// pages/recommendSong/recommendSong.js
// 引入第三方库pubsub-js
import PubSub from 'pubsub-js'
// 引入request
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 日期
    day:'',
    mouth:'',
    songLists:[],
    // 当前点击的音乐的下标
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断一下用户是否有授权登录
    let cookie = wx.getStorageSync('cookie')
    // 如果没有授权，需要登录
    if(!cookie){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 跳转到登录界面
          wx.reLaunch({
            url: '/pages/logins/logins',
          })
        }
      })
    }
    // 更新日期
    this.setData({
      day:new Date().getDate(),
      mouth:new Date().getMonth() + 1
    })
    // 获取每日推荐歌曲列表
    this.getRecommedSongList()
    // 开启订阅，接收song页面传递的数据
    PubSub.subscribe('musicType',(msg,type)=>{
      // 获取当前点击歌曲的index下标和数据列表
      let {index,songLists} = this.data
      // 然后判断type的值
      if(type === 'prev'){
        // 计算index的值
        index -= 1
      }else{
        index += 1
      }
      // 限制index的值的范围
      if(index < 0){
        index = songLists.length - 1
      }else if(index >= songLists.length){
        index = 0
      }
      // 然后更新index的值
      this.setData({
        index
      })
      // 然后发布消息将数据发送给song页面
      PubSub.publish('musicId',songLists[index].id)

    })
  },
  // 获取每日推荐歌曲列表
  async getRecommedSongList(){
    // 发送请求获取数据
    let SongList = await request('/personalized/newsong',{limit:30})
    // console.log(SongList)
    // 更新列表数据
    this.setData({
      songLists:SongList.data.result
    })
  },
  // 点击跳转的歌曲详情页面
  handleSongDetail(event){
    // 获取歌曲的id
    let musicId = event.currentTarget.id
    // 获取当前点击歌曲的下标
    let index = event.currentTarget.dataset.index
    // 更新index到数据data中
    this.setData({
      index
    })
    // 跳转歌曲详情页面，并且把歌曲id传递过去，只能使用query参数
    wx.navigateTo({
      url: '/packagesA/song/song?musicId=' + musicId,
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