// pages/song/song.js
// 引入第三方库pubsub-js
import PubSub from 'pubsub-js'
// 引入格式化时间的第三方库
import moment from 'moment'
// 引入request
import request from '../../utils/request'

// 获取全局数据对象
let globalData = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设置一个变量控制动画
    isPlay:false,
    songDetail:{},
    musicId:'',
    musicUrl:'',
    // 音乐总时间
    totalTime:'00:00',
    // 音乐实时时间
    musicTime:'00:00',
    // 进度条长度
    carberWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options可以接收到上级路由跳转过来时所携带的query参数
    // 获取歌曲id
    let musicId = options.musicId
    
    // 更新musicID
    this.setData({
      musicId
    })
    // 生成背景音乐控制器,这个是全局唯一的，可以直接放到this上
    this.backgroundAudioManager =  wx.getBackgroundAudioManager()
    // 获取歌曲详情
    this.getSongDetail(musicId)
    // 首先先判断一下全局数据中的音乐播放状态，并且是否是当前音乐，如果是则更改音乐播放状态
    if(globalData.musicPlay && globalData.musicId === musicId){
      this.setData({
        isPlay:globalData.musicPlay
      })
    }
    // 监听音乐的播放状态事件,用于解决系统音乐控制与页面音乐控制不一致的问题
    this.backgroundAudioManager.onPlay(()=>{
      // 修改音乐的状态isPlay为true
      this.updateData(true)
    })
    // 监听音乐暂停播放的事件
    this.backgroundAudioManager.onPause(()=>{
      // 修改音乐的状态isPlay为false
      this.updateData(false)
    })
    // 监听音乐停止事件，注意不是音乐播放完毕自然停止事件
    this.backgroundAudioManager.onStop(()=>{
      // 更改音乐的状态isPlay为false
      this.updateData(false)
    })
    // 监听音乐实时播放事件
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // 获取其实时播放时间,这个时间单位是秒，需要转换为毫秒
      // console.log(this.backgroundAudioManager.currentTime)
      let musicTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 获取其总时长，然后计算出总时长和当前播放时间之间的比例关系，然后乘以进度条总长度
      let carberWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 450
      // 更新进度条长度
      this.setData({
        musicTime,
        carberWidth
      })
    })
    // 监听音乐播放完毕自然结束事件，自动跳转到下一首歌
    this.backgroundAudioManager.onEnded(()=>{
      // 直接发布消息跳转到下一首,消息类型明确为next
      PubSub.publish('musicType','next')
      // 修改data中的时间
      this.setData({
        musicTime:'00:00',
        carberWidth:0
      })
    })
  },
  // 专门用于更新data中的数据函数
  updateData(isPlay){
    // 更新data中的数据
    this.setData({
      isPlay
    })
    // 更新全局globalData中的数据
    globalData.musicPlay = isPlay
  },
  // 点击播放时修改isPlay的状态
  handleSongPlay(){
    // 获取当前状态，并取反
    let isPlay = !this.data.isPlay
    // 更新data中的状态
    this.setData({
      isPlay
    })
    
    // 点击播放按钮，开始播放音乐
    this.getMusicUrl(this.data.musicId)

  },
  // 获取歌曲的详细信息
  async getSongDetail(musicId){
    let result = await request('/song/detail',{ids:musicId})
    // 给数据中添加id字段
    result.data.songs[0].id = musicId>>>0
    // 获取歌曲总时间，并使用moment格式化时间，格式为mm:ss
    let totalTime = moment(result.data.songs[0].dt).format('mm:ss')
    // 更新data中的数据
    this.setData({
      songDetail:result.data.songs[0],
      // 跟新歌曲总时间
      totalTime
    })
    //将歌曲名称更新到导航栏信息中
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name,
    })
    
  },
  // 获取歌曲url，然后播放歌曲，当背景音乐
  async getMusicUrl(musicId){ 
    // 获取播放、暂停状态
    let {isPlay,musicUrl} = this.data
    // 更新全局数据中的音乐id，只有在点击播放的时候才更新全局数据中的音乐id
    globalData.musicId = musicId
    // 判断状态
    if(isPlay){
      if(!musicUrl){
        // 获取musicUrl
        let musicUrl = await request('/song/url',{id:musicId})
        // console.log(musicUrl)
        // 将musicUrl更新到data中
        this.setData({
          musicUrl:musicUrl.data.data[0].url
        })
      }
      // 将音乐地址赋予控制器中的src属性上
      this.backgroundAudioManager.src = this.data.musicUrl
      // 给控制的的歌曲赋予标题，否则无法播放
      this.backgroundAudioManager.title = this.data.songDetail.name
    }else{
      this.backgroundAudioManager.pause()
    }
    
  },
  // 歌曲上一首，下一首功能
  handleSwitch(event){
    let type = event.currentTarget.id
    // 更改播放状态之前，先把之前的歌曲停掉
    // this.backgroundAudioManager.stop()
    // 清空this.data中的musicUrl的值
    this.setData({
      musicUrl:''
    })
    // 开启订阅，需要在发布之前，订阅recommendSong页面发送来的id
    PubSub.subscribe('musicId',(msg,musicId)=>{
      console.log(musicId)
      
      // 获取歌曲详情
      this.getSongDetail(musicId)
      // 获取歌曲url
      this.getMusicUrl(musicId)
      
      // 更改播放状态
      this.updateData(true)
      // 每次点击最后都需要关掉订阅
      PubSub.unsubscribe('musicId')
    })
    // 开启发布，将数据发送到recommendSong页面中
    PubSub.publish('musicType',type)
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